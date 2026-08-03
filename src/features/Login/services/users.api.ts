/**
 * Servicio de API para creación de usuarios.
 *
 * Endpoint: `POST /api/v1/users`
 *
 * Importante: según el contrato, el 201 se devuelve **sin cuerpo**. Por eso se
 * usa `requestVoid` y no `apiClient.post`: este último exige JSON válido y
 * lanzaría `ResponseParseError` justo cuando el registro fue exitoso.
 *
 * Este servicio no crea sesión ni guarda tokens: solo registra al usuario.
 */

import {
  HttpError,
  NetworkError,
  TimeoutError,
  requestVoid,
} from "@/core/http/apiClient";

import type {
  CreateUserRequest,
  RegisterUserFormState,
} from "../domain/users.types";

const USERS_PATH = "/api/v1/users";

/** Mensaje usado cuando el fallo no encaja en ningún caso conocido. */
const GENERIC_ERROR_MESSAGE =
  "No pudimos crear la cuenta. Intenta nuevamente.";

/**
 * Separa "Nombre completo" en `name` + `lastName`.
 *
 * Una sola palabra deja `lastName` en `null`; con varias, la primera es el
 * nombre y el resto se une con espacios.
 */
export function splitFullName(fullName: string): {
  name: string | null;
  lastName: string | null;
} {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return { name: null, lastName: null };

  const [first, ...rest] = parts;
  return {
    name: first,
    lastName: rest.length > 0 ? rest.join(" ") : null,
  };
}

/**
 * Construye el cuerpo de `POST /api/v1/users` a partir del formulario.
 *
 * Solo se mapean los campos que el contrato admite; las restricciones
 * alimentarias seleccionadas se quedan fuera a propósito.
 */
export function buildCreateUserRequest(
  form: RegisterUserFormState,
): CreateUserRequest {
  const { name, lastName } = splitFullName(form.fullName);

  return {
    name,
    lastName,
    email: form.email.trim() || null,
    password: form.password || null,
    phone: form.phone.trim() || null,
    // El `<input type="date">` ya entrega `yyyy-MM-dd`.
    birthDate: form.birthDate || null,
    photoUrl: null,
  };
}

/** Crea la cuenta. Resuelve sin valor cuando el backend responde 201. */
export function registerUser(payload: CreateUserRequest): Promise<void> {
  return requestVoid(USERS_PATH, { method: "POST", json: payload });
}

/**
 * Traduce cualquier fallo a un mensaje apto para la persona usuaria.
 *
 * Nunca expone status crudos, stacktraces ni el JSON de error del backend.
 */
export function getRegisterErrorMessage(cause: unknown): string {
  if (cause instanceof HttpError) {
    if (cause.status === 400) return "Revisa los datos ingresados.";
    if (cause.status === 409) {
      return "Ya existe una cuenta con este correo electrónico.";
    }
    return GENERIC_ERROR_MESSAGE;
  }

  if (cause instanceof TimeoutError) {
    return "La solicitud tardó demasiado. Intenta nuevamente.";
  }

  if (cause instanceof NetworkError) {
    return "No pudimos crear la cuenta. Verifica tu conexión e intenta nuevamente.";
  }

  return GENERIC_ERROR_MESSAGE;
}
