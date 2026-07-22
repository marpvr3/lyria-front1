/**
 * Configuración de entorno tipada para el frontend.
 *
 * Reglas:
 * - Solo las variables prefijadas con `VITE_` son accesibles en el cliente.
 * - No almacenar secretos en variables `VITE_` (quedan expuestas en el bundle).
 * - La URL base del API se lee desde `VITE_API_BASE_URL` (ver `.env.example`).
 *
 * La validación se ejecuta al importar este módulo: si la configuración es
 * inválida la app falla de inmediato con un mensaje explícito, en lugar de
 * arrastrar una URL rota hasta la primera petición.
 *
 * Nota: esta configuración deja el valor listo para usar, pero el API
 * todavía no se consume desde ninguna parte de la aplicación.
 */

/** Protocolos aceptados para la URL base del API. */
const ALLOWED_PROTOCOLS = ["http:", "https:"] as const;

const HINT = "Defínela en tu archivo .env.local (ver .env.example).";

/**
 * Valida y normaliza la URL base del API.
 *
 * Normalización: se conserva `origin + pathname` sin `/` final, de modo que
 * `https://api.example.com/v1/` y `https://api.example.com/v1` produzcan el
 * mismo valor.
 */
function parseApiBaseUrl(rawValue: string | undefined): string {
  if (typeof rawValue !== "string" || rawValue.trim() === "") {
    throw new Error(`Falta la variable de entorno VITE_API_BASE_URL. ${HINT}`);
  }

  const value = rawValue.trim();

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(
      `VITE_API_BASE_URL no es una URL válida: "${value}". ` +
        `Debe incluir el protocolo, por ejemplo "https://api.example.com". ${HINT}`,
    );
  }

  if (!ALLOWED_PROTOCOLS.includes(url.protocol as (typeof ALLOWED_PROTOCOLS)[number])) {
    throw new Error(
      `VITE_API_BASE_URL usa un protocolo no permitido: "${url.protocol}". ` +
        `Solo se aceptan ${ALLOWED_PROTOCOLS.join(" y ")}.`,
    );
  }

  if (url.search || url.hash) {
    throw new Error(
      `VITE_API_BASE_URL no debe incluir query string ni fragmento: "${value}". ` +
        "Usa solo esquema, host y ruta base.",
    );
  }

  return `${url.origin}${url.pathname}`.replace(/\/+$/, "");
}

export const env = {
  /** URL base del API, validada y sin `/` final. */
  apiBaseUrl: parseApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
} as const;
