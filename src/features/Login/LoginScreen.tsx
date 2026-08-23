import {
  ChevronLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import {
  useState,
  type FormEvent,
} from "react";

import { saveSession } from "@/core/auth/authSession";

import type { LoginFormState } from "./domain/auth.types";

import {
  buildLoginRequest,
  getLoginErrorMessage,
  login,
  toAuthSession,
} from "./services/auth.api";

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FORM: LoginFormState = {
  email: "",
  password: "",
};

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

function validateForm(
  form: LoginFormState,
): FormErrors {
  const errors: FormErrors = {};

  if (!form.email.trim()) {
    errors.email =
      "Completa tu correo electrónico.";
  } else if (
    !EMAIL_PATTERN.test(
      form.email.trim(),
    )
  ) {
    errors.email =
      "Ingresa un correo electrónico válido.";
  }

  if (!form.password) {
    errors.password =
      "Completa tu contraseña.";
  }

  return errors;
}

interface LoginScreenProps {
  onBack: () => void;
  onSubmit: () => void;
  onRegister: () => void;
}

export function LoginScreen({
  onBack,
  onSubmit,
  onRegister,
}: LoginScreenProps) {
  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    form,
    setForm,
  ] =
    useState<LoginFormState>(
      EMPTY_FORM,
    );

  const [
    errors,
    setErrors,
  ] = useState<FormErrors>({});

  const [
    hasSubmitted,
    setHasSubmitted,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  function updateField<
    K extends keyof LoginFormState,
  >(
    field: K,
    value: LoginFormState[K],
  ) {
    const updatedForm = {
      ...form,
      [field]: value,
    };

    setForm(updatedForm);

    if (!hasSubmitted) {
      setErrors((current) => ({
        ...current,
        general: undefined,
      }));

      return;
    }

    setErrors({
      ...validateForm(
        updatedForm,
      ),
      general: undefined,
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setHasSubmitted(true);

    const validationErrors =
      validateForm(form);

    if (
      validationErrors.email ||
      validationErrors.password
    ) {
      setErrors(
        validationErrors,
      );

      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response =
        await login(
          buildLoginRequest(
            form,
          ),
        );

      const session =
        toAuthSession(
          response,
        );

      if (
        session === null
      ) {
        setErrors({
          general:
            getLoginErrorMessage(
              null,
            ),
        });

        return;
      }

      saveSession(
        session,
      );

      setForm(
        EMPTY_FORM,
      );

      setShowPassword(
        false,
      );

      setErrors({});
      setHasSubmitted(
        false,
      );

      onSubmit();
    } catch (cause) {
      console.error(
        "No se pudo iniciar sesión:",
        cause instanceof Error
          ? cause.name
          : "Error desconocido",
      );

      setErrors({
        general:
          getLoginErrorMessage(
            cause,
          ),
      });
    } finally {
      setIsSubmitting(
        false,
      );
    }
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#ECEEE8] antialiased [-webkit-font-smoothing:antialiased] [text-rendering:optimizeLegibility] sm:px-5 sm:py-6">
      <section className="relative flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden bg-cream sm:min-h-[844px] sm:rounded-[38px] sm:shadow-[0_24px_60px_rgba(57,64,50,0.14)]">
        <header className="grid h-[190px] shrink-0 grid-cols-[40px_1fr_40px] items-center bg-rose px-5 pb-4">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver a la bienvenida"
            className="flex h-10 w-10 items-center justify-start text-white transition-transform duration-200 hover:-translate-x-0.5"
          >
            <ChevronLeft
              size={23}
              strokeWidth={2}
            />
          </button>

          <h1 className="text-center text-[27px] font-extrabold tracking-[-0.035em] text-white">
            Iniciar sesión
          </h1>

          <div
            className="h-10 w-10"
            aria-hidden="true"
          />
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

              <form
                onSubmit={
                  handleSubmit
                }
                noValidate
                className="mt-8"
              >
                <label className="block">
                  <span className="mb-2 ml-2 block text-[11px] font-bold text-sage">
                    Correo electrónico
                  </span>

                  <div
                    className={`flex h-[58px] items-center gap-3 rounded-full bg-cream px-5 transition duration-200 ${
                      errors.email
                        ? "shadow-[0_0_0_1.5px_rgba(235,181,178,0.8)]"
                        : "focus-within:shadow-[0_0_0_3px_rgba(163,177,83,0.14)]"
                    }`}
                  >
                    <Mail
                      size={18}
                      strokeWidth={1.8}
                      className="shrink-0 text-leaf"
                    />

                    <input
                      type="email"
                      placeholder="Ingresa tu correo"
                      autoComplete="email"
                      value={
                        form.email
                      }
                      onChange={(
                        event,
                      ) =>
                        updateField(
                          "email",
                          event.target
                            .value,
                        )
                      }
                      aria-invalid={
                        Boolean(
                          errors.email,
                        )
                      }
                      className="min-w-0 flex-1 bg-transparent text-[13px] font-normal text-sage outline-none placeholder:text-sage/40"
                    />
                  </div>

                  {errors.email && (
                    <p className="ml-3 mt-1.5 text-[10px] font-medium leading-none text-[#D98F8C]">
                      {errors.email}
                    </p>
                  )}
                </label>

                <label className="mt-5 block">
                  <span className="mb-2 ml-2 block text-[11px] font-bold text-sage">
                    Contraseña
                  </span>

                  <div
                    className={`flex h-[58px] items-center gap-3 rounded-full bg-cream px-5 transition duration-200 ${
                      errors.password
                        ? "shadow-[0_0_0_1.5px_rgba(235,181,178,0.8)]"
                        : "focus-within:shadow-[0_0_0_3px_rgba(235,181,178,0.16)]"
                    }`}
                  >
                    <LockKeyhole
                      size={18}
                      strokeWidth={1.8}
                      className="shrink-0 text-rose"
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Ingresa tu contraseña"
                      autoComplete="current-password"
                      value={
                        form.password
                      }
                      onChange={(
                        event,
                      ) =>
                        updateField(
                          "password",
                          event.target
                            .value,
                        )
                      }
                      aria-invalid={
                        Boolean(
                          errors.password,
                        )
                      }
                      className="min-w-0 flex-1 bg-transparent text-[13px] font-normal text-sage outline-none placeholder:text-sage/40"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (
                            current,
                          ) =>
                            !current,
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                      className="grid h-8 w-8 shrink-0 place-items-center text-sage/50 transition hover:text-sage"
                    >
                      {showPassword ? (
                        <Eye
                          size={17}
                          strokeWidth={1.8}
                        />
                      ) : (
                        <EyeOff
                          size={17}
                          strokeWidth={1.8}
                        />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="ml-3 mt-1.5 text-[10px] font-medium leading-none text-[#D98F8C]">
                      {
                        errors.password
                      }
                    </p>
                  )}
                </label>

                <button
                  type="button"
                  className="mt-3 block w-full pr-2 text-right text-[10.5px] font-medium text-sage/60 transition hover:text-leaf"
                >
                  ¿Olvidaste tu contraseña?
                </button>

                {errors.general && (
                  <p
                    role="alert"
                    className="mx-auto mt-4 max-w-[270px] text-center text-[10.5px] font-medium leading-[1.45] text-[#D98F8C]"
                  >
                    {
                      errors.general
                    }
                  </p>
                )}

                <button
                  type="submit"
                  disabled={
                    isSubmitting
                  }
                  aria-busy={
                    isSubmitting
                  }
                  className="mx-auto mt-9 flex h-[54px] w-[190px] items-center justify-center rounded-full bg-sage px-6 text-[14px] font-bold text-white shadow-[0_12px_24px_rgba(108,118,93,0.24)] transition duration-200 hover:-translate-y-0.5 hover:bg-leaf disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-sage"
                >
                  {isSubmitting
                    ? "Iniciando sesión..."
                    : "Iniciar sesión"}
                </button>
              </form>
            </div>
          </div>

          <p className="text-center text-[10.5px] text-sage/60">
            ¿No tienes una cuenta?{" "}
            <button
              type="button"
              onClick={
                onRegister
              }
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