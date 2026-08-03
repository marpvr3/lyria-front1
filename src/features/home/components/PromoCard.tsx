import type { PromoSlide, Restaurant } from "../domain/home.types";

import slider1 from "@/assets/slider-1.jpg";
import slider2 from "@/assets/slider-2.jpg";
import slider3 from "@/assets/slider-3.jpg";

interface PromoCardProps {
  activePromo: PromoSlide;
  heroPlace: Restaurant;
  promoSlides: PromoSlide[];
  activeSlide: number;
  onSlideChange: (index: number) => void;
}

function getSliderImage(index: number) {
  if (index === 0) return slider1;
  if (index === 1) return slider2;
  if (index === 2) return slider3;

  return slider1;
}

export function PromoCard({
  activePromo,
  promoSlides,
  activeSlide,
  onSlideChange,
}: PromoCardProps) {
  return (
    <div className="mb-5">
      <section
        className="relative grid h-[124px] grid-cols-[43%_57%] overflow-hidden rounded-[22px] bg-leaf shadow-[0_14px_30px_rgba(108,118,93,0.18)]"
        aria-label="Promoción Lyria"
      >
        <span
          className="pointer-events-none absolute -top-[18px] left-[116px] z-10 h-[48px] w-[48px] rounded-full border-[9px] border-rose bg-leaf"
          aria-hidden="true"
        />

        <span
          className="pointer-events-none absolute -bottom-4 -left-2.5 z-10 h-[38px] w-[38px] rounded-full border-[8px] border-rose bg-leaf"
          aria-hidden="true"
        />

        <div className="z-20 flex flex-col items-center justify-center px-3 py-5 pl-5 text-center text-white">
          <small className="max-w-[105px] text-[12px] leading-tight font-semibold">
            {activePromo.small}
          </small>

          <strong className="mt-1.5 text-[25px] leading-none font-black tracking-tight">
            {activePromo.title}
          </strong>
        </div>

        <div className="h-full overflow-hidden rounded-l-[10px] rounded-r-[22px]">
          <img
            src={getSliderImage(activeSlide)}
            alt={activePromo.title}
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <div
        className="mt-2 flex items-center justify-center gap-[7px]"
        aria-label="Cambiar promoción"
      >
        {promoSlides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            className={`h-1 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage ${
              activeSlide === index
                ? "w-[30px] bg-sage"
                : "w-[22px] bg-sage/30 hover:bg-sage/60"
            }`}
            onClick={() => onSlideChange(index)}
            aria-label={`Ver promoción ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}