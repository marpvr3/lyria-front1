import lyriaLogo from "@/assets/lyria-logo.png";
import lyriaPattern from "@/assets/trama.png";

export function SplashScreen() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#20211F] sm:px-4 sm:py-5">
      <section className="relative flex min-h-screen w-full max-w-[390px] flex-col items-center justify-center overflow-hidden bg-[#6C765D] sm:min-h-[844px] sm:rounded-[36px] sm:shadow-[0_28px_70px_rgba(0,0,0,0.32)]">
        
      
        <div
          className="absolute inset-0 bg-repeat bg-center opacity-25 mix-blend-screen"
          style={{
            backgroundImage: `url(${lyriaPattern})`,
            backgroundSize: "430px auto",
          }}
        />

        <div className="relative z-10 flex -translate-y-4 flex-col items-center">
          
      
          <img
            src={lyriaLogo}
            alt="Lyria"
            className="w-[235px] object-contain drop-shadow-[0_14px_24px_rgba(35,40,31,0.24)]"
          />

          <div className="mt-12 flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#F8F4E8] [animation-duration:1.2s]" />

            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#EBB5B2] [animation-delay:150ms] [animation-duration:1.2s]" />

            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#A3B153] [animation-delay:300ms] [animation-duration:1.2s]" />
          </div>

          <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.23em] text-[#F8F4E8]">
            Preparando tu experiencia
          </p>
        </div>
      </section>
    </main>
  );
}