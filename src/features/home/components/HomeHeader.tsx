import { Search, Bell, UserRound } from "lucide-react";
import type { Profile } from "../domain/home.types";

interface HomeHeaderProps {
  profile: Profile | null;
  initials: string;
  onMap: () => void;
  onOpenNotifications: () => void;
  onNavigate: (screen: string) => void;
}

export function HomeHeader({
  profile,
  onMap,
  onOpenNotifications,
  onNavigate,
}: HomeHeaderProps) {
  return (
    <header className="mb-[18px] flex items-center justify-between">
      <button
        className="flex h-[30px] w-[165px] items-center justify-between rounded-full bg-white px-4 pl-4 pr-2.5 text-[11px] font-semibold text-sage shadow-[0_4px_10px_rgba(31,38,30,0.08)] transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
        type="button"
        onClick={onMap}
        aria-label="Buscar restaurantes"
      >
        <span>Buscar</span>
        <Search size={14} strokeWidth={2.3} className="text-leaf" />
      </button>

      <div className="flex items-center gap-2">
        <button
          className="grid h-[31px] w-[31px] place-items-center rounded-full bg-white text-sage shadow-[0_4px_10px_rgba(31,38,30,0.1)] transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
          type="button"
          onClick={onOpenNotifications}
          aria-label="Abrir notificaciones"
        >
          <Bell size={15} />
        </button>

        <button
          className="grid h-[31px] w-[31px] place-items-center overflow-hidden rounded-full bg-white text-sage shadow-[0_4px_10px_rgba(31,38,30,0.1)] transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
          type="button"
          onClick={() => onNavigate("profile")}
          aria-label="Abrir perfil"
        >
          {profile?.photo ? (
            <img
              src={profile.photo}
              alt="Foto de perfil"
              className="h-full w-full object-cover"
            />
          ) : (
            <UserRound size={15} />
          )}
        </button>
      </div>
    </header>
  );
}
