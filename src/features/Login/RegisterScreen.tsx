import {
  CalendarDays,
  ChevronLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import { useRef, useState, type FormEvent } from "react";

import {
  RestrictionsMultiSelect,
  type RestrictionsMultiSelectHandle,
} from "./components/RestrictionsMultiSelect";
import type { RegisterUserFormState } from "./domain/users.types";
import { useActiveRestrictions } from "./hooks/useActiveRestrictions";
import {
  buildCreateUserRequest,
  getRegisterErrorMessage,
  registerUser,
} from "./services/users.api";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

const EMPTY_FORM: RegisterUserFormState = {
  fullName: "",
  email: "",
  password: "",
  birthDate: "",
  phone: "",
  acceptsTerms: false,
};

interface RegisterScreenProps {
  onBack: () => void;
  onLogin: () => void;
}

/**
 * Primera regla incumplida, o `null` si el formulario es válido.
 * Las restricciones alimentarias no son obligatorias.
 */
function validateForm(form: RegisterUserFormState): string | null {
  if (!form.fullName.trim()) return "Ingresa tu nombre completo.";
  if (!form.email.trim()) return "Ingresa tu correo electrónico.";
  if (!EMAIL_PATTERN.test(form.email.trim())) {
    return "Ingresa un correo electrónico válido.";
  }
  if (!form.password) return "Ingresa una contraseña.";
  if (form.password.length < MIN_PASSWORD_LENGTH) {
    return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }
  if (!form.birthDate) return "Selecciona tu fecha de nacimiento.";
  if (!form.phone.trim()) return "Ingresa tu número de teléfono.";
  if (!form.acceptsTerms) {
    return "Debes aceptar los términos de uso y la política de privacidad.";
  }
  return null;
}

export function RegisterScreen({ onBack, onLogin }: RegisterScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<RegisterUserFormState>(EMPTY_FORM);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Restricciones activas del backend + selección múltiple local.
  // El contrato de `POST /api/v1/users` no admite restricciones: estos ids
  // NO se envían al backend.
  const { restrictions, status, error, reload } = useActiveRestrictions();
  const [selectedRestrictionIds, setSelectedRestrictionIds] = useState<
    string[]
  >([]);
  const restrictionsRef = useRef<RestrictionsMultiSelectHandle>(null);

  function updateField<K extends keyof RegisterUserFormState>(
    field: K,
    value: RegisterUserFormState[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    restrictionsRef.current?.close();

    // Segundo cerrojo contra el doble envío, además del botón deshabilitado.
    if (isSubmitting) return;

    setSuccessMessage(null);

    const validationError = validateForm(form);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      await registerUser(buildCreateUserRequest(form));
      setSuccessMessage("Cuenta creada correctamente.");
      // Se limpia el formulario para no dejar la contraseña en pantalla ni
      // invitar a un registro duplicado. No se inicia sesión ni se navega.
      setForm(EMPTY_FORM);
      setSelectedRestrictionIds([]);
    } catch (cause) {
      // El detalle técnico solo va a consola; en pantalla, mensaje amigable.
      console.error("No se pudo crear la cuenta:", cause);
      setFormError(getRegisterErrorMessage(cause));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#ECEEE8] sm:px-5 sm:py-6">
      <section className="relative flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden bg-cream sm:min-h-[844px] sm:rounded-[38px] sm:shadow-[0_24px_60px_rgba(57,64,50,0.14)]">

        <header className="grid h-[150px] shrink-0 grid-cols-[40px_1fr_40px] items-center bg-rose px-5 pb-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver a la bienvenida"
            className="flex h-10 w-10 items-center justify-start text-white transition-transform duration-200 hover:-translate-x-0.5"
          >
            <ChevronLeft size={22} strokeWidth={2.3} />
          </button>

          <h1 className="text-center text-[25px] font-extrabold tracking-[-0.035em] text-white">
            Crear una cuenta
          </h1>

          <div className="h-10 w-10" aria-hidden="true" />
        </header>


        <section className="relative -mt-6 flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[32px] bg-white shadow-[0_-10px_28px_rgba(57,64,50,0.06)]">
          <div className="flex-1 overflow-y-auto px-6 pb-6 pt-6">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="mx-auto w-full max-w-[326px]"
            >

              <label className="block">
                <span className="mb-1.5 ml-2 block text-[10.5px] font-bold text-sage">
                  Nombre completo
                </span>

                <div className="flex h-[50px] items-center gap-3 rounded-full bg-cream px-5 transition focus-within:shadow-[0_0_0_3px_rgba(163,177,83,0.14)]">
                  <UserRound
                    size={16}
                    strokeWidth={2}
                    className="shrink-0 text-leaf"
                  />

                  <input
                    type="text"
                    placeholder="Completar"
                    autoComplete="name"
                    required
                    value={form.fullName}
                    onChange={(event) =>
                      updateField("fullName", event.target.value)
                    }
                    className="min-w-0 flex-1 bg-transparent text-[12px] text-sage outline-none placeholder:text-sage/45"
                  />
                </div>
              </label>


              <label className="mt-3 block">
                <span className="mb-1.5 ml-2 block text-[10.5px] font-bold text-sage">
                  Correo electrónico
                </span>

                <div className="flex h-[50px] items-center gap-3 rounded-full bg-cream px-5 transition focus-within:shadow-[0_0_0_3px_rgba(163,177,83,0.14)]">
                  <Mail
                    size={16}
                    strokeWidth={2}
                    className="shrink-0 text-leaf"
                  />

                  <input
                    type="email"
                    placeholder="Completar"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    className="min-w-0 flex-1 bg-transparent text-[12px] text-sage outline-none placeholder:text-sage/45"
                  />
                </div>
              </label>


              <label className="mt-3 block">
                <span className="mb-1.5 ml-2 block text-[10.5px] font-bold text-sage">
                  Contraseña
                </span>

                <div className="flex h-[50px] items-center gap-3 rounded-full bg-cream px-5 transition focus-within:shadow-[0_0_0_3px_rgba(235,181,178,0.17)]">
                  <LockKeyhole
                    size={16}
                    strokeWidth={2}
                    className="shrink-0 text-rose"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Completar"
                    autoComplete="new-password"
                    minLength={MIN_PASSWORD_LENGTH}
                    required
                    value={form.password}
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                    className="min-w-0 flex-1 bg-transparent text-[12px] text-sage outline-none placeholder:text-sage/45"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    aria-label={
                      showPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                    className="flex h-7 w-7 shrink-0 items-center justify-center text-sage/55 transition hover:text-sage"
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </label>


              <label className="mt-3 block">
                <span className="mb-1.5 ml-2 block text-[10.5px] font-bold text-sage">
                  Fecha de nacimiento
                </span>

                <div className="flex h-[50px] items-center gap-3 rounded-full bg-cream px-5 transition focus-within:shadow-[0_0_0_3px_rgba(163,177,83,0.14)]">
                  <CalendarDays
                    size={16}
                    strokeWidth={2}
                    className="shrink-0 text-leaf"
                  />

                  <input
                    type="date"
                    required
                    value={form.birthDate}
                    onChange={(event) =>
                      updateField("birthDate", event.target.value)
                    }
                    className="min-w-0 flex-1 bg-transparent text-[12px] text-sage outline-none"
                  />
                </div>
              </label>


              <label className="mt-3 block">
                <span className="mb-1.5 ml-2 block text-[10.5px] font-bold text-sage">
                  Número de teléfono
                </span>

                <div className="flex h-[50px] items-center gap-3 rounded-full bg-cream px-5 transition focus-within:shadow-[0_0_0_3px_rgba(163,177,83,0.14)]">
                  <Phone
                    size={16}
                    strokeWidth={2}
                    className="shrink-0 text-leaf"
                  />

                  <input
                    type="tel"
                    placeholder="Completar"
                    autoComplete="tel"
                    required
                    value={form.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    className="min-w-0 flex-1 bg-transparent text-[12px] text-sage outline-none placeholder:text-sage/45"
                  />
                </div>
              </label>


              <RestrictionsMultiSelect
                ref={restrictionsRef}
                label="Restricción alimenticia"
                restrictions={restrictions}
                status={status}
                errorMessage={error}
                selectedIds={selectedRestrictionIds}
                onChange={setSelectedRestrictionIds}
                onRetry={reload}
              />


              <label className="mt-4 flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  required
                  checked={form.acceptsTerms}
                  onChange={(event) =>
                    updateField("acceptsTerms", event.target.checked)
                  }
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#6c765d]"
                />

                <span className="text-[9px] leading-[1.45] text-sage/60">
                  Acepto los términos de uso y la política de privacidad.
                </span>
              </label>

              {formError && (
                <p
                  role="alert"
                  className="mt-3 text-center text-[10px] leading-[1.45] text-rose"
                >
                  {formError}
                </p>
              )}

              {successMessage && (
                <p
                  role="status"
                  className="mt-3 text-center text-[10px] font-bold leading-[1.45] text-leaf"
                >
                  {successMessage}
                </p>
              )}


              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="mx-auto mt-5 flex h-[50px] w-[190px] items-center justify-center rounded-full bg-rose px-6 text-[13px] font-bold text-white shadow-[0_10px_22px_rgba(235,181,178,0.28)] transition hover:-translate-y-0.5 hover:bg-leaf hover:text-white disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-rose"
              >
                {isSubmitting ? "Registrando..." : "Registrarse"}
              </button>

              <p className="mt-4 text-center text-[9.5px] text-sage/60">
                ¿Ya tienes una cuenta?{" "}
                <button
                  type="button"
                  onClick={onLogin}
                  className="font-bold text-sage transition hover:text-leaf"
                >
                  Inicia sesión
                </button>
              </p>
            </form>
          </div>
        </section>
      </section>
    </main>
  );
}
