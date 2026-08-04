/**
 * Tipos de dominio para restricciones alimentarias.
 *
 * Contrato tomado de `GET /api/v1/restrictions` (respuesta paginada).
 * No inventar campos: solo se declara lo que el endpoint devuelve hoy.
 */

/** Restricción alimentaria tal como la expone el API. */
export interface Restriction {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

/** Envoltura paginada que usa el API para listados. */
export interface RestrictionsPagedResponse {
  items: Restriction[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
