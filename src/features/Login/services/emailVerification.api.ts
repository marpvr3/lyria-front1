/**
 * Servicio de API para la verificación de correo posterior al registro.
 *
 * Endpoints:
 * - `POST /api/v1/auth/email-verification/confirm` → 204 No Content
 * - `POST /api/v1/auth/email-verification/resend`  → 202 Accepted
 *
 * Ambos responden **sin cuerpo**, por eso se usa `requestVoid` y no
 * `apiClient.post`: este último exige JSON válido y lanzaría
 * `ResponseParseError` justo cuando la operación fue exitosa.
 *
 * Este servicio no crea sesión ni guarda tokens: verificar el correo habilita
 * la cuenta, pero el inicio de sesión sigue siendo un paso aparte.
 *
 * El código de verificación solo existe dentro de la petición: no se guarda, no
 * se devuelve y no se registra en ningún log.
 */

import {
  HttpError,
  NetworkError,
  TimeoutError,
  requestVoid,
} from "@/core/http/apiClient";

import type {
  ConfirmEmailVerificationRequest,
  ResendEmailVerificationRequest,
} from "../domain/emailVerification.types";

const CONFIRM_PATH = "/api/v1/auth/email-verification/confirm";
const RESEND_PATH = "/api/v1/auth/email-verification/resend";

/**
 * Mensaje único para cualquier código rechazado.
 *
 * El backend no distingue —ni debe distinguir de cara a la persona usuaria—
 * entre código incorrecto, vencido, ya usado, revocado o con los intentos
 * agotados: separarlos permitiría sondear el estado de una cuenta ajena.
 */
const INVALID_CODE_MESSAGE =
  "El código de verificación no es válido o ha vencido.";

/** Mensaje usado cuando el fallo al confirmar no encaja en ningún caso conocido. */
const GENERIC_CONFIRM_MESSAGE =
  "No pudimos verificar el correo. Intenta nuevamente.";

/** Mensaje usado cuando el fallo al reenviar no encaja en ningún caso conocido. */
const GENERIC_RESEND_MESSAGE =
  "No pudimos reenviar el código. Intenta nuevamente.";

/**
 * Respuesta 202 del reenvío.
 *
 * Es deliberadamente ambigua: el backend responde igual exista o no una cuenta
 * pendiente con ese correo, así que el mensaje tampoco puede afirmar que el
 * envío ocurrió.
 */
export const RESEND_ACCEPTED_MESSAGE =
  "Si existe una cuenta pendiente de verificación, se enviará un nuevo código.";

/**
 * Construye el cuerpo de `POST /api/v1/auth/email-verification/confirm`.
 *
 * El objeto se arma campo por campo (sin `spread`) para que solo puedan salir
 * las dos claves del contrato.
 */
export function buildConfirmEmailVerificationRequest(
  email: string,
  code: string,
): ConfirmEmailVerificationRequest {
  return {
    email: email.trim(),
    code: code.trim(),
  };
}

/** Construye el cuerpo de `POST /api/v1/auth/email-verification/resend`. */
export function buildResendEmailVerificationRequest(
  email: string,
): ResendEmailVerificationRequest {
  return {
    email: email.trim(),
  };
}

/** Confirma el código. Resuelve sin valor cuando el backend responde 204. */
export function confirmEmailVerification(
  payload: ConfirmEmailVerificationRequest,
): Promise<void> {
  return requestVoid(CONFIRM_PATH, { method: "POST", json: payload });
}

/** Solicita un código nuevo. Resuelve sin valor cuando el backend responde 202. */
export function resendEmailVerification(
  payload: ResendEmailVerificationRequest,
): Promise<void> {
  return requestVoid(RESEND_PATH, { method: "POST", json: payload });
}

/**
 * Traduce cualquier fallo de la confirmación a un mensaje apto para la persona
 * usuaria.
 *
 * Todo error 4xx (salvo el límite de intentos, que sí es accionable) colapsa en
 * el mismo mensaje: no se revela por qué se rechazó el código. Nunca se exponen
 * status crudos, stacktraces ni el JSON de error del backend.
 */
export function getConfirmEmailVerificationErrorMessage(cause: unknown): string {
  if (cause instanceof HttpError) {
    if (cause.status === 429) {
      return "Se superó el límite de intentos. Intenta nuevamente más tarde.";
    }
    if (cause.status >= 400 && cause.status < 500) return INVALID_CODE_MESSAGE;
    return GENERIC_CONFIRM_MESSAGE;
  }

  if (cause instanceof TimeoutError) {
    return "La solicitud tardó demasiado. Intenta nuevamente.";
  }

  if (cause instanceof NetworkError) {
    return "No pudimos verificar el correo. Verifica tu conexión e intenta nuevamente.";
  }

  return GENERIC_CONFIRM_MESSAGE;
}

/** Traduce cualquier fallo del reenvío a un mensaje apto para la persona usuaria. */
export function getResendEmailVerificationErrorMessage(cause: unknown): string {
  if (cause instanceof HttpError) {
    if (cause.status === 429) {
      return "Se superó el límite de envíos. Intenta nuevamente más tarde.";
    }
    return GENERIC_RESEND_MESSAGE;
  }

  if (cause instanceof TimeoutError) {
    return "La solicitud tardó demasiado. Intenta nuevamente.";
  }

  if (cause instanceof NetworkError) {
    return "No pudimos reenviar el código. Verifica tu conexión e intenta nuevamente.";
  }

  return GENERIC_RESEND_MESSAGE;
}
