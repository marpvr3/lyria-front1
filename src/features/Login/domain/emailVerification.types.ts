/**
 * Tipos de dominio para la verificación de correo posterior al registro.
 *
 * Contrato tomado de:
 * - `POST /api/v1/auth/email-verification/confirm` → 204 No Content
 * - `POST /api/v1/auth/email-verification/resend`  → 202 Accepted
 *
 * Ninguno de los dos endpoints devuelve cuerpo, por eso aquí solo se declaran
 * las peticiones: no hay tipos de respuesta que modelar.
 *
 * A diferencia del login y del registro, los campos no son anulables: la
 * pantalla valida antes de enviar (correo presente y código de 6 dígitos), de
 * modo que nunca se construye una petición con valores vacíos.
 */

/** Cuerpo exacto aceptado por `POST /api/v1/auth/email-verification/confirm`. */
export interface ConfirmEmailVerificationRequest {
  email: string;
  /** Código de 6 dígitos enviado por correo. Nunca se persiste ni se registra. */
  code: string;
}

/** Cuerpo exacto aceptado por `POST /api/v1/auth/email-verification/resend`. */
export interface ResendEmailVerificationRequest {
  email: string;
}
