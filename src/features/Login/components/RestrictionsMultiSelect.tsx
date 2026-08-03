/**
 * Selector múltiple de restricciones alimentarias.
 *
 * Reemplaza al `<select>` simple del formulario de registro conservando el
 * mismo aspecto (píldora `bg-cream` de 50 px con chevron a la derecha), pero
 * permitiendo marcar y desmarcar varias opciones.
 *
 * Es un componente presentacional: la carga de datos y los ids seleccionados
 * viven en la pantalla que lo usa.
 *
 * Accesibilidad:
 * - Disparador con `aria-haspopup`, `aria-expanded` y `aria-controls`.
 * - Lista con `role="listbox"` + `aria-multiselectable`; opciones con
 *   `role="option"` y `aria-selected`.
 * - Teclado: flechas para recorrer, Enter/Espacio para alternar, Escape y Tab
 *   para cerrar (Escape devuelve el foco al disparador).
 */

import { Check, ChevronDown } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from "react";

import type { Restriction } from "../domain/restrictions.types";

/** API imperativa mínima para que el formulario pueda cerrar el desplegable. */
export interface RestrictionsMultiSelectHandle {
  close: () => void;
}

export interface RestrictionsMultiSelectProps {
  ref?: Ref<RestrictionsMultiSelectHandle>;
  label: string;
  restrictions: Restriction[];
  status: "loading" | "ready" | "error";
  /** Mensaje amigable ya traducido; nunca un error técnico. */
  errorMessage: string | null;
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  onRetry: () => void;
}

/** Texto mostrado dentro de la píldora según la selección actual. */
function buildTriggerLabel(
  selectedIds: string[],
  restrictions: Restriction[],
): string {
  if (selectedIds.length === 0) return "Seleccionar";

  if (selectedIds.length === 1) {
    const selected = restrictions.find((item) => item.id === selectedIds[0]);
    // Si la opción ya no está en la lista, no se rompe la UI: se cuenta.
    return selected?.name ?? "1 restricción seleccionada";
  }

  return `${selectedIds.length} restricciones seleccionadas`;
}

export function RestrictionsMultiSelect({
  ref,
  label,
  restrictions,
  status,
  errorMessage,
  selectedIds,
  onChange,
  onRetry,
}: RestrictionsMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [storedActiveIndex, setActiveIndex] = useState(0);

  // Si la lista se recarga y encoge, el índice guardado puede quedar fuera de
  // rango: se acota en el render en vez de sincronizarlo con un efecto.
  const activeIndex = Math.min(
    storedActiveIndex,
    Math.max(restrictions.length - 1, 0),
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);

  const baseId = useId();
  const labelId = `${baseId}-label`;
  const listboxId = `${baseId}-listbox`;
  const errorId = `${baseId}-error`;

  const isLoading = status === "loading";
  const hasError = status === "error";
  const isDisabled = isLoading || hasError;

  const close = useCallback((returnFocus: boolean) => {
    setIsOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  const open = useCallback((index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
  }, []);

  // Cerrar sin mover el foco: al enviar el formulario el foco ya está en el botón.
  useImperativeHandle(ref, () => ({ close: () => setIsOpen(false) }), []);

  // Cierra al hacer clic fuera. `mousedown` evita que el clic se "pierda"
  // cuando el elemento bajo el cursor desaparece antes del `click`.
  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target;
      if (target instanceof Node && containerRef.current?.contains(target)) {
        return;
      }
      setIsOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isOpen]);

  // Mueve el foco real a la opción activa: más fiable para lectores de
  // pantalla que `aria-activedescendant` sobre un botón.
  useEffect(() => {
    if (!isOpen) return;
    optionRefs.current[activeIndex]?.focus();
  }, [isOpen, activeIndex]);

  function toggleOption(id: string) {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((selectedId) => selectedId !== id)
        : [...selectedIds, id],
    );
  }

  function handleTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (isDisabled || restrictions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      open(0);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      open(restrictions.length - 1);
    }
  }

  function handleListKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
    const lastIndex = restrictions.length - 1;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((current) => (current >= lastIndex ? 0 : current + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((current) => (current <= 0 ? lastIndex : current - 1));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(lastIndex);
        break;
      case "Escape":
        event.preventDefault();
        close(true);
        break;
      case "Tab":
        // Se respeta el orden natural de tabulación: solo se cierra.
        close(false);
        break;
      default:
        break;
    }
  }

  function handleOptionKeyDown(
    event: React.KeyboardEvent<HTMLLIElement>,
    id: string,
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleOption(id);
    }
  }

  const triggerLabel = isLoading
    ? "Cargando…"
    : buildTriggerLabel(selectedIds, restrictions);

  const hasSelection = selectedIds.length > 0;

  return (
    <div className="mt-3 block">
      <span
        id={labelId}
        className="mb-1.5 ml-2 block text-[10.5px] font-bold text-sage"
      >
        {label}
      </span>

      <div ref={containerRef} className="relative">
        <button
          ref={triggerRef}
          type="button"
          disabled={isDisabled}
          onClick={() => (isOpen ? close(false) : open(activeIndex))}
          onKeyDown={handleTriggerKeyDown}
          aria-label={label}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? listboxId : undefined}
          aria-describedby={hasError ? errorId : undefined}
          className="flex h-[50px] w-full items-center rounded-full bg-cream px-5 text-left transition focus:outline-none focus-visible:shadow-[0_0_0_3px_rgba(163,177,83,0.14)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <span
            className={`min-w-0 flex-1 truncate pr-3 text-[12px] ${
              hasSelection && !isLoading ? "text-sage" : "text-sage/45"
            }`}
          >
            {triggerLabel}
          </span>

          <ChevronDown
            size={17}
            strokeWidth={2}
            aria-hidden="true"
            className={`shrink-0 text-sage/60 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <ul
            id={listboxId}
            role="listbox"
            aria-multiselectable="true"
            aria-labelledby={labelId}
            onKeyDown={handleListKeyDown}
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 max-h-[190px] overflow-y-auto rounded-3xl bg-white p-1.5 shadow-[0_12px_28px_rgba(57,64,50,0.16)] ring-1 ring-sage/10"
          >
            {restrictions.length === 0 ? (
              <li className="px-4 py-3 text-[11px] text-sage/60">
                No hay restricciones disponibles.
              </li>
            ) : (
              restrictions.map((restriction, index) => {
                const isSelected = selectedIds.includes(restriction.id);

                return (
                  <li
                    key={restriction.id}
                    ref={(node) => {
                      optionRefs.current[index] = node;
                    }}
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={index === activeIndex ? 0 : -1}
                    onClick={() => toggleOption(restriction.id)}
                    onKeyDown={(event) =>
                      handleOptionKeyDown(event, restriction.id)
                    }
                    onMouseEnter={() => setActiveIndex(index)}
                    className="flex cursor-pointer items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-[12px] text-sage transition hover:bg-cream focus:bg-cream focus:outline-none"
                  >
                    <span
                      aria-hidden="true"
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition ${
                        isSelected
                          ? "border-leaf bg-leaf text-white"
                          : "border-sage/30 bg-white text-transparent"
                      }`}
                    >
                      <Check size={11} strokeWidth={3} />
                    </span>

                    <span className="min-w-0 flex-1 truncate">
                      {restriction.name}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>

      {hasError && errorMessage && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 ml-2 text-[9.5px] leading-[1.45] text-rose"
        >
          {errorMessage}{" "}
          <button
            type="button"
            onClick={onRetry}
            className="font-bold text-sage underline transition hover:text-leaf"
          >
            Reintentar
          </button>
        </p>
      )}
    </div>
  );
}
