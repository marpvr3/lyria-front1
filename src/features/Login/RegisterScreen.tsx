import {
  Camera,
  Check,
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

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

interface FormErrors {
  name?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

function validateForm(
  form: RegisterUserFormState,
): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) {
    errors.name =
      "Ingresa tu nombre.";
  }

  if (!form.lastName.trim()) {
    errors.lastName =
      "Ingresa tu apellido.";
  }

  if (!form.email.trim()) {
    errors.email =
      "Ingresa tu correo electrónico.";
  } else if (
    !EMAIL_PATTERN.test(
      form.email.trim(),
    )
  ) {
    errors.email =
      "Ingresa un correo electrónico válido.";
  }

  if (form.phone.trim()) {
    const onlyNumbers =
      form.phone.replace(
        /\D/g,
        "",
      );

    if (
      onlyNumbers.length < 7
    ) {
      errors.phone =
        "Ingresa un número válido.";
    }
  }

  if (!form.password) {
    errors.password =
      "Ingresa una contraseña.";
  } else if (
    form.password.length <
    MIN_PASSWORD_LENGTH
  ) {
    errors.password =
      `Debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }

  if (
    !form.confirmPassword
  ) {
    errors.confirmPassword =
      "Confirma tu contraseña.";
  } else if (
    form.password &&
    form.password !==
      form.confirmPassword
  ) {
    errors.confirmPassword =
      "Las contraseñas no coinciden.";
  }

  if (
    !form.acceptsTerms
  ) {
    errors.terms =
      "Debes aceptar los términos y la política de privacidad.";
  }

  return errors;
}

interface RegisterScreenProps {
  onBack: () => void;
  onLogin: () => void;
  /**
   * Se invoca tras un 201 con el correo usado en el registro.
   *
   * La cuenta queda sin verificar: el siguiente paso es la pantalla de
   * verificación, no el login. La contraseña no sale de esta pantalla.
   */
  onRegistered: (
    email: string,
  ) => void;
}

export function RegisterScreen({
  onBack,
  onLogin,
  onRegistered,
}: RegisterScreenProps) {
  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    selectedPhoto,
    setSelectedPhoto,
  ] = useState<File | null>(
    null,
  );

  const [
    photoPreview,
    setPhotoPreview,
  ] = useState("");

  const [
    form,
    setForm,
  ] =
    useState<RegisterUserFormState>(
      EMPTY_FORM,
    );

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    errors,
    setErrors,
  ] =
    useState<FormErrors>({});

  const [
    serverError,
    setServerError,
  ] = useState<
    string | null
  >(null);

  const [
    hasSubmitted,
    setHasSubmitted,
  ] = useState(false);

  const {
    restrictions,
    status,
    error,
    reload,
  } =
    useActiveRestrictions();

  const [
    selectedRestrictionIds,
    setSelectedRestrictionIds,
  ] = useState<
    string[]
  >([]);

  const restrictionsRef =
    useRef<RestrictionsMultiSelectHandle>(
      null,
    );

  const photoInputRef =
    useRef<HTMLInputElement>(
      null,
    );

  useEffect(() => {
    return () => {
      if (
        photoPreview
      ) {
        URL.revokeObjectURL(
          photoPreview,
        );
      }
    };
  }, [photoPreview]);

  function clearGlobalMessages() {
    setServerError(null);
  }

  function updateField<
    K extends keyof RegisterUserFormState,
  >(
    field: K,
    value: RegisterUserFormState[K],
  ) {
    const updatedForm = {
      ...form,
      [field]: value,
    };

    setForm(
      updatedForm,
    );

    clearGlobalMessages();

    if (
      !hasSubmitted
    ) {
      return;
    }

    setErrors(
      validateForm(
        updatedForm,
      ),
    );
  }

  function handlePhotoChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/",
      )
    ) {
      setServerError(
        "Selecciona una imagen válida.",
      );

      event.target.value =
        "";

      return;
    }

    if (
      file.size >
      MAX_PHOTO_SIZE
    ) {
      setServerError(
        "La imagen no puede pesar más de 5 MB.",
      );

      event.target.value =
        "";

      return;
    }

    if (
      photoPreview
    ) {
      URL.revokeObjectURL(
        photoPreview,
      );
    }

    setSelectedPhoto(
      file,
    );

    setPhotoPreview(
      URL.createObjectURL(
        file,
      ),
    );

    clearGlobalMessages();
  }

  function removePhoto() {
    if (
      photoPreview
    ) {
      URL.revokeObjectURL(
        photoPreview,
      );
    }

    setSelectedPhoto(
      null,
    );

    setPhotoPreview("");

    if (
      photoInputRef.current
    ) {
      photoInputRef.current.value =
        "";
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    restrictionsRef.current?.close();

    if (
      isSubmitting
    ) {
      return;
    }

    setHasSubmitted(
      true,
    );

    const validationErrors =
      validateForm(
        form,
      );

    setErrors(
      validationErrors,
    );

    if (
      Object.keys(
        validationErrors,
      ).length > 0
    ) {
      setServerError(
        null,
      );

      return;
    }

    setErrors({});
    setServerError(null);

    setIsSubmitting(
      true,
    );

    try {
      await registerUser(
        buildMobileRegistrationRequest(
          form,
          selectedRestrictionIds,
        ),
      );

      // Se conserva solo el correo para el paso de verificación; la
      // contraseña se descarta junto con el resto del formulario.
      const registeredEmail =
        form.email.trim();

      setForm(
        EMPTY_FORM,
      );

      setSelectedRestrictionIds(
        [],
      );

      setShowPassword(
        false,
      );

      setShowConfirmPassword(
        false,
      );

      setErrors({});
      setHasSubmitted(
        false,
      );

      removePhoto();

      onRegistered(
        registeredEmail,
      );
    } catch (cause) {
      console.error(
        "No se pudo crear la cuenta:",
        cause,
      );

      setServerError(
        getRegisterErrorMessage(
          cause,
        ),
      );
    } finally {
      setIsSubmitting(
        false,
      );
    }
  }

  const passwordHasMinimumLength =
    form.password.length >=
    MIN_PASSWORD_LENGTH;

  const passwordsMatch =
    Boolean(
      form.confirmPassword,
    ) &&
    form.password ===
      form.confirmPassword;

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#ECEEE8] antialiased [-webkit-font-smoothing:antialiased] [text-rendering:optimizeLegibility] sm:px-5 sm:py-6">
      <section className="relative flex h-screen min-h-0 w-full max-w-[390px] flex-col overflow-hidden bg-cream sm:h-[844px] sm:max-h-[844px] sm:rounded-[38px] sm:shadow-[0_24px_60px_rgba(57,64,50,0.14)]">
        {/* HEADER */}

        <header className="grid h-[170px] shrink-0 grid-cols-[40px_1fr_40px] items-center bg-rose px-5 pb-2">
          <button
            type="button"
            onClick={
              onBack
            }
            aria-label="Volver a la bienvenida"
            className="flex h-10 w-10 items-center justify-start text-white transition-transform duration-200 hover:-translate-x-0.5"
          >
            <ChevronLeft
              size={23}
              strokeWidth={
                2
              }
            />
          </button>

          <div className="text-center">
            <h1 className="whitespace-nowrap text-[27px] font-extrabold tracking-[-0.035em] text-white">
              Crear una cuenta
            </h1>
          </div>

          <div
            className="h-10 w-10"
            aria-hidden="true"
          />
        </header>

        {/* CONTENIDO */}

        <section className="relative -mt-5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[32px] bg-white shadow-[0_-10px_28px_rgba(57,64,50,0.06)]">
          <form
            onSubmit={
              handleSubmit
            }
            noValidate
            className="mx-auto flex h-full w-full max-w-[338px] flex-col px-0 pb-5 pt-5"
          >
            <div className="space-y-3">
              {/* NOMBRE / APELLIDO */}

              <div className="grid grid-cols-2 gap-3">
                <label className="min-w-0">
                  <span className="mb-1.5 ml-2 block text-[10.5px] font-bold text-sage">
                    Nombre{" "}
                    <span className="text-rose">
                      *
                    </span>
                  </span>

                  <div
                    className={`flex h-[45px] min-w-0 items-center gap-2.5 rounded-full bg-cream px-3.5 transition ${
                      hasSubmitted &&
                      errors.name
                        ? "shadow-[0_0_0_1.5px_rgba(235,181,178,0.9)]"
                        : "focus-within:shadow-[0_0_0_2px_rgba(163,177,83,0.16)]"
                    }`}
                  >
                    <UserRound
                      size={17}
                      strokeWidth={
                        1.8
                      }
                      className="shrink-0 text-leaf"
                    />

                    <input
                      type="text"
                      placeholder="Nombre"
                      autoComplete="given-name"
                      value={
                        form.name
                      }
                      onChange={(
                        event,
                      ) =>
                        updateField(
                          "name",
                          event
                            .target
                            .value,
                        )
                      }
                      className="min-w-0 flex-1 bg-transparent text-[12px] font-normal text-sage outline-none placeholder:text-sage/45"
                    />
                  </div>

                  {hasSubmitted &&
                    errors.name && (
                      <p className="ml-2 mt-1 text-[8.5px] font-medium text-rose">
                        {
                          errors.name
                        }
                      </p>
                    )}
                </label>

                <label className="min-w-0">
                  <span className="mb-1.5 ml-2 block text-[10.5px] font-bold text-sage">
                    Apellido{" "}
                    <span className="text-rose">
                      *
                    </span>
                  </span>

                  <div
                    className={`flex h-[45px] min-w-0 items-center gap-2.5 rounded-full bg-cream px-3.5 transition ${
                      hasSubmitted &&
                      errors.lastName
                        ? "shadow-[0_0_0_1.5px_rgba(235,181,178,0.9)]"
                        : "focus-within:shadow-[0_0_0_2px_rgba(163,177,83,0.16)]"
                    }`}
                  >
                    <UserRound
                      size={17}
                      strokeWidth={
                        1.8
                      }
                      className="shrink-0 text-leaf"
                    />

                    <input
                      type="text"
                      placeholder="Apellido"
                      autoComplete="family-name"
                      value={
                        form.lastName
                      }
                      onChange={(
                        event,
                      ) =>
                        updateField(
                          "lastName",
                          event
                            .target
                            .value,
                        )
                      }
                      className="min-w-0 flex-1 bg-transparent text-[12px] font-normal text-sage outline-none placeholder:text-sage/45"
                    />
                  </div>

                  {hasSubmitted &&
                    errors.lastName && (
                      <p className="ml-2 mt-1 text-[8.5px] font-medium text-rose">
                        {
                          errors.lastName
                        }
                      </p>
                    )}
                </label>
              </div>

              {/* EMAIL */}

              <label className="block">
                <span className="mb-1.5 ml-2 block text-[10.5px] font-bold text-sage">
                  Correo electrónico{" "}
                  <span className="text-rose">
                    *
                  </span>
                </span>

                <div
                  className={`flex h-[45px] items-center gap-3 rounded-full bg-cream px-4 transition ${
                    hasSubmitted &&
                    errors.email
                      ? "shadow-[0_0_0_1.5px_rgba(235,181,178,0.9)]"
                      : "focus-within:shadow-[0_0_0_2px_rgba(163,177,83,0.16)]"
                  }`}
                >
                  <Mail
                    size={17}
                    strokeWidth={
                      1.8
                    }
                    className="shrink-0 text-leaf"
                  />

                  <input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    autoComplete="email"
                    value={
                      form.email
                    }
                    onChange={(
                      event,
                    ) =>
                      updateField(
                        "email",
                        event
                          .target
                          .value,
                      )
                    }
                    className="min-w-0 flex-1 bg-transparent text-[12px] font-normal text-sage outline-none placeholder:text-sage/45"
                  />
                </div>

                {hasSubmitted &&
                  errors.email && (
                    <p className="ml-2 mt-1 text-[8.5px] font-medium text-rose">
                      {
                        errors.email
                      }
                    </p>
                  )}
              </label>

              {/* TELÉFONO */}

              <label className="block">
                <span className="mb-1.5 ml-2 flex items-center gap-1 text-[10.5px] font-bold text-sage">
                  Número de teléfono

                  <span className="font-normal text-sage/45">
                    opcional
                  </span>
                </span>

                <div
                  className={`flex h-[45px] items-center gap-3 rounded-full bg-cream px-4 transition ${
                    hasSubmitted &&
                    errors.phone
                      ? "shadow-[0_0_0_1.5px_rgba(235,181,178,0.9)]"
                      : "focus-within:shadow-[0_0_0_2px_rgba(163,177,83,0.16)]"
                  }`}
                >
                  <Phone
                    size={17}
                    strokeWidth={
                      1.8
                    }
                    className="shrink-0 text-leaf"
                  />

                  <input
                    type="tel"
                    placeholder="Ej: +54 11 1234 5678"
                    autoComplete="tel"
                    value={
                      form.phone
                    }
                    onChange={(
                      event,
                    ) =>
                      updateField(
                        "phone",
                        event
                          .target
                          .value,
                      )
                    }
                    className="min-w-0 flex-1 bg-transparent text-[12px] font-normal text-sage outline-none placeholder:text-sage/45"
                  />
                </div>

                {hasSubmitted &&
                  errors.phone && (
                    <p className="ml-2 mt-1 text-[8.5px] font-medium text-rose">
                      {
                        errors.phone
                      }
                    </p>
                  )}
              </label>

              {/* CONTRASEÑAS */}

              <div>
                <div className="grid grid-cols-2 gap-3">
                  {/* CONTRASEÑA */}

                  <label className="min-w-0">
                    <span className="mb-1.5 ml-2 block text-[10.5px] font-bold text-sage">
                      Contraseña{" "}
                      <span className="text-rose">
                        *
                      </span>
                    </span>

                    <div
                      className={`flex h-[45px] min-w-0 items-center gap-2 rounded-full bg-cream px-3 transition ${
                        hasSubmitted &&
                        errors.password
                          ? "shadow-[0_0_0_1.5px_rgba(235,181,178,0.9)]"
                          : "focus-within:shadow-[0_0_0_2px_rgba(235,181,178,0.18)]"
                      }`}
                    >
                      <LockKeyhole
                        size={16}
                        strokeWidth={
                          1.8
                        }
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
                        value={
                          form.password
                        }
                        onChange={(
                          event,
                        ) =>
                          updateField(
                            "password",
                            event
                              .target
                              .value,
                          )
                        }
                        className="min-w-0 flex-1 bg-transparent text-[11.5px] font-normal text-sage outline-none placeholder:text-sage/45"
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
                        className="grid h-7 w-7 shrink-0 place-items-center text-sage/50 transition hover:text-sage"
                      >
                        {showPassword ? (
                          <Eye
                            size={
                              16
                            }
                            strokeWidth={
                              1.8
                            }
                          />
                        ) : (
                          <EyeOff
                            size={
                              16
                            }
                            strokeWidth={
                              1.8
                            }
                          />
                        )}
                      </button>
                    </div>
                  </label>

                  {/* CONFIRMAR */}

                  <label className="min-w-0">
                    <span className="mb-1.5 ml-2 block text-[10.5px] font-bold text-sage">
                      Confirmar{" "}
                      <span className="text-rose">
                        *
                      </span>
                    </span>

                    <div
                      className={`flex h-[45px] min-w-0 items-center gap-2 rounded-full bg-cream px-3 transition ${
                        hasSubmitted &&
                        errors.confirmPassword
                          ? "shadow-[0_0_0_1.5px_rgba(235,181,178,0.9)]"
                          : "focus-within:shadow-[0_0_0_2px_rgba(235,181,178,0.18)]"
                      }`}
                    >
                      <LockKeyhole
                        size={16}
                        strokeWidth={
                          1.8
                        }
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
                        value={
                          form.confirmPassword
                        }
                        onChange={(
                          event,
                        ) =>
                          updateField(
                            "confirmPassword",
                            event
                              .target
                              .value,
                          )
                        }
                        className="min-w-0 flex-1 bg-transparent text-[11.5px] font-normal text-sage outline-none placeholder:text-sage/45"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (
                              current,
                            ) =>
                              !current,
                          )
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                        className="grid h-7 w-7 shrink-0 place-items-center text-sage/50 transition hover:text-sage"
                      >
                        {showConfirmPassword ? (
                          <Eye
                            size={
                              16
                            }
                            strokeWidth={
                              1.8
                            }
                          />
                        ) : (
                          <EyeOff
                            size={
                              16
                            }
                            strokeWidth={
                              1.8
                            }
                          />
                        )}
                      </button>
                    </div>
                  </label>
                </div>

                {/* AYUDA SIMPLE */}

                <div className="mt-2 flex min-h-[16px] items-center justify-between gap-2 px-2">
                  <p
                    className={`text-[9px] leading-none ${
                      form.password &&
                      passwordHasMinimumLength
                        ? "font-medium text-leaf"
                        : "text-sage/45"
                    }`}
                  >
                    {form.password &&
                    passwordHasMinimumLength ? (
                      <span className="inline-flex items-center gap-1">
                        <Check
                          size={
                            10
                          }
                          strokeWidth={
                            2.4
                          }
                        />

                        Mínimo 6 caracteres, combina letras, números y símbolos.
                      </span>
                    ) : (
                      <>
                        Mínimo 6 caracteres, combina letras, números y símbolos.
                      </>
                    )}
                  </p>

                  {form.confirmPassword && (
                    <span
                      className={`shrink-0 text-[9px] font-semibold ${
                        passwordsMatch
                          ? "text-leaf"
                          : "text-rose"
                      }`}
                    >
                      {passwordsMatch
                        ? "Coinciden"
                        : "No coinciden"}
                    </span>
                  )}
                </div>
              </div>

              {/* FOTO */}

              <div>
                <span className="mb-1.5 ml-2 flex items-center gap-1 text-[10.5px] font-bold text-sage">
                  Foto de perfil

                  <span className="font-normal text-sage/45">
                    opcional
                  </span>
                </span>

                <input
                  ref={
                    photoInputRef
                  }
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={
                    handlePhotoChange
                  }
                  className="hidden"
                />

                {photoPreview ? (
                  <div className="flex h-[45px] items-center gap-2.5 rounded-full bg-cream p-1 pr-3">
                    <img
                      src={
                        photoPreview
                      }
                      alt="Vista previa"
                      className="h-9 w-9 shrink-0 rounded-full object-cover"
                    />

                    <p className="min-w-0 flex-1 truncate text-[11px] font-medium text-sage">
                      {
                        selectedPhoto?.name
                      }
                    </p>

                    <button
                      type="button"
                      onClick={
                        removePhoto
                      }
                      aria-label="Eliminar foto"
                      className="grid h-7 w-7 place-items-center rounded-full bg-white text-sage"
                    >
                      <X
                        size={
                          13
                        }
                        strokeWidth={
                          1.9
                        }
                      />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      photoInputRef.current?.click()
                    }
                    className="flex h-[45px] w-full items-center gap-3 rounded-full bg-cream px-4 text-left"
                  >
                    <Camera
                      size={
                        17
                      }
                      strokeWidth={
                        1.8
                      }
                      className="text-leaf"
                    />

                    <span className="text-[12px] font-normal text-sage/45">
                      Agregar una foto
                    </span>
                  </button>
                )}
              </div>

              {/* RESTRICCIONES */}

              <RestrictionsMultiSelect
                ref={
                  restrictionsRef
                }
                label="Restricción alimenticia · opcional"
                restrictions={
                  restrictions
                }
                status={
                  status
                }
                errorMessage={
                  error
                }
                selectedIds={
                  selectedRestrictionIds
                }
                onChange={
                  setSelectedRestrictionIds
                }
                onRetry={
                  reload
                }
              />

              {/* TÉRMINOS */}

              <div>
                <label className="flex cursor-pointer items-start gap-2.5 px-1">
                  <input
                    type="checkbox"
                    checked={
                      form.acceptsTerms
                    }
                    onChange={(
                      event,
                    ) =>
                      updateField(
                        "acceptsTerms",
                        event
                          .target
                          .checked,
                      )
                    }
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#6c765d]"
                  />

                  <span className="text-[10.5px] leading-[1.45] text-sage/60">
                    Acepto los{" "}
                    <span className="font-semibold text-sage">
                      términos de uso
                    </span>{" "}
                    y la{" "}
                    <span className="font-semibold text-sage">
                      política de privacidad
                    </span>
                    .{" "}
                    <span className="font-bold text-rose">
                      *
                    </span>
                  </span>
                </label>

                {hasSubmitted &&
                  errors.terms && (
                    <p className="ml-7 mt-1 text-[8.5px] font-medium text-rose">
                      {
                        errors.terms
                      }
                    </p>
                  )}
              </div>

              {/* ERROR */}

              {serverError && (
                <div
                  role="alert"
                  className="rounded-[13px] bg-[#FFF7F6] px-3 py-2 text-center"
                >
                  <p className="text-[9px] font-semibold leading-[1.4] text-rose">
                    {
                      serverError
                    }
                  </p>
                </div>
              )}
            </div>

            {/* ABAJO */}

            <div className="mt-auto pt-4">
              <button
                type="submit"
                disabled={
                  isSubmitting
                }
                aria-busy={
                  isSubmitting
                }
                className="mx-auto flex h-[45px] w-[190px] items-center justify-center rounded-full bg-rose px-6 text-[12px] font-bold text-white shadow-[0_8px_18px_rgba(235,181,178,0.28)] transition hover:-translate-y-0.5 hover:bg-leaf disabled:cursor-not-allowed disabled:opacity-65"
              >
                {isSubmitting
                  ? "Registrando..."
                  : "Registrarse"}
              </button>

              <p className="mt-3 text-center text-[10px] text-sage/60">
                ¿Ya tienes una cuenta?{" "}
                <button
                  type="button"
                  onClick={
                    onLogin
                  }
                  className="font-bold text-sage transition hover:text-leaf"
                >
                  Inicia sesión
                </button>
              </p>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}