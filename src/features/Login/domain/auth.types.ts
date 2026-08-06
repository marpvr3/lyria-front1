/**
 * Tipos de dominio para la autenticación.
 *
 * Contrato tomado de `POST /api/v1/auth/login`. Los campos anulables se
 * declaran tal como los define el backend: normalizarlos es responsabilidad de
 * `services/auth.api.ts`, no de este archivo.
 *
 * Los tipos de la sesión persistida (`AuthSession`) viven en
 * `src/core/auth/authSession.ts`: la sesión es transversal a la aplicación y
 * `core/` no puede depender de una feature.
 */

/** Cuerpo exacto aceptado por `POST /api/v1/auth/login`. */
export interface LoginRequest {
  email: string | null;
  password: string | null;
}

/** Usuario tal como llega dentro de la respuesta de login. */
export interface AuthenticatedUserResponse {
  userId: string;
  name: string | null;
  lastName: string | null;
  email: string | null;
  status: string | null;
}

/** Respuesta 200 de `POST /api/v1/auth/login`. */
export interface AuthenticationResponse {
  tokenType: string | null;
  accessToken: string | null;
  /** Fecha UTC en formato ISO 8601. */
  accessTokenExpiresAtUtc: string;
  refreshToken: string | null;
  /** Fecha UTC en formato ISO 8601. */
  refreshTokenExpiresAtUtc: string;
  user: AuthenticatedUserResponse;
}

/**
 * Estado del formulario de login tal como lo edita la persona usuaria.
 *
 * `password` vive solo aquí y en el cuerpo de la petición: nunca se persiste.
 */
export interface LoginFormState {
  email: string;
  password: string;
}
