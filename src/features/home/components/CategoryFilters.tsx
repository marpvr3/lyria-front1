interface CategoryFiltersProps {
  categories: string[];
  onCategory: (category: string) => void;
}

export function CategoryFilters({ categories, onCategory }: CategoryFiltersProps) {
  return (
    <section
      className="mb-[34px] grid grid-cols-4 gap-3"
      aria-label="Filtros rápidos"
    >
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className="h-6 truncate rounded-full bg-leaf-dark px-2 text-xs font-bold text-white transition-colors hover:bg-leaf-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream-light"
          onClick={() =>
            onCategory(category === "Saludable" ? "Vegetariano" : category)
          }
        >
          {category}
        </button>
      ))}
    </section>
  );
}
