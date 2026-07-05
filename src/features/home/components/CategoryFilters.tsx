import { useRef, useState } from "react";

interface CategoryFiltersProps {
  categories: string[];
  onCategory: (category: string) => void;
}

const categoryInfo: Record<string, { emoji: string; label: string }> = {
  "Sin TACC": {
    emoji: "🌾",
    label: "Sin TACC",
  },
  Vegano: {
    emoji: "🌱",
    label: "Vegano",
  },
  Vegetariano: {
    emoji: "🥬",
    label: "Vegetariano",
  },
  "Sin lactosa": {
    emoji: "🥛",
    label: "Sin lactosa",
  },
  "Sin azúcar": {
    emoji: "🍬",
    label: "Sin azúcar",
  },
  Saludable: {
    emoji: "🥗",
    label: "Saludable",
  },
  Keto: {
    emoji: "🥑",
    label: "Keto",
  },
  "Sin frutos secos": {
    emoji: "🥜",
    label: "Sin frutos secos",
  },
};

export function CategoryFilters({
  categories,
  onCategory,
}: CategoryFiltersProps) {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const visibleCategories = categories.slice(0, 8);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;

    setIsDragging(true);
    setStartX(event.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !sliderRef.current) return;

    event.preventDefault();

    const x = event.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.4;

    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  return (
    <section aria-label="Filtros rápidos">
      <div
        ref={sliderRef}
        className={`-mx-5 cursor-grab overflow-x-auto px-5 pb-2 active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          isDragging ? "select-none" : ""
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
      >
        <div className="flex w-max gap-2.5">
          {visibleCategories.map((category, index) => {
            const info = categoryInfo[category] ?? {
              emoji: "🍽️",
              label: category,
            };

            const isActive = index === 0;

            return (
              <button
                key={category}
                type="button"
                onClick={() => {
                  if (!isDragging) onCategory(category);
                }}
                className={`flex h-[34px] shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[10px] font-black shadow-[0_5px_12px_rgba(108,118,93,0.10)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage ${
                  isActive
                    ? "border-leaf bg-leaf text-white"
                    : "border-sage/15 bg-white text-sage"
                }`}
              >
                <span className="text-[13px] leading-none">{info.emoji}</span>
                <span className="whitespace-nowrap">{info.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}