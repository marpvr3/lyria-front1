import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import { useState, type FormEvent } from "react";

interface RegisterScreenProps {
  onBack: () => void;
  onSubmit: () => void;
  onLogin: () => void;
}

export function RegisterScreen({
  onBack,
  onSubmit,
  onLogin,
}: RegisterScreenProps) {
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
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
                    minLength={6}
                    required
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
                    className="min-w-0 flex-1 bg-transparent text-[12px] text-sage outline-none placeholder:text-sage/45"
                  />
                </div>
              </label>

  
              <label className="mt-3 block">
                <span className="mb-1.5 ml-2 block text-[10.5px] font-bold text-sage">
                  Restricción alimenticia
                </span>

                <div className="relative flex h-[50px] items-center rounded-full bg-cream px-5 transition focus-within:shadow-[0_0_0_3px_rgba(163,177,83,0.14)]">
                  <select
                    defaultValue=""
                    required
                    className="h-full min-w-0 flex-1 appearance-none rounded-full bg-cream pr-8 text-[12px] text-sage outline-none"
                  >
                    <option
                      value=""
                      disabled
                      className="bg-[#FBF6E3] text-[#6c765d]"
                    >
                      Seleccionar
                    </option>

                    <option
                      value="sin-tacc"
                      className="bg-[#FBF6E3] text-[#6c765d]"
                    >
                      Sin TACC
                    </option>

                    <option
                      value="vegano"
                      className="bg-[#FBF6E3] text-[#6c765d]"
                    >
                      Vegano
                    </option>

                    <option
                      value="vegetariano"
                      className="bg-[#FBF6E3] text-[#6c765d]"
                    >
                      Vegetariano
                    </option>

                    <option
                      value="sin-lactosa"
                      className="bg-[#FBF6E3] text-[#6c765d]"
                    >
                      Sin lactosa
                    </option>

                    <option
                      value="sin-azucar"
                      className="bg-[#FBF6E3] text-[#6c765d]"
                    >
                      Sin azúcar
                    </option>

                    <option
                      value="sin-frutos-secos"
                      className="bg-[#FBF6E3] text-[#6c765d]"
                    >
                      Sin frutos secos
                    </option>

                    <option
                      value="pescetariano"
                      className="bg-[#FBF6E3] text-[#6c765d]"
                    >
                      Pescetariano
                    </option>
                  </select>

                  <ChevronDown
                    size={17}
                    strokeWidth={2}
                    className="pointer-events-none absolute right-5 text-sage/60"
                  />
                </div>
              </label>

  
              <label className="mt-4 flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#6c765d]"
                />

                <span className="text-[9px] leading-[1.45] text-sage/60">
                  Acepto los términos de uso y la política de privacidad.
                </span>
              </label>

          
              <button
                type="submit"
                className="mx-auto mt-5 flex h-[50px] w-[190px] items-center justify-center rounded-full bg-rose px-6 text-[13px] font-bold text-white shadow-[0_10px_22px_rgba(235,181,178,0.28)] transition hover:-translate-y-0.5 hover:bg-leaf hover:text-white"
              >
                Registrarse
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