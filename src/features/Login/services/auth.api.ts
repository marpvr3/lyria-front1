/**
 * Servicio de API para el inicio de sesión.
 *
 * Endpoint: `POST /api/v1/auth/login`
 *
 * Todo el consumo pasa por `apiClient` (`src/core/http/apiClient.ts`); no se
 * usa `fetch` directo en componentes. El cuerpo enviado contiene únicamente
 * `email` y `password`, tal como define el contrato.
 *
 * La contraseña solo existe dentro de esta petición: no se guarda, no se
 * devuelve y no se registra en ningún log.
 */

import type { AuthSession } from "@/core/auth/authSession";

import {
  HttpError,
  NetworkError,
  TimeoutError,
  apiClient,
} from "@/core/http/apiClient";

import type {
  AuthenticationResponse,
  LoginFormState,
  LoginRequest,
} from "../domain/auth.types";

const LOGIN_PATH = "/api/v1/auth/login";

/** Valor usado cuando el backend no envía `tokenType`. */
const DEFAULT_TOKEN_TYPE = "Bearer";

/** Mensaje usado cuando el fallo no encaja en ningún caso conocido. */
const GENERIC_ERROR_MESSAGE = "No pudimos iniciar sesión. Intenta nuevamente.";

/**
 * Construye el cuerpo de `POST /api/v1/auth/login`.
 *
 * El objeto se arma campo por campo (sin `spread`) para que solo puedan salir
 * las dos claves del contrato. El correo se normaliza recortando espacios; la
 * contraseña se envía tal cual, porque los espacios pueden ser parte de ella.
 */
export function buildLoginRequest(form: LoginFormState): LoginRequest {
  return {
    email: form.email.trim() || null,
    password: form.password || null,
  };
}

/** Inicia sesión. Resuelve con la respuesta cruda del backend. */
export function login(payload: LoginRequest): Promise<AuthenticationResponse> {
  return apiClient.post<AuthenticationResponse>(LOGIN_PATH, payload);
}

/**
 * Convierte la respuesta del API en la sesión que se persiste.
 *
 * Devuelve `null` si la respuesta no trae un `accessToken` o un `userId`
 * utilizables: sin token real no se abre sesión, aunque el status sea 200.
 * Los campos nulos del contrato se normalizan a cadena vacía para que la UI no
 * tenga que defenderse de `null` en cada uso.
 */
export function toAuthSession(
  response: AuthenticationResponse,
): AuthSession | null {
  const accessToken = response?.accessToken?.trim();
  const userId = response?.user?.userId?.trim();

  if (!accessToken || !userId) return null;

  const refreshToken = response.refreshToken?.trim();

  return {
    tokenType: response.tokenType?.trim() || DEFAULT_TOKEN_TYPE,
    accessToken,
    accessTokenExpiresAtUtc: response.accessTokenExpiresAtUtc ?? "",
    refreshToken: refreshToken || null,
    refreshTokenExpiresAtUtc: response.refreshTokenExpiresAtUtc || null,
    user: {
      userId,
      name: response.user.name ?? "",
      lastName: response.user.lastName ?? "",
      email: response.user.email ?? "",
      status: response.user.status ?? "",
    },
  };
}

/**
 * Traduce cualquier fallo a un mensaje apto para la persona usuaria.
 *
 * Nunca expone status crudos, stacktraces, tokens ni el JSON de error del
 * backend. El 401 no distingue entre correo inexistente, contraseña incorrecta
 * y cuenta deshabilitada: hacerlo permitiría enumerar cuentas.
 */
export function getLoginErrorMessage(cause: unknown): string {
  if (cause instanceof HttpError) {
    if (cause.status === 400) return "Revisa los datos ingresados.";
    if (cause.status === 401) return "El correo o la contraseña no son válidos.";
    if (cause.status === 429) {
      return "Se superó el límite de intentos. Intenta nuevamente más tarde.";
    }
    return GENERIC_ERROR_MESSAGE;
  }

  if (cause instanceof TimeoutError) {
    return "La solicitud tardó demasiado. Intenta nuevamente.";
  }

  if (cause instanceof NetworkError) {
    return "No pudimos iniciar sesión. Verifica tu conexión e intenta nuevamente.";
  }

  return GENERIC_ERROR_MESSAGE;
}
