import {
  ChevronLeft,
  MailCheck,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import {
  RESEND_ACCEPTED_MESSAGE,
  buildConfirmEmailVerificationRequest,
  buildResendEmailVerificationRequest,
  confirmEmailVerification,
  getConfirmEmailVerificationErrorMessage,
  getResendEmailVerificationErrorMessage,
  resendEmailVerification,
} from "./services/emailVerification.api";

/** Longitud exacta del código que envía el backend. */
const CODE_LENGTH = 6;

/** Segundos que el botón de reenvío permanece bloqueado. */
const RESEND_COOLDOWN_SECONDS = 60;

/** Pausa para que el mensaje de éxito alcance a leerse antes de ir al login. */
const REDIRECT_TO_LOGIN_DELAY_MS = 2000;

const SUCCESS_MESSAGE = "Correo verificado correctamente.";

/**
 * Oculta parcialmente el correo para confirmar a dónde se envió el código sin
 * mostrarlo completo en pantalla.
 *
 * Se conservan las dos primeras letras y el dominio; el resto de la parte local
 * se enmascara. Si el valor no parece un correo se devuelve tal cual: es
 * preferible mostrarlo a inventar un formato.
 *
 * No se exporta: este archivo solo debe exportar el componente para que el
 * fast refresh de Vite siga funcionando.
 */
function maskEmail(email: string): string {
  const trimmed = email.trim();
  const atIndex = trimmed.lastIndexOf("@");

  if (atIndex <= 0) return trimmed;

  const local = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex);

  if (local.length <= 2) {
    return `${local.slice(0, 1)}${"•".repeat(local.length - 1 || 1)}${domain}`;
  }

  return `${local.slice(0, 2)}${"•".repeat(Math.min(local.length - 2, 6))}${domain}`;
}

interface EmailVerificationScreenProps {
  /** Correo usado en el registro. Solo se conserva hasta terminar este paso. */
  email: string;
  /** Se invoca tras un 204: lleva al login, sin iniciar sesión. */
  onVerified: () => void;
  onBack: () => void;
}

export function EmailVerificationScreen({
  email,
  onVerified,
  onBack,
}: EmailVerificationScreenProps) {
  const [code, setCode] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isResending, setIsResending] = useState(false);

  const [isVerified, setIsVerified] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

  const onVerifiedRef = useRef(onVerified);

  useEffect(() => {
    onVerifiedRef.current = onVerified;
  }, [onVerified]);

  // Un `setTimeout` por segundo en lugar de un intervalo: al desmontar o al
  // reiniciar el contador no queda ningún temporizador vivo.
  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSecondsLeft((current) => current - 1);
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [secondsLeft]);

  useEffect(() => {
    if (!isVerified) {
      return;
    }

    const timer = window.setTimeout(() => {
      onVerifiedRef.current();
    }, REDIRECT_TO_LOGIN_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isVerified]);

  function handleCodeChange(value: string) {
    // El backend espera 6 dígitos: se descarta cualquier otro carácter en la
    // entrada en vez de dejar que el usuario descubra el formato al fallar.
    setCode(value.replace(/\D/g, "").slice(0, CODE_LENGTH));

    setErrorMessage(null);
    setInfoMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting || isVerified) {
      return;
    }

    if (code.length !== CODE_LENGTH) {
      setErrorMessage(`Ingresa el código de ${CODE_LENGTH} dígitos.`);

      return;
    }

    setErrorMessage(null);
    setInfoMessage(null);
    setIsSubmitting(true);

    try {
      await confirmEmailVerification(
        buildConfirmEmailVerificationRequest(email, code),
      );

      // El código deja de existir en memoria apenas se confirma.
      setCode("");
      setIsVerified(true);
    } catch (cause) {
      console.error(
        "No se pudo verificar el correo:",
        cause instanceof Error ? cause.name : "Error desconocido",
      );

      setErrorMessage(getConfirmEmailVerificationErrorMessage(cause));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    if (isResending || isSubmitting || isVerified || secondsLeft > 0) {
      return;
    }

    setErrorMessage(null);
    setInfoMessage(null);
    setIsResending(true);

    try {
      await resendEmailVerification(buildResendEmailVerificationRequest(email));

      setInfoMessage(RESEND_ACCEPTED_MESSAGE);
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
    } catch (cause) {
      console.error(
        "No se pudo reenviar el código:",
        cause instanceof Error ? cause.name : "Error desconocido",
      );

      setErrorMessage(getResendEmailVerificationErrorMessage(cause));
    } finally {
      setIsResending(false);
    }
  }

  const isResendBlocked =
    isResending || isSubmitting || isVerified || secondsLeft > 0;

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#ECEEE8] antialiased [-webkit-font-smoothing:antialiased] [text-rendering:optimizeLegibility] sm:px-5 sm:py-6">
      <section className="relative flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden bg-cream sm:min-h-[844px] sm:rounded-[38px] sm:shadow-[0_24px_60px_rgba(57,64,50,0.14)]">
        <header className="grid h-[190px] shrink-0 grid-cols-[40px_1fr_40px] items-center bg-rose px-5 pb-4">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver al inicio de sesión"
            className="flex h-10 w-10 items-center justify-start text-white transition-transform duration-200 hover:-translate-x-0.5"
          >
            <ChevronLeft
              size={23}
              strokeWidth={2}
            />
          </button>

          <h1 className="text-center text-[27px] font-extrabold tracking-[-0.035em] text-white">
            Verifica tu correo
          </h1>

          <div
            className="h-10 w-10"
            aria-hidden="true"
          />
        </header>

        <section className="relative -mt-7 flex flex-1 flex-col rounded-t-[34px] bg-white px-6 pb-7 shadow-[0_-10px_28px_rgba(57,64,50,0.06)]">
          <div className="flex flex-1 items-center">
            <div className="mx-auto w-full max-w-[326px]">
              <div className="flex flex-col items-center text-center">
                <span className="grid h-[54px] w-[54px] place-items-center rounded-full bg-cream text-leaf">
                  <MailCheck
                    size={24}
                    strokeWidth={1.7}
                  />
                </span>

                <h2 className="mt-4 text-[22px] font-extrabold tracking-[-0.03em] text-sage">
                  Revisa tu correo
                </h2>

                <p className="mt-2 text-[12px] leading-[1.65] text-sage/65">
                  Enviamos un código de {CODE_LENGTH} dígitos a{" "}
                  <span className="font-bold text-sage">
                    {maskEmail(email)}
                  </span>
                  . Ingrésalo para activar tu cuenta.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-7"
              >
                <label className="block">
                  <span className="mb-2 ml-2 block text-[11px] font-bold text-sage">
                    Código de verificación
                  </span>

                  <div
                    className={`flex h-[58px] items-center justify-center rounded-full bg-cream px-5 transition duration-200 ${
                      errorMessage
                        ? "shadow-[0_0_0_1.5px_rgba(235,181,178,0.8)]"
                        : "focus-within:shadow-[0_0_0_3px_rgba(163,177,83,0.14)]"
                    }`}
                  >
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="000000"
                      maxLength={CODE_LENGTH}
                      value={code}
                      onChange={(event) => handleCodeChange(event.target.value)}
                      disabled={isVerified}
                      aria-invalid={Boolean(errorMessage)}
                      className="w-full bg-transparent text-center text-[20px] font-bold tracking-[0.45em] text-sage outline-none placeholder:font-normal placeholder:tracking-[0.45em] placeholder:text-sage/30 disabled:cursor-not-allowed"
                    />
                  </div>
                </label>

                {errorMessage && (
                  <p
                    role="alert"
                    className="mx-auto mt-4 max-w-[280px] text-center text-[10.5px] font-medium leading-[1.45] text-[#D98F8C]"
                  >
                    {errorMessage}
                  </p>
                )}

                {infoMessage && (
                  <p
                    role="status"
                    className="mx-auto mt-4 max-w-[280px] text-center text-[10.5px] font-medium leading-[1.45] text-sage/70"
                  >
                    {infoMessage}
                  </p>
                )}

                {isVerified && (
                  <p
                    role="status"
                    className="mx-auto mt-4 max-w-[280px] text-center text-[10.5px] font-bold leading-[1.45] text-leaf"
                  >
                    {SUCCESS_MESSAGE}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={
                    isSubmitting || isVerified || code.length !== CODE_LENGTH
                  }
                  aria-busy={isSubmitting}
                  className="mx-auto mt-7 flex h-[54px] w-[190px] items-center justify-center rounded-full bg-sage px-6 text-[14px] font-bold text-white shadow-[0_12px_24px_rgba(108,118,93,0.24)] transition duration-200 hover:-translate-y-0.5 hover:bg-leaf disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-sage"
                >
                  {isSubmitting ? "Verificando..." : "Verificar"}
                </button>

                <div className="mt-5 text-center">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResendBlocked}
                    aria-busy={isResending}
                    className="text-[11px] font-bold text-sage transition hover:text-leaf disabled:cursor-not-allowed disabled:font-medium disabled:text-sage/45 disabled:hover:text-sage/45"
                  >
                    {isResending ? "Reenviando..." : "Reenviar código"}
                  </button>

                  <p className="mt-1.5 min-h-[14px] text-[10px] leading-none text-sage/50">
                    {secondsLeft > 0
                      ? `Podrás pedir otro código en ${secondsLeft} s.`
                      : "¿No te llegó? Revisa tu carpeta de spam."}
                  </p>
                </div>
              </form>
            </div>
          </div>

          <p className="text-center text-[10.5px] text-sage/60">
            ¿Ya verificaste tu correo?{" "}
            <button
              type="button"
              onClick={onBack}
              className="font-bold text-sage transition hover:text-leaf"
            >
              Inicia sesión
            </button>
          </p>
        </section>
      </section>
    </main>
  );
}
