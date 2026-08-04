/**
 * Tipos de dominio para el registro de usuarios desde la app móvil.
 *
 * Contrato tomado de `POST /api/v1/mobile/registrations`. Ese endpoint crea el
 * usuario, le asigna el rol Usuario y guarda sus restricciones alimentarias en
 * una sola operación; por eso el frontend NO envía `roleId` ni consulta roles.
 *
 * Nota: el contrato no admite confirmación de contraseña ni aceptación de
 * términos. Esos valores viven solo en el estado local de la pantalla.
 */

/** Cuerpo exacto aceptado por `POST /api/v1/mobile/registrations`. */
export interface MobileRegistrationRequest {
  name: string | null;
  lastName: string | null;
  email: string | null;
  password: string | null;
  phone: string | null;
  /** Fecha en formato `yyyy-MM-dd`. */
  birthDate: string | null;
  photoUrl: string | null;
  /** Ids de restricciones seleccionadas. Vacío si no se eligió ninguna. */
  restrictionIds: string[];
}

/**
 * Estado del formulario de registro tal como lo edita la persona usuaria.
 *
 * `confirmPassword` y `acceptsTerms` son campos de validación en cliente: se
 * verifican antes de enviar y nunca llegan al backend.
 */
export interface RegisterUserFormState {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  /** Solo para validar contra `password`. No se envía. */
  confirmPassword: string;
  /** Valor crudo del `<input type="date">`, ya en `yyyy-MM-dd`. */
  birthDate: string;
  /** Solo para habilitar el envío. No se envía. */
  acceptsTerms: boolean;
}
