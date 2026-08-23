import { useState } from "react";

import {
  Bell,
  Search,
  UserRound,
} from "lucide-react";

import type {
  Profile,
  User,
} from "../domain/home.types";

interface HomeHeaderProps {
  user: User | null;

  profile: Profile | null;

  onMap: () => void;

  onOpenNotifications: () => void;

  onNavigate: (
    screen: string,
  ) => void;
}

export function HomeHeader({
  onOpenNotifications,
  onNavigate,
}: HomeHeaderProps) {
  const [
    search,
    setSearch,
  ] = useState("");

  return (
    <header className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="max-w-[205px]">
          <p className="text-[17px] font-black leading-[1.12] text-white">
            Descubre lugares que se adaptan a ti.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() =>
              onNavigate(
                "profile",
              )
            }
            aria-label="Abrir perfil"
            className="
              grid
              h-[38px]
              w-[38px]
              place-items-center
              rounded-full
              bg-white
              text-sage
              shadow-[0_7px_16px_rgba(57,64,50,0.10)]
              transition
              duration-200
              hover:scale-[1.03]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-white
            "
          >
            <UserRound
              size={17}
              strokeWidth={1.9}
            />
          </button>

          <button
            type="button"
            onClick={
              onOpenNotifications
            }
            aria-label="Abrir notificaciones"
            className="
              grid
              h-[38px]
              w-[38px]
              place-items-center
              rounded-full
              bg-leaf
              text-white
              shadow-[0_7px_16px_rgba(108,118,93,0.16)]
              transition
              duration-200
              hover:scale-[1.03]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-white
            "
          >
            <Bell
              size={17}
              strokeWidth={1.9}
            />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={17}
            strokeWidth={1.9}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sage"
          />

          <input
            type="text"
            value={search}
            onChange={(
              event,
            ) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Buscar restaurantes"
            className="
              h-[48px]
              w-full
              rounded-full
              bg-white
              pl-11
              pr-4
              text-[13px]
              font-semibold
              text-sage
              shadow-[0_7px_16px_rgba(108,118,93,0.14)]
              outline-none
              placeholder:text-sage/50
              focus:ring-2
              focus:ring-white
            "
          />
        </div>
      </div>
    </header>
  );
}