import { ChevronRight } from "lucide-react";
import type { Restaurant } from "../domain/home.types";
import { VenuePhoto } from "./VenuePhoto";

interface BestSellerListProps {
  restaurants: Restaurant[];
  onOpen: (id: string) => void;
  onRecommend: () => void;
}

export function BestSellerList({ restaurants, onOpen, onRecommend }: BestSellerListProps) {
  return (
    <section className="mb-5" aria-labelledby="best-seller-title">
      <div className="mb-3 flex items-center justify-between">
        <h2
          id="best-seller-title"
          className="text-[17px] font-black text-text-darker"
        >
          Mejor vendedor
        </h2>
        <button
          type="button"
          className="flex items-center gap-0.5 rounded text-[10px] font-extrabold text-text-dark transition-colors hover:text-text-darker focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
          onClick={onRecommend}
        >
          Ver Todo
          <ChevronRight size={12} />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {restaurants.map((restaurant) => (
          <button
            key={restaurant.id}
            className="h-[88px] overflow-hidden rounded-[18px] p-0 shadow-[0_8px_16px_rgba(31,38,30,0.1)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
            type="button"
            onClick={() => onOpen(restaurant.id)}
            aria-label={`Abrir ${restaurant.name}`}
          >
            <VenuePhoto restaurant={restaurant} compact />
          </button>
        ))}
      </div>
    </section>
  );
}
