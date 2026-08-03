import {
  Heart,
  Leaf,
  ShieldCheck,
} from "lucide-react";

import foodPlate from "@/assets/Food-plate.png";
import lyriaPattern from "@/assets/trama.png";

interface WelcomeScreenProps {
  onLogin: () => void;
  onRegister: () => void;
}

export function WelcomeScreen({
  onLogin,
  onRegister,
}: WelcomeScreenProps) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#ECEEE8] sm:px-5 sm:py-6">
      <section className="relative flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden bg-[#F8F4E8] sm:min-h-[844px] sm:rounded-[38px] sm:shadow-[0_24px_60px_rgba(57,64,50,0.14)]">
   
        <div
          className="relative h-[250px] overflow-hidden"
          style={{
            backgroundImage: `url(${lyriaPattern})`,
            backgroundRepeat: "repeat",
            backgroundSize: "350px auto",
            backgroundPosition: "center",
          }}
        >
       
          <span className="absolute left-7 top-7 h-2.5 w-2.5 rounded-full bg-[#EBB5B2]" />

          <span className="absolute right-8 top-10 h-2 w-2 rounded-full bg-[#A3B153]" />

          <span className="absolute right-14 top-20 h-1.5 w-1.5 rounded-full bg-[#6C765D]" />
        </div>

        <div className="relative -mt-8 flex flex-1 flex-col rounded-t-[38px] bg-white px-6 pb-6 pt-[172px] shadow-[0_-16px_34px_rgba(57,64,50,0.09)]">
    
          <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-[58%]">
            <div className="relative flex h-[300px] w-[300px] items-center justify-center">
            
              <div className="absolute h-[274px] w-[274px] rounded-full border border-[#A3B153]/25" />

        
              <div className="absolute -left-1 top-[112px] z-30 grid h-[58px] w-[58px] animate-[bounce_3.8s_ease-in-out_infinite] place-items-center rounded-full border-[4px] border-white bg-[#F8F4E8] shadow-[0_14px_28px_rgba(57,64,50,0.18)]">
                <Leaf
                  size={25}
                  strokeWidth={2.3}
                  className="text-[#A3B153]"
                />
              </div>

           
              <div className="absolute -right-1 bottom-[57px] z-30 grid h-[58px] w-[58px] animate-[bounce_4.3s_ease-in-out_infinite] place-items-center rounded-full border-[4px] border-white bg-[#F8F4E8] shadow-[0_14px_28px_rgba(57,64,50,0.18)] [animation-delay:500ms]">
                <Heart
                  size={23}
                  strokeWidth={2.1}
                  className="fill-[#EBB5B2] text-[#EBB5B2]"
                />
              </div>

            
              <div className="absolute right-[48px] top-[18px] z-30 grid h-[44px] w-[44px] animate-[bounce_4.8s_ease-in-out_infinite] place-items-center rounded-full border-[3px] border-white bg-[#A3B153] shadow-[0_12px_24px_rgba(163,177,83,0.30)] [animation-delay:900ms]">
                <ShieldCheck
                  size={19}
                  strokeWidth={2.2}
                  className="text-white"
                />
              </div>

         
              <img
                src={foodPlate}
                alt="Plato de comida"
                className="relative z-20 h-[286px] w-[286px] object-contain drop-shadow-[0_30px_30px_rgba(57,64,50,0.28)]"
              />
            </div>
          </div>

          <div className="text-center">
            <h1 className="mx-auto max-w-[320px] text-[38px] font-extrabold leading-[0.98] tracking-[-0.045em] text-[#394032]">
              Prueba la mejor comida,
              <span className="block text-[#A3B153]">
                pensada para ti.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-[305px] text-[13px] leading-[1.75] text-[#6C7165]">
              Encuentra restaurantes y comercios que se adapten a tus
              necesidades alimenticias y disfruta cada salida con más
              tranquilidad.
            </p>

        </div>
      
          <div className="mt-auto space-y-3 pt-7">
            <button
              type="button"
              onClick={onLogin}
              className="group flex h-[58px] w-full items-center justify-center gap-3 rounded-full bg-[#A3B153] px-6 text-[14px] font-bold text-white shadow-[0_14px_28px_rgba(163,177,83,0.38)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#96A64C] hover:shadow-[0_18px_32px_rgba(163,177,83,0.42)] active:translate-y-0"
            >
              Iniciar sesión
            </button>

            <button
              type="button"
              onClick={onRegister}
              className="flex h-[58px] w-full items-center justify-center rounded-full bg-[#EBB5B2] px-6 text-[14px] font-bold text-white shadow-[0_12px_24px_rgba(235,181,178,0.32)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#E4AAA7] hover:shadow-[0_16px_28px_rgba(235,181,178,0.38)] active:translate-y-0"
            >
              Crear una cuenta
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}