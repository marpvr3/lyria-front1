/**
 * Servicio de API para el registro de usuarios desde la app móvil.
 *
 * Endpoint: `POST /api/v1/mobile/registrations`
 *
 * Este endpoint hace en una sola llamada lo que antes requería varias: crea el
 * usuario, le asigna el rol Usuario y guarda sus restricciones alimentarias.
 * Por eso el frontend no envía `roleId` ni consulta el catálogo de roles.
 *
 * Importante: el 201 se devuelve **sin cuerpo**. Por eso se usa `requestVoid` y
 * no `apiClient.post`: este último exige JSON válido y lanzaría
 * `ResponseParseError` justo cuando el registro fue exitoso.
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
  MobileRegistrationRequest,
  RegisterUserFormState,
} from "../domain/users.types";

const MOBILE_REGISTRATIONS_PATH = "/api/v1/mobile/registrations";

/** Mensaje usado cuando el fallo no encaja en ningún caso conocido. */
const GENERIC_ERROR_MESSAGE =
  "No pudimos crear la cuenta. Intenta nuevamente.";

/** `yyyy-MM-dd`: formato que espera el backend. */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** `dd/mm/yyyy`: formato que entregan algunos navegadores sin `type="date"`. */
const LOCALE_DATE = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

/**
 * Normaliza la fecha de nacimiento a `yyyy-MM-dd`.
 *
 * El `<input type="date">` ya entrega ese formato y se usa tal cual. Si el
 * valor llega como `dd/mm/yyyy` (entrada manual o navegador sin soporte), se
 * convierte. Cualquier otro formato devuelve `null`: es preferible enviar nulo
 * a mandar una fecha que el backend no pueda interpretar.
 */
export function toBackendDate(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) return null;
  if (ISO_DATE.test(trimmed)) return trimmed;

  const localeMatch = LOCALE_DATE.exec(trimmed);
  if (!localeMatch) return null;

  const [, day, month, year] = localeMatch;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

/**
 * Construye el cuerpo de `POST /api/v1/mobile/registrations`.
 *
 * El objeto se arma campo por campo (sin `spread`) para que solo puedan salir
 * las ocho claves del contrato. Quedan fuera a propósito: `confirmPassword`,
 * `acceptsTerms`, el `File` de la foto y `roleId` —el rol lo asigna el backend—.
 *
 * `photoUrl` va siempre en `null`: la foto elegida es un `File` local y no
 * existe endpoint de carga de archivos, así que no hay URL real que enviar.
 *
 * @param selectedRestrictionIds Ids elegidos en el multiselect; `[]` si ninguno.
 */
export function buildMobileRegistrationRequest(
  form: RegisterUserFormState,
  selectedRestrictionIds: string[],
): MobileRegistrationRequest {
  return {
    name: form.name.trim() || null,
    lastName: form.lastName.trim() || null,
    email: form.email.trim() || null,
    password: form.password || null,
    phone: form.phone.trim() || null,
    birthDate: toBackendDate(form.birthDate),
    photoUrl: null,
    // Copia defensiva: el payload no debe quedar atado al estado de la pantalla.
    restrictionIds: [...selectedRestrictionIds],
  };
}

/** Crea la cuenta. Resuelve sin valor cuando el backend responde 201. */
export function registerUser(payload: MobileRegistrationRequest): Promise<void> {
  return requestVoid(MOBILE_REGISTRATIONS_PATH, {
    method: "POST",
    json: payload,
  });
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
