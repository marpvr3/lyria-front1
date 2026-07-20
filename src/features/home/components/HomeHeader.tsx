import { useState } from "react";
import { Bell, Search, SlidersHorizontal } from "lucide-react";
import type { Profile, User } from "../domain/home.types";

interface HomeHeaderProps {
  user: User | null;
  profile: Profile | null;
  onMap: () => void;
  onOpenNotifications: () => void;
  onNavigate: (screen: string) => void;
}

export function HomeHeader({
  onMap,
  onOpenNotifications,
}: HomeHeaderProps) {
  const [search, setSearch] = useState("");

  return (
    <header className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="max-w-[230px]">
          <p className="text-[17px] font-black leading-[1.12] text-white">
            Descubre lugares que se adaptan a ti.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNotifications}
          className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full bg-leaf text-white shadow-[0_8px_18px_rgba(108,118,93,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Abrir notificaciones"
        >
          <Bell size={18} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sage"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar restaurantes"
            className="h-[48px] w-full rounded-full bg-white pl-11 pr-4 text-[13px] font-semibold text-sage shadow-[0_8px_18px_rgba(108,118,93,0.18)] outline-none placeholder:text-sage/55 focus:ring-2 focus:ring-white"
          />
        </div>

        
      </div>
    </header>
  );
}