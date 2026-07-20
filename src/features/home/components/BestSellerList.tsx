import { ChevronRight } from "lucide-react";
import type { Restaurant } from "../domain/home.types";

import restaurante1 from "@/assets/restaurante-3.jpg";
import restaurante2 from "@/assets/restaurante-4.jpg";
import restaurante3 from "@/assets/restaurante-5.jpg";
import restaurante4 from "@/assets/restaurante-6.jpg";

interface BestSellerListProps {
  restaurants: Restaurant[];
  onOpen: (id: string) => void;
  onRecommend: () => void;
}

function getBestSellerImage(index: number) {
  if (index === 0) return restaurante1;
  if (index === 1) return restaurante2;
  if (index === 2) return restaurante3;
  if (index === 3) return restaurante4;

  return restaurante1;
}

export function BestSellerList({
  restaurants,
  onOpen,
  onRecommend,
}: BestSellerListProps) {
  return (
    <section className="mb-5" aria-labelledby="best-seller-title">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="best-seller-title" className="text-[20px] font-black text-sage">
          Mejor vendedor
        </h2>

        <button
          type="button"
          className="flex items-center gap-0.5 rounded text-[12px] font-extrabold text-sage hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          onClick={onRecommend}
        >
          Ver Todo
          <ChevronRight size={12} />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {restaurants.map((restaurant, index) => (
          <button
            key={restaurant.id}
            className="h-[82px] overflow-hidden rounded-[16px] p-0 shadow-[0_10px_22px_rgba(108,118,93,0.16)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
            type="button"
            onClick={() => onOpen(restaurant.id)}
            aria-label={`Abrir ${restaurant.name}`}
          >
            <img
              src={getBestSellerImage(index)}
              alt={restaurant.name}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </section>
  );
}