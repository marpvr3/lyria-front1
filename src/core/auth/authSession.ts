/**
 * Sesión de autenticación: único punto donde se guardan y se leen los tokens.
 *
 * Reglas de esta capa:
 * - La contraseña NUNCA se guarda ni se pasa por aquí.
 * - Los tokens no se imprimen en consola (ni completos ni parciales).
 * - Ningún componente accede a `localStorage` por su cuenta: todo pasa por
 *   `saveSession` / `loadSession` / `clearSession`.
 *
 * Almacenamiento: `localStorage`, para que la sesión sobreviva a recargas y a
 * cierres de pestaña. Es una decisión consciente de esta fase: al vivir en
 * almacenamiento accesible por JavaScript, un XSS podría leer los tokens. La
 * alternativa robusta (cookie `HttpOnly` emitida por el backend) requiere
 * soporte del servidor y queda pendiente.
 *
 * Pendiente (fuera del alcance de esta fase):
 * - Refresco automático con `POST /api/v1/auth/refresh` al vencer el access token.
 * - Cierre de sesión contra `POST /api/v1/auth/logout` (hoy solo se limpia el
 *   almacenamiento local).
 * - Rehidratar el usuario con `GET /api/v1/users/me`.
 */

import type { RequestOptions } from "@/core/http/apiClient";

/** Clave de almacenamiento. Con prefijo para no chocar con otras apps del mismo origen. */
const STORAGE_KEY = "lyria.auth.session";

/** Valor usado cuando el backend no envía `tokenType`. */
const DEFAULT_TOKEN_TYPE = "Bearer";

/** Usuario autenticado, ya normalizado (sin nulos que ensucien la UI). */
export interface AuthSessionUser {
  userId: string;
  name: string;
  lastName: string;
  email: string;
  status: string;
}

/**
 * Sesión persistida.
 *
 * `accessToken` es obligatorio: una sesión sin token no es una sesión. Las
 * fechas se guardan como el string ISO que envía el backend, sin reinterpretar.
 */
export interface AuthSession {
  tokenType: string;
  accessToken: string;
  accessTokenExpiresAtUtc: string;
  refreshToken: string | null;
  refreshTokenExpiresAtUtc: string | null;
  user: AuthSessionUser;
}

/** Lee `localStorage` sin propagar fallos (modo privado, cuota, storage bloqueado). */
function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

/**
 * Valida la forma de lo almacenado antes de devolverlo como `AuthSession`.
 *
 * El contenido de `localStorage` es texto arbitrario: puede venir de una
 * versión anterior de la app o estar manipulado. Si no cumple el mínimo
 * (token y usuario con id) se descarta en vez de arrastrar una sesión rota.
 */
function parseSession(raw: string): AuthSession | null {
  let value: unknown;

  try {
    value = JSON.parse(raw) as unknown;
  } catch {
    return null;
  }

  if (typeof value !== "object" || value === null) return null;

  const candidate = value as Partial<AuthSession>;
  const user = candidate.user;

  if (!isNonEmptyString(candidate.accessToken)) return null;
  if (typeof user !== "object" || user === null) return null;
  if (!isNonEmptyString(user.userId)) return null;

  return {
    tokenType: isNonEmptyString(candidate.tokenType)
      ? candidate.tokenType
      : DEFAULT_TOKEN_TYPE,
    accessToken: candidate.accessToken,
    accessTokenExpiresAtUtc:
      typeof candidate.accessTokenExpiresAtUtc === "string"
        ? candidate.accessTokenExpiresAtUtc
        : "",
    refreshToken: isNonEmptyString(candidate.refreshToken)
      ? candidate.refreshToken
      : null,
    refreshTokenExpiresAtUtc: isNonEmptyString(candidate.refreshTokenExpiresAtUtc)
      ? candidate.refreshTokenExpiresAtUtc
      : null,
    user: {
      userId: user.userId,
      name: typeof user.name === "string" ? user.name : "",
      lastName: typeof user.lastName === "string" ? user.lastName : "",
      email: typeof user.email === "string" ? user.email : "",
      status: typeof user.status === "string" ? user.status : "",
    },
  };
}

/**
 * Guarda la sesión.
 *
 * Devuelve `false` si el almacenamiento no está disponible; en ese caso la
 * sesión solo vive en memoria hasta la próxima recarga. No se lanza error: no
 * tiene sentido tumbar un login exitoso porque el navegador bloquee el storage.
 */
export function saveSession(session: AuthSession): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return true;
  } catch {
    return false;
  }
}

/** Devuelve la sesión almacenada, o `null` si no hay o es inválida. */
export function loadSession(): AuthSession | null {
  const raw = readRaw();
  if (raw === null) return null;

  const session = parseSession(raw);

  // Contenido corrupto o de un formato viejo: se limpia para no reintentar
  // parsearlo en cada lectura.
  if (session === null) {
    clearSession();
    return null;
  }

  return session;
}

/** Borra la sesión local. No llama al API (ver pendientes de la cabecera). */
export function clearSession(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Sin almacenamiento no hay nada que borrar.
  }
}

/** Token de acceso vigente en almacenamiento, o `null` si no hay sesión. */
export function getAccessToken(): string | null {
  return loadSession()?.accessToken ?? null;
}

/**
 * Indica si el access token ya venció.
 *
 * Una fecha ausente o ilegible se trata como vencida: es preferible pedir
 * login de nuevo que enviar un token que el backend rechazaría.
 */
export function isAccessTokenExpired(
  session: AuthSession,
  now: number = Date.now(),
): boolean {
  const expiresAt = Date.parse(session.accessTokenExpiresAtUtc);
  if (Number.isNaN(expiresAt)) return true;

  return expiresAt <= now;
}

/**
 * Añade `Authorization: Bearer {accessToken}` a las opciones de una petición.
 *
 * Pensado para las llamadas privadas que vengan después:
 *
 * ```ts
 * apiClient.get<Perfil>("/api/v1/users/me", withAuth());
 * ```
 *
 * Si no hay sesión devuelve las opciones sin tocar, de modo que los endpoints
 * públicos (login, registro, restricciones) siguen funcionando igual. No se
 * hace refresco automático: si el token está vencido el backend responderá 401
 * y el llamador decide qué hacer.
 */
export function withAuth(options: RequestOptions = {}): RequestOptions {
  const session = loadSession();
  if (session === null) return options;

  const headers = new Headers(options.headers);
  headers.set("Authorization", `${session.tokenType} ${session.accessToken}`);

  return { ...options, headers };
}
