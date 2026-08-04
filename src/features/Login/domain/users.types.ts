/**
 * Tipos de dominio para la creación de usuarios.
 *
 * Contrato tomado de `POST /api/v1/users` (esquema `CreateUserRequest`).
 * Todos los campos son opcionales/anulables en el backend, pero el formulario
 * exige los que la pantalla marca como obligatorios.
 *
 * Nota: el contrato NO admite restricciones alimentarias. Los ids seleccionados
 * en la pantalla se mantienen solo en estado local.
 */

/** Cuerpo exacto aceptado por `POST /api/v1/users`. */
export interface CreateUserRequest {
  name: string | null;
  lastName: string | null;
  email: string | null;
  password: string | null;
  phone: string | null;
  /** Fecha en formato `yyyy-MM-dd`. */
  birthDate: string | null;
  photoUrl: string | null;
}

/** Estado del formulario de registro tal como lo edita la persona usuaria. */
export interface RegisterUserFormState {
  fullName: string;
  email: string;
  password: string;
  /** Valor crudo del `<input type="date">`, ya en `yyyy-MM-dd`. */
  birthDate: string;
  phone: string;
  acceptsTerms: boolean;
}
