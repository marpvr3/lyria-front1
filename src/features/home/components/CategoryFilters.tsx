import { useRef, useState } from "react";
import type { ComponentType, SVGProps } from "react";
import { Carrot, MilkOff, Salad, Sprout } from "lucide-react";

interface CategoryFiltersProps {
  categories: string[];
  onCategory: (category: string) => void;
}

type FilterIcon = ComponentType<SVGProps<SVGSVGElement>>;

function BaseIcon({
  children,
  ...props
}: SVGProps<SVGSVGElement> & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

function SinTaccIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M12 20V5" />
      <path d="M12 9C9 8.5 7.5 7 7 5.5C10 5.8 11.4 7.2 12 9Z" />
      <path d="M12 13C9 12.5 7.5 11 7 9.5C10 9.8 11.4 11.2 12 13Z" />
      <path d="M12 17C15 16.5 16.5 15 17 13.5C14 13.8 12.6 15.2 12 17Z" />
      <path d="M5 20L19 4" strokeWidth="2.2" />
    </BaseIcon>
  );
}

function SugarFreeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M7 9.5L12 6.5L17 9.5V15.5L12 18.5L7 15.5V9.5Z" />
      <path d="M7 9.5L12 12.5L17 9.5" />
      <path d="M12 12.5V18.5" />
      <path d="M5 20L19 4" strokeWidth="2.2" />
    </BaseIcon>
  );
}

function NutFreeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M14.5 4.8C17.8 6.2 19 10.1 17.8 14.2C16.6 18.1 13.5 20.4 10.3 19.4C7.1 18.4 5.6 15 6.4 11.5C7.2 7.8 10.5 3.1 14.5 4.8Z" />
      <path d="M10 10.5C11.4 9.6 13.4 9.8 14.5 11.2" />
      <path d="M5 20L19 4" strokeWidth="2.2" />
    </BaseIcon>
  );
}

const categoryInfo: Record<string, { label: string; icon: FilterIcon }> = {
  "Sin TACC": {
    label: "Sin TACC",
    icon: SinTaccIcon,
  },
  Vegano: {
    label: "Vegano",
    icon: Sprout,
  },
  Vegetariano: {
    label: "Vegetariano",
    icon: Carrot,
  },
  "Sin lactosa": {
    label: "Sin lactosa",
    icon: MilkOff,
  },
  "Sin azúcar": {
    label: "Sin azúcar",
    icon: SugarFreeIcon,
  },
  Saludable: {
    label: "Saludable",
    icon: Salad,
  },
  "Sin frutos secos": {
    label: "Sin frutos secos",
    icon: NutFreeIcon,
  },
};

export function CategoryFilters({
  categories,
  onCategory,
}: CategoryFiltersProps) {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);

  const visibleCategories = categories.slice(0, 7);

  function handleMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    if (!sliderRef.current) return;

    setIsDragging(true);
    setDragStartX(event.pageX - sliderRef.current.offsetLeft);
    setInitialScrollLeft(sliderRef.current.scrollLeft);
  }

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!isDragging || !sliderRef.current) return;

    event.preventDefault();

    const currentX = event.pageX - sliderRef.current.offsetLeft;
    const distance = (currentX - dragStartX) * 1.4;

    sliderRef.current.scrollLeft = initialScrollLeft - distance;
  }

  function stopDragging() {
    setIsDragging(false);
  }

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
              label: category,
              icon: Salad,
            };

            const Icon = info.icon;
            const isActive = index === 0;

            return (
              <button
                key={category}
                type="button"
                onClick={() => {
                  if (!isDragging) onCategory(category);
                }}
                className={`flex h-[36px] shrink-0 items-center gap-2 rounded-full border px-3.5 text-[10px] font-black shadow-[0_5px_12px_rgba(108,118,93,0.10)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage ${
                  isActive
                    ? "border-leaf bg-leaf text-white"
                    : "border-sage/10 bg-white text-sage"
                }`}
              >
                <span
                  className={`grid h-[22px] w-[22px] place-items-center rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-cream text-sage"
                  }`}
                >
                  <Icon className="h-[14px] w-[14px]" />
                </span>

                <span className="whitespace-nowrap">{info.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}