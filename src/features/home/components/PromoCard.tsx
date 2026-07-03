import type { PromoSlide, Restaurant } from "../domain/home.types";
import { VenuePhoto } from "./VenuePhoto";

interface PromoCardProps {
  activePromo: PromoSlide;
  heroPlace: Restaurant;
  promoSlides: PromoSlide[];
  activeSlide: number;
  onSlideChange: (index: number) => void;
}

export function PromoCard({
  activePromo,
  heroPlace,
  promoSlides,
  activeSlide,
  onSlideChange,
}: PromoCardProps) {
  return (
    <div className="mt-[22px] mb-2">
      <section
        className="relative grid h-[150px] grid-cols-[43%_57%] overflow-hidden rounded-[22px] bg-leaf-dark shadow-[0_10px_20px_rgba(31,38,30,0.13)]"
        aria-label="Promoción Lyria"
      >
        {/* Círculo decorativo superior */}
        <span
          className="pointer-events-none absolute -top-[23px] left-[116px] z-10 h-[54px] w-[54px] rounded-full border-[10px] border-cream-light bg-rose"
          aria-hidden="true"
        />
        {/* Círculo decorativo inferior */}
        <span
          className="pointer-events-none absolute -bottom-4 -left-2.5 z-10 h-[38px] w-[38px] rounded-full border-[9px] border-cream-light bg-rose"
          aria-hidden="true"
        />

        {/* Texto */}
        <div className="z-20 flex flex-col items-center justify-center px-3 py-5 pl-5 text-center text-white">
          <small className="max-w-[116px] text-sm leading-tight font-semibold">
            {activePromo.small}
          </small>
          <strong className="mt-[7px] text-[32px] leading-none font-black tracking-tight">
            {activePromo.title}
          </strong>
        </div>

        {/* Foto */}
        <div className="h-full overflow-hidden rounded-r-[22px]">
          <VenuePhoto restaurant={heroPlace} compact />
        </div>
      </section>

      {/* Dots */}
      <div
        className="mt-2 mb-6 flex items-center justify-center gap-[7px]"
        aria-label="Cambiar promoción"
      >
        {promoSlides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            className={`h-1 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf ${
              activeSlide === index
                ? "w-[30px] bg-sage"
                : "w-[22px] bg-[#b7b6a8] hover:bg-sage/60"
            }`}
            onClick={() => onSlideChange(index)}
            aria-label={`Ver promoción ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
