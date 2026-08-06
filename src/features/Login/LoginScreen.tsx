import {
  ChevronLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { useState, type FormEvent } from "react";

import { saveSession } from "@/core/auth/authSession";

import type { LoginFormState } from "./domain/auth.types";

import {
  buildLoginRequest,
  getLoginErrorMessage,
  login,
  toAuthSession,
} from "./services/auth.api";

/** Comprobación básica de formato: `algo@algo.algo` sin espacios. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FORM: LoginFormState = {
  email: "",
  password: "",
};

/** Valida el formulario antes de enviar y devuelve el primer error encontrado. */
function getFormError(form: LoginFormState): string | null {
  if (!form.email.trim()) return "Ingresa tu correo electrónico.";
  if (!EMAIL_PATTERN.test(form.email.trim())) {
    return "Ingresa un correo electrónico válido.";
  }

  if (!form.password) return "Ingresa tu contraseña.";

  return null;
}

interface LoginScreenProps {
  onBack: () => void;
  /** Se invoca solo cuando el backend devolvió un token válido. */
  onSubmit: () => void;
  onRegister: () => void;
}

export function LoginScreen({
  onBack,
  onSubmit,
  onRegister,
}: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<LoginFormState>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function updateField<K extends keyof LoginFormState>(
    field: K,
    value: LoginFormState[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Corta el doble submit (doble clic o Enter repetido).
    if (isSubmitting) {
      return;
    }

    const validationError = getFormError(form);

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      // Solo viajan las dos claves del contrato: email y password.
      const response = await login(buildLoginRequest(form));
      const session = toAuthSession(response);

      // Un 200 sin token utilizable no abre sesión: se trata como fallo.
      if (session === null) {
        setFormError(getLoginErrorMessage(null));
        return;
      }

      saveSession(session);

      // La contraseña se descarta del estado en cuanto deja de hacer falta.
      setForm(EMPTY_FORM);
      setShowPassword(false);

      onSubmit();
    } catch (cause) {
      // Se registra el tipo de fallo, nunca el cuerpo de la petición ni el token.
      console.error(
        "No se pudo iniciar sesión:",
        cause instanceof Error ? cause.name : "Error desconocido",
      );

      setFormError(getLoginErrorMessage(cause));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#ECEEE8] sm:px-5 sm:py-6">
      <section className="relative flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden bg-cream sm:min-h-[844px] sm:rounded-[38px] sm:shadow-[0_24px_60px_rgba(57,64,50,0.14)]">
        {/* Encabezado */}
        <header className="grid h-[190px] shrink-0 grid-cols-[40px_1fr_40px] items-center bg-rose px-5 pb-4">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver a la bienvenida"
            className="flex h-10 w-10 items-center justify-start text-white transition-transform duration-200 hover:-translate-x-0.5"
          >
            <ChevronLeft size={22} strokeWidth={2.3} />
          </button>

          <h1 className="text-center text-[27px] font-extrabold tracking-[-0.035em] text-white">
            Iniciar sesión
          </h1>

          <div className="h-10 w-10" aria-hidden="true" />
        </header>


        <section className="relative -mt-7 flex flex-1 flex-col rounded-t-[34px] bg-white px-6 pb-7 shadow-[0_-10px_28px_rgba(57,64,50,0.06)]">
          <div className="flex flex-1 items-center">
            <div className="mx-auto w-full max-w-[326px]">
              <div>
                <h2 className="text-[27px] font-extrabold tracking-[-0.035em] text-sage">
                  Bienvenido
                </h2>

                <p className="mt-2 max-w-[290px] text-[12px] leading-[1.65] text-sage/65">
                  Nos alegra tenerte de vuelta. Inicia sesión y continúa
                  explorando tus lugares favoritos.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8">
                {/* Correo */}
                <label className="block">
                  <span className="mb-2 ml-2 block text-[11px] font-bold text-sage">
                    Correo electrónico
                  </span>

                  <div className="flex h-[58px] items-center gap-3 rounded-full bg-cream px-5 transition duration-200 focus-within:shadow-[0_0_0_4px_rgba(163,177,83,0.15)]">
                    <Mail
                      size={17}
                      strokeWidth={2}
                      className="shrink-0 text-leaf"
                    />

                    <input
                      type="email"
                      placeholder="Ingresa tu correo"
                      autoComplete="email"
                      required
                      value={form.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      className="min-w-0 flex-1 bg-transparent text-[13px] text-sage outline-none placeholder:text-sage/35"
                    />
                  </div>
                </label>

                {/* Contraseña */}
                <label className="mt-5 block">
                  <span className="mb-2 ml-2 block text-[11px] font-bold text-sage">
                    Contraseña
                  </span>

                  <div className="flex h-[58px] items-center gap-3 rounded-full bg-cream px-5 transition duration-200 focus-within:shadow-[0_0_0_4px_rgba(235,181,178,0.17)]">
                    <LockKeyhole
                      size={17}
                      strokeWidth={2}
                      className="shrink-0 text-rose"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña"
                      autoComplete="current-password"
                      required
                      value={form.password}
                      onChange={(event) =>
                        updateField("password", event.target.value)
                      }
                      className="min-w-0 flex-1 bg-transparent text-[13px] text-sage outline-none placeholder:text-sage/35"
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
                      className="flex h-8 w-8 shrink-0 items-center justify-center text-sage/55 transition hover:text-sage"
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </label>

                <button
                  type="button"
                  className="mt-3 block w-full pr-2 text-right text-[10px] font-medium text-sage/60 transition hover:text-leaf"
                >
                  ¿Olvidaste tu contraseña?
                </button>

                {formError && (
                  <p
                    role="alert"
                    className="mt-4 text-center text-[11px] leading-[1.4] text-rose"
                  >
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="mx-auto mt-10 flex h-[54px] w-[190px] items-center justify-center rounded-full bg-sage px-6 text-[14px] font-bold text-white shadow-[0_12px_24px_rgba(108,118,93,0.24)] transition duration-200 hover:-translate-y-0.5 hover:bg-leaf disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-sage"
                >
                  {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                </button>
              </form>
            </div>
          </div>

          <p className="text-center text-[10.5px] text-sage/60">
            ¿No tienes una cuenta?{" "}
            <button
              type="button"
              onClick={onRegister}
              className="font-bold text-sage transition hover:text-leaf"
            >
              Regístrate
            </button>
          </p>
        </section>
      </section>
    </main>
  );
}
