/**
 * Cliente HTTP mínimo basado en `fetch`.
 *
 * - Usa `env.apiBaseUrl` como URL base (ver `src/core/config/env.ts`).
 * - Normaliza la unión de base + path para evitar `/` duplicados o ausentes.
 * - Aplica un timeout por petición (`DEFAULT_TIMEOUT_MS`, configurable por llamada).
 *
 * Contrato de resultado (dos operaciones explícitas, sin `null as T`):
 * - `requestJson<T>()`  → exige cuerpo JSON válido; cualquier otra cosa lanza error.
 * - `requestVoid()`     → descarta el cuerpo; para 204 u operaciones sin respuesta.
 *
 * Errores (todos derivados de `Error`, ninguno silencioso):
 * - `HttpError`          → status fuera de 2xx (incluye `status`, `statusText`, `data`).
 * - `ResponseParseError` → respuesta 2xx cuyo cuerpo no es JSON válido o viene vacío
 *                          cuando se esperaba JSON.
 * - `TimeoutError`       → se agotó el tiempo de la petición.
 * - `NetworkError`       → fallo real de red/CORS o error leyendo el cuerpo.
 * - Si el llamador aborta con su propio `AbortSignal`, se propaga su error original.
 *
 * Nota: esta capa deja el consumo listo, pero todavía no se invoca ningún
 * endpoint real. No inventar rutas sin un contrato conocido.
 */

import { env } from "@/core/config/env";

/** Tiempo máximo por petición (fetch + lectura del cuerpo). */
const DEFAULT_TIMEOUT_MS = 15_000;

/** Máximo de caracteres del cuerpo incluidos en mensajes de diagnóstico. */
const BODY_PREVIEW_LIMIT = 200;

/** Error lanzado cuando el servidor responde con un status fuera del rango 2xx. */
export class HttpError extends Error {
  readonly status: number;
  readonly statusText: string;
  /**
   * Cuerpo de error: objeto si era JSON válido, texto crudo si no lo era,
   * `undefined` si venía vacío o no se pudo leer.
   */
  readonly data: unknown;

  constructor(status: number, statusText: string, data: unknown) {
    super(`HTTP ${status} ${statusText}`);
    this.name = "HttpError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

/** Error lanzado cuando la petición no llega a completarse (red, CORS, lectura del cuerpo). */
export class NetworkError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "NetworkError";
  }
}

/** Error lanzado cuando la petición supera el tiempo máximo configurado. */
export class TimeoutError extends Error {
  readonly timeoutMs: number;

  constructor(timeoutMs: number, options?: { cause?: unknown }) {
    super(`La petición superó el tiempo máximo de ${timeoutMs} ms.`, options);
    this.name = "TimeoutError";
    this.timeoutMs = timeoutMs;
  }
}

/** Error lanzado cuando una respuesta 2xx no contiene el JSON esperado. */
export class ResponseParseError extends Error {
  readonly contentType: string | null;
  readonly bodyPreview: string;

  constructor(
    message: string,
    details: { contentType: string | null; bodyPreview: string; cause?: unknown },
  ) {
    super(message, { cause: details.cause });
    this.name = "ResponseParseError";
    this.contentType = details.contentType;
    this.bodyPreview = details.bodyPreview;
  }
}

export type RequestOptions = Omit<RequestInit, "body"> & {
  /** Cuerpo serializable a JSON. Se serializa automáticamente. */
  json?: unknown;
  /** Timeout en ms. `0` o `Infinity` lo desactivan. Por defecto `DEFAULT_TIMEOUT_MS`. */
  timeoutMs?: number;
};

/** Une base y path evitando `/` duplicados o ausentes. */
function buildUrl(baseUrl: string, path: string): string {
  const normalizedPath = path.replace(/^\/+/, "");
  return normalizedPath ? `${baseUrl}/${normalizedPath}` : baseUrl;
}

/**
 * Combina las cabeceras por defecto con las del llamador.
 *
 * `new Headers(init)` acepta las tres formas de `HeadersInit` (instancia
 * `Headers`, array de tuplas y objeto plano), por lo que la fusión funciona
 * en todos los casos —a diferencia del spread de objetos, que perdía las
 * cabeceras de `Headers` y de los arrays—. Lo del llamador siempre gana.
 */
function buildHeaders(hasJsonBody: boolean, custom?: HeadersInit): Headers {
  const headers = new Headers({ Accept: "application/json" });

  if (hasJsonBody) {
    headers.set("Content-Type", "application/json");
  }

  if (custom !== undefined) {
    new Headers(custom).forEach((value, key) => {
      headers.set(key, value);
    });
  }

  return headers;
}

function previewOf(text: string): string {
  return text.length > BODY_PREVIEW_LIMIT
    ? `${text.slice(0, BODY_PREVIEW_LIMIT)}…`
    : text;
}

/** Lee el cuerpo de una respuesta de error sin enmascarar el status HTTP. */
async function readErrorData(response: Response): Promise<unknown> {
  let text: string;
  try {
    text = await response.text();
  } catch {
    // El status HTTP es más informativo que el fallo de lectura: no lo tapamos.
    return undefined;
  }

  if (!text) return undefined;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

/**
 * Ejecuta la petición y delega la interpretación del cuerpo en `parse`.
 *
 * El timeout cubre tanto el `fetch` como la lectura del cuerpo, y se limpia
 * siempre en el `finally`.
 */
async function execute<T>(
  path: string,
  options: RequestOptions,
  parse: (response: Response, text: string) => T,
): Promise<T> {
  const { json, headers, timeoutMs = DEFAULT_TIMEOUT_MS, signal, ...rest } = options;
  const hasJsonBody = json !== undefined;

  const init: RequestInit = {
    ...rest,
    headers: buildHeaders(hasJsonBody, headers),
    ...(hasJsonBody ? { body: JSON.stringify(json) } : {}),
  };

  const controller = new AbortController();
  const cleanups: Array<() => void> = [];
  let timedOut = false;

  if (Number.isFinite(timeoutMs) && timeoutMs > 0) {
    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);
    cleanups.push(() => clearTimeout(timeoutId));
  }

  if (signal) {
    if (signal.aborted) {
      controller.abort(signal.reason);
    } else {
      const onAbort = () => controller.abort(signal.reason);
      signal.addEventListener("abort", onAbort, { once: true });
      cleanups.push(() => signal.removeEventListener("abort", onAbort));
    }
  }

  /** Traduce cualquier fallo de transporte (fetch o lectura) a un error propio. */
  const toTransportError = (cause: unknown, action: string): Error => {
    if (timedOut) return new TimeoutError(timeoutMs, { cause });
    // Cancelación explícita del llamador: se respeta su error original.
    if (signal?.aborted) return cause instanceof Error ? cause : new Error(String(cause));
    return new NetworkError(
      `${action} Verifica tu conexión, la URL base o la configuración de CORS.`,
      { cause },
    );
  };

  try {
    let response: Response;
    try {
      response = await fetch(buildUrl(env.apiBaseUrl, path), {
        ...init,
        signal: controller.signal,
      });
    } catch (cause) {
      throw toTransportError(cause, "No se pudo conectar con el API.");
    }

    if (!response.ok) {
      throw new HttpError(
        response.status,
        response.statusText,
        await readErrorData(response),
      );
    }

    let text: string;
    try {
      text = await response.text();
    } catch (cause) {
      throw toTransportError(cause, "No se pudo leer el cuerpo de la respuesta.");
    }

    return parse(response, text);
  } finally {
    for (const cleanup of cleanups) cleanup();
  }
}

/**
 * Petición que **exige** un cuerpo JSON válido.
 *
 * Lanza `ResponseParseError` si la respuesta viene vacía (por ejemplo 204) o si
 * el cuerpo no es JSON válido; nunca devuelve `null`/texto crudo disfrazado de `T`.
 */
export function requestJson<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  return execute<T>(path, options, (response, text) => {
    const contentType = response.headers.get("Content-Type");

    if (text.trim() === "") {
      throw new ResponseParseError(
        `El API respondió ${response.status} sin cuerpo, pero se esperaba JSON. ` +
          "Si el endpoint no devuelve contenido, usa `requestVoid`.",
        { contentType, bodyPreview: "" },
      );
    }

    try {
      return JSON.parse(text) as T;
    } catch (cause) {
      throw new ResponseParseError(
        `El API respondió ${response.status} con un cuerpo que no es JSON válido ` +
          `(Content-Type: ${contentType ?? "desconocido"}).`,
        { contentType, bodyPreview: previewOf(text), cause },
      );
    }
  });
}

/**
 * Petición cuyo cuerpo se descarta.
 *
 * Pensada para 204 No Content u operaciones sin respuesta útil. El cuerpo se
 * consume y se ignora; solo se valida el status HTTP.
 */
export function requestVoid(
  path: string,
  options: RequestOptions = {},
): Promise<void> {
  return execute<void>(path, options, () => undefined);
}

export const apiClient = {
  /** Verbos que devuelven JSON tipado. */
  get: <T>(path: string, options?: RequestOptions) =>
    requestJson<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, json?: unknown, options?: RequestOptions) =>
    requestJson<T>(path, { ...options, method: "POST", json }),
  put: <T>(path: string, json?: unknown, options?: RequestOptions) =>
    requestJson<T>(path, { ...options, method: "PUT", json }),
  patch: <T>(path: string, json?: unknown, options?: RequestOptions) =>
    requestJson<T>(path, { ...options, method: "PATCH", json }),
  delete: <T>(path: string, options?: RequestOptions) =>
    requestJson<T>(path, { ...options, method: "DELETE" }),

  /** Primitivas explícitas: JSON obligatorio vs. respuesta sin cuerpo. */
  requestJson,
  requestVoid,
};
