/**
 * Carga las restricciones alimentarias activas para la pantalla de registro.
 *
 * Expone un estado explícito (`loading` | `ready` | `error`) para que el
 * control pueda mostrar "Cargando…" o un mensaje amigable sin bloquear el
 * resto del formulario.
 *
 * Los errores técnicos (HTTP, red/CORS, timeout, parseo) no se propagan a la
 * UI: se registran en consola y se traducen a un único mensaje para la persona
 * usuaria.
 */

import { useCallback, useEffect, useState } from "react";

import type { Restriction } from "../domain/restrictions.types";
import { getActiveRestrictions } from "../services/restrictions.api";

export const RESTRICTIONS_ERROR_MESSAGE =
  "No pudimos cargar las restricciones. Intenta nuevamente.";

type RestrictionsStatus = "loading" | "ready" | "error";

export interface UseActiveRestrictionsResult {
  restrictions: Restriction[];
  status: RestrictionsStatus;
  /** Mensaje apto para mostrar en pantalla, o `null` si no hubo fallo. */
  error: string | null;
  /** Reintenta la carga (por ejemplo, desde un botón "Reintentar"). */
  reload: () => void;
}

export function useActiveRestrictions(): UseActiveRestrictionsResult {
  const [restrictions, setRestrictions] = useState<Restriction[]>([]);
  const [status, setStatus] = useState<RestrictionsStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  // El paso a "cargando" se hace aquí (evento), no dentro del efecto: así el
  // efecto solo actualiza estado desde los callbacks asíncronos.
  const reload = useCallback(() => {
    setStatus("loading");
    setError(null);
    setReloadToken((current) => current + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    getActiveRestrictions({}, { signal: controller.signal })
      .then((items) => {
        if (cancelled) return;
        setRestrictions(items);
        setStatus("ready");
      })
      .catch((cause: unknown) => {
        // La cancelación no es un fallo: solo ocurre al desmontar o recargar.
        if (cancelled) return;
        console.error("No se pudieron cargar las restricciones:", cause);
        setRestrictions([]);
        setError(RESTRICTIONS_ERROR_MESSAGE);
        setStatus("error");
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [reloadToken]);

  return { restrictions, status, error, reload };
}
