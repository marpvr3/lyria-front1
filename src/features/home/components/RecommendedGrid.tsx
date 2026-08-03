import { Star, Heart } from "lucide-react";
import type { Restaurant } from "../domain/home.types";
import { VenuePhoto } from "./VenuePhoto";

interface RecommendedGridProps {
  restaurants: Restaurant[];
  onOpen: (id: string) => void;
  onFavorites: () => void;
}

export function RecommendedGrid({ restaurants, onOpen, onFavorites }: RecommendedGridProps) {
  return (
    <section aria-labelledby="recommended-title">
      <h2
        id="recommended-title"
        className="mb-3 text-[17px] font-black text-text-darker"
      >
        Recomendados
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="relative">
            <button
              className="h-[142px] w-full overflow-hidden rounded-[21px] text-left shadow-[0_8px_16px_rgba(31,38,30,0.12)] transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
              type="button"
              onClick={() => onOpen(restaurant.id)}
              aria-label={`Abrir ${restaurant.name}`}
            >
              <VenuePhoto restaurant={restaurant} compact />
            </button>

            {/* Rating - arriba izquierda */}
            <span className="absolute top-[9px] left-[9px] flex h-[22px] min-w-[44px] items-center gap-0.5 rounded-full bg-white/95 px-[7px] text-[10px] font-extrabold text-text-dark shadow-sm">
              <Star size={10} fill="currentColor" className="text-leaf" />
              {restaurant.rating.toFixed(1)}
            </span>

            {/* Favorito - abajo izquierda */}
            <button
              type="button"
              className="absolute bottom-[9px] left-[9px] grid h-[29px] w-[29px] place-items-center rounded-full bg-white text-leaf shadow-[0_4px_8px_rgba(31,38,30,0.16)] transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
              onClick={onFavorites}
              aria-label={`Agregar ${restaurant.name} a favoritos`}
            >
              <Heart size={15} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
