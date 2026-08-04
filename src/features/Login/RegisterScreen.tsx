import {
  CalendarDays,
  Camera,
  ChevronLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  RestrictionsMultiSelect,
  type RestrictionsMultiSelectHandle,
} from "./components/RestrictionsMultiSelect";

import type { RegisterUserFormState } from "./domain/users.types";
import { useActiveRestrictions } from "./hooks/useActiveRestrictions";

import {
  buildMobileRegistrationRequest,
  getRegisterErrorMessage,
  registerUser,
} from "./services/users.api";

const MIN_PASSWORD_LENGTH = 6;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

/**
 * Tiempo que se deja visible "Cuenta creada correctamente." antes de llevar a
 * la persona usuaria al login. Suficiente para leerlo sin sentir que la
 * pantalla se queda congelada.
 */
const REDIRECT_TO_LOGIN_DELAY_MS = 2_500;

/** Comprobación básica de formato: `algo@algo.algo` sin espacios. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FORM: RegisterUserFormState = {
  name: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  birthDate: "",
  acceptsTerms: false,
};

/**
 * Valida el formulario antes de enviar y devuelve el primer error encontrado.
 *
 * Las restricciones alimentarias y la foto de perfil son opcionales, por eso no
 * aparecen aquí.
 */
function getFormError(form: RegisterUserFormState): string | null {
  if (!form.name.trim()) return "Ingresa tu nombre.";
  if (!form.lastName.trim()) return "Ingresa tu apellido.";

  if (!form.email.trim()) return "Ingresa tu correo electrónico.";
  if (!EMAIL_PATTERN.test(form.email.trim())) {
    return "Ingresa un correo electrónico válido.";
  }

  if (!form.phone.trim()) return "Ingresa tu número de teléfono.";

  if (!form.password) return "Ingresa tu contraseña.";
  if (!form.confirmPassword) return "Repite tu contraseña.";
  if (form.password !== form.confirmPassword) {
    return "Las contraseñas no coinciden.";
  }

  if (!form.birthDate) return "Ingresa tu fecha de nacimiento.";

  if (!form.acceptsTerms) {
    return "Debes aceptar los términos de uso y la política de privacidad.";
  }

  return null;
}

interface RegisterScreenProps {
  onBack: () => void;
  onLogin: () => void;
}

export function RegisterScreen({
  onBack,
  onLogin,
}: RegisterScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [selectedPhoto, setSelectedPhoto] =
    useState<File | null>(null);

  const [photoPreview, setPhotoPreview] = useState("");

  const [form, setForm] =
    useState<RegisterUserFormState>(EMPTY_FORM);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formError, setFormError] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const {
    restrictions,
    status,
    error,
    reload,
  } = useActiveRestrictions();

  const [
    selectedRestrictionIds,
    setSelectedRestrictionIds,
  ] = useState<string[]>([]);

  const restrictionsRef =
    useRef<RestrictionsMultiSelectHandle>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);

  // Referencia siempre apuntando al último `onLogin`: evita que el temporizador
  // se reinicie si el padre vuelve a renderizar con otra instancia del callback.
  const onLoginRef = useRef(onLogin);

  useEffect(() => {
    onLoginRef.current = onLogin;
  });

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  /**
   * Tras un registro exitoso, deja leer el mensaje y lleva al login.
   *
   * No hay inicio de sesión ni token de por medio: solo un cambio de pantalla.
   * El `clearTimeout` del cleanup evita que el callback se dispare si el
   * componente se desmonta antes (por ejemplo si se pulsa "Volver").
   */
  useEffect(() => {
    if (!successMessage) return;

    const timer = window.setTimeout(() => {
      onLoginRef.current();
    }, REDIRECT_TO_LOGIN_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [successMessage]);

  function clearMessages() {
    setFormError(null);
    setSuccessMessage(null);
  }

  function updateField<
    K extends keyof RegisterUserFormState,
  >(
    field: K,
    value: RegisterUserFormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    clearMessages();
  }

  function handlePhotoChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFormError("Selecciona una imagen válida.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_PHOTO_SIZE) {
      setFormError("La imagen no puede pesar más de 5 MB.");
      event.target.value = "";
      return;
    }

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setSelectedPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));

    clearMessages();
  }

  function removePhoto() {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setSelectedPhoto(null);
    setPhotoPreview("");

    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    restrictionsRef.current?.close();

    // Corta el doble submit (doble clic o Enter repetido).
    if (isSubmitting) {
      return;
    }

    const validationError = getFormError(form);

    if (validationError) {
      setFormError(validationError);
      setSuccessMessage(null);
      return;
    }

    setFormError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      // Solo viajan las ocho claves del contrato: ni confirmPassword, ni los
      // términos, ni el archivo de imagen, ni roleId (lo asigna el backend).
      await registerUser(
        buildMobileRegistrationRequest(
          form,
          selectedRestrictionIds,
        ),
      );

      setSuccessMessage(
        "Cuenta creada correctamente.",
      );

      // Sin sesión automática, sin token y sin navegar: solo se limpia.
      setForm(EMPTY_FORM);
      setSelectedRestrictionIds([]);
      setShowPassword(false);
      setShowConfirmPassword(false);

      removePhoto();
    } catch (cause) {
      console.error(
        "No se pudo crear la cuenta:",
        cause,
      );

      setFormError(
        getRegisterErrorMessage(cause),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#ECEEE8] sm:px-5 sm:py-6">
      <section className="relative flex h-screen min-h-0 w-full max-w-[390px] flex-col overflow-hidden bg-cream sm:h-[844px] sm:max-h-[844px] sm:rounded-[38px] sm:shadow-[0_24px_60px_rgba(57,64,50,0.14)]">
        {/* Encabezado */}
        <header className="grid h-[150px] shrink-0 grid-cols-[40px_1fr_40px] items-center bg-rose px-5 pb-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver a la bienvenida"
            className="flex h-10 w-10 items-center justify-start text-white transition-transform duration-200 hover:-translate-x-0.5"
          >
            <ChevronLeft
              size={22}
              strokeWidth={2.3}
            />
          </button>

          <h1 className="whitespace-nowrap text-center text-[25px] font-extrabold tracking-[-0.035em] text-white">
            Crear una cuenta
          </h1>

          <div
            className="h-10 w-10"
            aria-hidden="true"
          />
        </header>

        {/* Tarjeta blanca */}
        <section className="relative -mt-6 flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[34px] bg-white shadow-[0_-10px_28px_rgba(57,64,50,0.06)]">
          {/* Scroll únicamente dentro de la tarjeta */}
          <div className="h-full min-h-0 overflow-y-auto overscroll-contain px-6 pb-8 pt-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <form
              onSubmit={handleSubmit}
              className="mx-auto w-full max-w-[338px]"
            >
              {/* Nombre y apellido */}
              <div className="grid grid-cols-2 gap-3">
                <label className="min-w-0">
                  <span className="mb-1.5 ml-2 block text-[10px] font-bold text-sage">
                    Nombre
                  </span>

                  <div className="flex h-[52px] min-w-0 items-center gap-2.5 rounded-full bg-cream px-4 transition focus-within:shadow-[0_0_0_3px_rgba(163,177,83,0.14)]">
                    <UserRound
                      size={17}
                      strokeWidth={2}
                      className="shrink-0 text-leaf"
                    />

                    <input
                      type="text"
                      placeholder="Nombre"
                      autoComplete="given-name"
                      required
                      value={form.name}
                      onChange={(event) =>
                        updateField(
                          "name",
                          event.target.value,
                        )
                      }
                      className="min-w-0 flex-1 bg-transparent text-[12px] text-sage outline-none placeholder:text-sage/40"
                    />
                  </div>
                </label>

                <label className="min-w-0">
                  <span className="mb-1.5 ml-2 block text-[10px] font-bold text-sage">
                    Apellido
                  </span>

                  <div className="flex h-[52px] min-w-0 items-center gap-2.5 rounded-full bg-cream px-4 transition focus-within:shadow-[0_0_0_3px_rgba(163,177,83,0.14)]">
                    <UserRound
                      size={17}
                      strokeWidth={2}
                      className="shrink-0 text-leaf"
                    />

                    <input
                      type="text"
                      placeholder="Apellido"
                      autoComplete="family-name"
                      required
                      value={form.lastName}
                      onChange={(event) =>
                        updateField(
                          "lastName",
                          event.target.value,
                        )
                      }
                      className="min-w-0 flex-1 bg-transparent text-[12px] text-sage outline-none placeholder:text-sage/40"
                    />
                  </div>
                </label>
              </div>

              {/* Correo */}
              <label className="mt-3 block">
                <span className="mb-1.5 ml-2 block text-[10px] font-bold text-sage">
                  Correo electrónico
                </span>

                <div className="flex h-[52px] items-center gap-3 rounded-full bg-cream px-5 transition focus-within:shadow-[0_0_0_3px_rgba(163,177,83,0.14)]">
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
                      updateField(
                        "email",
                        event.target.value,
                      )
                    }
                    className="min-w-0 flex-1 bg-transparent text-[12px] text-sage outline-none placeholder:text-sage/40"
                  />
                </div>
              </label>

              {/* Teléfono */}
              <label className="mt-3 block">
                <span className="mb-1.5 ml-2 block text-[10px] font-bold text-sage">
                  Número de teléfono
                </span>

                <div className="flex h-[52px] items-center gap-3 rounded-full bg-cream px-5 transition focus-within:shadow-[0_0_0_3px_rgba(163,177,83,0.14)]">
                  <Phone
                    size={17}
                    strokeWidth={2}
                    className="shrink-0 text-leaf"
                  />

                  <input
                    type="tel"
                    placeholder="Ingresa tu número"
                    autoComplete="tel"
                    required
                    value={form.phone}
                    onChange={(event) =>
                      updateField(
                        "phone",
                        event.target.value,
                      )
                    }
                    className="min-w-0 flex-1 bg-transparent text-[12px] text-sage outline-none placeholder:text-sage/40"
                  />
                </div>
              </label>

              {/* Contraseñas */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <label className="min-w-0">
                  <span className="mb-1.5 ml-2 block text-[10px] font-bold text-sage">
                    Contraseña
                  </span>

                  <div className="flex h-[52px] min-w-0 items-center gap-1 rounded-full bg-cream px-3.5 transition focus-within:shadow-[0_0_0_3px_rgba(235,181,178,0.17)]">
                    <LockKeyhole
                      size={16}
                      strokeWidth={2}
                      className="shrink-0 text-rose"
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Contraseña"
                      autoComplete="new-password"
                      minLength={MIN_PASSWORD_LENGTH}
                      required
                      value={form.password}
                      onChange={(event) =>
                        updateField(
                          "password",
                          event.target.value,
                        )
                      }
                      className="min-w-0 flex-1 bg-transparent text-[10px] text-sage outline-none placeholder:text-sage/40"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current,
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                      className="grid h-7 w-6 shrink-0 place-items-center text-sage/55 transition hover:text-sage"
                    >
                      {showPassword ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                    </button>
                  </div>
                </label>

                <label className="min-w-0">
                  <span className="mb-1.5 ml-2 block text-[10px] font-bold text-sage">
                    Repetir contraseña
                  </span>

                  <div className="flex h-[52px] min-w-0 items-center gap-1 rounded-full bg-cream px-3.5 transition focus-within:shadow-[0_0_0_3px_rgba(235,181,178,0.17)]">
                    <LockKeyhole
                      size={16}
                      strokeWidth={2}
                      className="shrink-0 text-rose"
                    />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Repetir"
                      autoComplete="new-password"
                      minLength={MIN_PASSWORD_LENGTH}
                      required
                      value={form.confirmPassword}
                      onChange={(event) =>
                        updateField(
                          "confirmPassword",
                          event.target.value,
                        )
                      }
                      className="min-w-0 flex-1 bg-transparent text-[10px] text-sage outline-none placeholder:text-sage/40"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (current) => !current,
                        )
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                      className="grid h-7 w-6 shrink-0 place-items-center text-sage/55 transition hover:text-sage"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                    </button>
                  </div>
                </label>
              </div>

              {/* Fecha */}
              <label className="mt-3 block">
                <span className="mb-1.5 ml-2 block text-[10px] font-bold text-sage">
                  Fecha de nacimiento
                </span>

                <div className="flex h-[52px] items-center gap-3 rounded-full bg-cream px-5 transition focus-within:shadow-[0_0_0_3px_rgba(163,177,83,0.14)]">
                  <CalendarDays
                    size={17}
                    strokeWidth={2}
                    className="shrink-0 text-leaf"
                  />

                  <input
                    type="date"
                    required
                    value={form.birthDate}
                    onChange={(event) =>
                      updateField(
                        "birthDate",
                        event.target.value,
                      )
                    }
                    className="min-w-0 flex-1 bg-transparent text-[12px] text-sage outline-none"
                  />
                </div>
              </label>

              {/* Foto */}
              <div className="mt-3">
                <span className="mb-1.5 ml-2 block text-[10px] font-bold text-sage">
                  Foto de perfil

                  <span className="ml-1 font-normal text-sage/45">
                    opcional
                  </span>
                </span>

                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                />

                {photoPreview ? (
                  <div className="flex h-[54px] items-center gap-3 rounded-full bg-cream p-1.5 pr-4">
                    <img
                      src={photoPreview}
                      alt="Vista previa de la foto"
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10px] font-semibold text-sage">
                        {selectedPhoto?.name}
                      </p>

                      <p className="mt-0.5 text-[8.5px] text-sage/45">
                        Imagen seleccionada
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={removePhoto}
                      aria-label="Eliminar foto"
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-sage shadow-[0_4px_10px_rgba(57,64,50,0.08)]"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      photoInputRef.current?.click()
                    }
                    className="flex h-[52px] w-full items-center gap-3 rounded-full bg-cream px-5 text-left transition hover:shadow-[0_0_0_3px_rgba(163,177,83,0.14)]"
                  >
                    <Camera
                      size={17}
                      strokeWidth={2}
                      className="shrink-0 text-leaf"
                    />

                    <span className="text-[12px] text-sage/40">
                      Cargar imagen
                    </span>
                  </button>
                )}
              </div>

              {/* Restricciones */}
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

              {/* Términos */}
              <label className="mt-4 flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  required
                  checked={form.acceptsTerms}
                  onChange={(event) =>
                    updateField(
                      "acceptsTerms",
                      event.target.checked,
                    )
                  }
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#6c765d]"
                />

                <span className="text-[9px] leading-[1.45] text-sage/60">
                  Acepto los términos de uso y la política de
                  privacidad.
                </span>
              </label>

              {formError && (
                <p
                  role="alert"
                  className="mt-3 text-center text-[10px] leading-[1.4] text-rose"
                >
                  {formError}
                </p>
              )}

              {successMessage && (
                <p
                  role="status"
                  className="mt-3 text-center text-[10px] font-bold text-leaf"
                >
                  {successMessage}
                </p>
              )}

              {/* Botón dentro del flujo normal */}
              <button
                type="submit"
                // Bloqueado también tras el éxito: durante la espera previa al
                // login no debe poder reenviarse el formulario.
                disabled={
                  isSubmitting || Boolean(successMessage)
                }
                aria-busy={isSubmitting}
                className="mx-auto mt-5 flex h-[50px] w-[190px] items-center justify-center rounded-full bg-rose px-6 text-[13px] font-bold text-white shadow-[0_10px_22px_rgba(235,181,178,0.28)] transition hover:-translate-y-0.5 hover:bg-leaf disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? "Registrando..."
                  : "Registrarse"}
              </button>

              <p className="mt-3 text-center text-[9.5px] text-sage/60">
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