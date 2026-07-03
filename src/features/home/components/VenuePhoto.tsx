import type { Restaurant } from "../domain/home.types";

interface VenuePhotoProps {
  restaurant: Restaurant;
  compact?: boolean;
}

export function VenuePhoto({ restaurant, compact }: VenuePhotoProps) {
  if (restaurant.photo) {
    return (
      <img
        src={restaurant.photo}
        alt={restaurant.name}
        className={`object-cover ${compact ? "h-full w-full" : "h-40 w-full"} rounded-xl`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-xl bg-sage/30 text-text-dark ${compact ? "h-full w-full" : "h-40 w-full"}`}
      aria-label={restaurant.name}
    >
      <span className="text-xs font-medium">{restaurant.name}</span>
    </div>
  );
}
