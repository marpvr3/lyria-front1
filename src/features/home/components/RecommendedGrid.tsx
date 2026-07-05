import { Star, Heart } from "lucide-react";
import type { Restaurant } from "../domain/home.types";

import restaurante1 from "@/assets/restaurante-1.jpg";
import restaurante2 from "@/assets/restaurante-2.jpg";

interface RecommendedGridProps {
  restaurants: Restaurant[];
  onOpen: (id: string) => void;
  onFavorites: () => void;
}

function getRecommendedImage(index: number) {
  if (index === 0) return restaurante1;
  if (index === 1) return restaurante2;

  return restaurante1;
}

export function RecommendedGrid({
  restaurants,
  onOpen,
  onFavorites,
}: RecommendedGridProps) {
  return (
    <section aria-labelledby="recommended-title">
      <h2
        id="recommended-title"
        className="mb-3 text-[20px] font-black text-sage"
      >
        Recomendados
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {restaurants.map((restaurant, index) => (
          <div key={restaurant.id} className="relative">
            <button
              className="h-[136px] w-full overflow-hidden rounded-[20px] text-left shadow-[0_10px_24px_rgba(108,118,93,0.16)] transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
              type="button"
              onClick={() => onOpen(restaurant.id)}
              aria-label={`Abrir ${restaurant.name}`}
            >
              <img
                src={getRecommendedImage(index)}
                alt={restaurant.name}
                className="h-full w-full object-cover"
              />
            </button>

            <span className="absolute top-[8px] left-[8px] flex h-[22px] min-w-[43px] items-center gap-0.5 rounded-full bg-white px-[7px] text-[10px] font-extrabold text-sage shadow-sm">
              <Star size={10} fill="currentColor" className="text-leaf" />
              {restaurant.rating.toFixed(1)}
            </span>

            <button
              type="button"
              className="absolute bottom-[10px] left-[10px] grid h-[29px] w-[29px] place-items-center rounded-full bg-white text-leaf shadow-[0_4px_8px_rgba(108,118,93,0.18)] hover:bg-leaf hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              onClick={onFavorites}
              aria-label={`Agregar ${restaurant.name} a favoritos`}
            >
              <Heart size={20} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}