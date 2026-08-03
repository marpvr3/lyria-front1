/**
 * Servicio de API para restricciones alimentarias.
 *
 * Todo el consumo pasa por `apiClient` (`src/core/http/apiClient.ts`);
 * no se usa `fetch` directo en componentes.
 *
 * Endpoint: `GET /api/v1/restrictions`
 * Query params soportados por el backend: `search`, `isActive`, `page`, `pageSize`.
 *
 * Regla de pantalla de registro: `isActive=true` es obligatorio y no es
 * configurable desde el llamador, para no exponer restricciones inactivas.
 */

import { apiClient } from "@/core/http/apiClient";

import type {
  Restriction,
  RestrictionsPagedResponse,
} from "../domain/restrictions.types";

const RESTRICTIONS_PATH = "/api/v1/restrictions";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

/** Nombre mostrado cuando el backend devuelve `name` nulo o vacío. */
export const UNNAMED_RESTRICTION_LABEL = "Restricción sin nombre";

export interface GetActiveRestrictionsParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface GetActiveRestrictionsOptions {
  signal?: AbortSignal;
}

function buildQuery({
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
  search,
}: GetActiveRestrictionsParams): string {
  const query = new URLSearchParams({
    // Obligatorio: la pantalla de registro nunca lista restricciones inactivas.
    isActive: "true",
    page: String(page),
    pageSize: String(pageSize),
  });

  const trimmedSearch = search?.trim();
  if (trimmedSearch) {
    query.set("search", trimmedSearch);
  }

  return query.toString();
}

/**
 * Normaliza un elemento del listado.
 *
 * El cuerpo llega sin validar en runtime, así que se descartan los registros
 * inservibles (sin `id`) y se aplica un fallback controlado al nombre para no
 * romper la UI si el backend envía `null` o cadena vacía.
 */
function normalizeRestriction(raw: unknown): Restriction | null {
  if (typeof raw !== "object" || raw === null) return null;

  const item = raw as Partial<Restriction>;

  const id = typeof item.id === "string" ? item.id.trim() : "";
  if (!id) return null;

  // Solo se excluye lo explícitamente inactivo: un `isActive` ausente no
  // debería ocultar una restricción que el propio filtro ya consideró activa.
  if (item.isActive === false) return null;

  const name = typeof item.name === "string" ? item.name.trim() : "";

  return {
    id,
    name: name || UNNAMED_RESTRICTION_LABEL,
    description: typeof item.description === "string" ? item.description : "",
    isActive: true,
  };
}

/**
 * Devuelve las restricciones alimentarias activas.
 *
 * Si la respuesta no trae `items` (o no es un array) se resuelve con lista
 * vacía en lugar de lanzar: para la UI "sin opciones" no es un error.
 */
export async function getActiveRestrictions(
  params: GetActiveRestrictionsParams = {},
  options: GetActiveRestrictionsOptions = {},
): Promise<Restriction[]> {
  const response = await apiClient.get<Partial<RestrictionsPagedResponse>>(
    `${RESTRICTIONS_PATH}?${buildQuery(params)}`,
    { signal: options.signal },
  );

  if (!Array.isArray(response?.items)) return [];

  return response.items
    .map(normalizeRestriction)
    .filter((item): item is Restriction => item !== null);
}
