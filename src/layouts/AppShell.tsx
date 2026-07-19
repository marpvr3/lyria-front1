import type { ReactNode } from "react";
import { ClipboardList, Headphones, Heart, Home, MapPin } from "lucide-react";

interface AppShellProps {
  children: ReactNode;
  activeTab?: string;
  onNavigate?: (screen: string) => void;
}

const navItems = [
  { id: "home", label: "Inicio", icon: Home },
  { id: "favorites", label: "Favoritos", icon: Heart },
  { id: "map", label: "Mapa", icon: MapPin },
  { id: "orders", label: "Lista", icon: ClipboardList },
  { id: "support", label: "Soporte", icon: Headphones },
];

export function AppShell({
  children,
  activeTab = "home",
  onNavigate,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-cream px-3 py-4 font-sans sm:flex sm:items-center sm:justify-center">
      <div className="relative mx-auto h-[812px] w-full max-w-[390px] overflow-hidden rounded-[30px] bg-sage shadow-[0_24px_70px_rgba(108,118,93,0.35)]">
        <div className="h-full overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </div>

        <nav className="absolute inset-x-0 bottom-0 z-50  bg-white px-5 pb-4 pt-4 shadow-[0_-10px_28px_rgba(108,118,93,0.16)]">
          <ul className="relative grid grid-cols-5 items-center">
            {navItems.map(({ id, label, icon: Icon }) => {
              const isCenter = id === "map";
              const isActive = activeTab === id;

              if (isCenter) {
                return (
                  <li key={id} className="relative flex h-[36px] justify-center">
                    <button
                      type="button"
                      onClick={() => onNavigate?.(id)}
                      aria-label={label}
                      className="absolute -top-[22px] grid h-[58px] w-[58px] place-items-center rounded-full bg-leaf text-white shadow-[0_12px_24px_rgba(108,118,93,0.28)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <Icon size={23} strokeWidth={2} />
                    </button>
                  </li>
                );
              }

              return (
                <li key={id} className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => onNavigate?.(id)}
                    aria-label={label}
                    className={`grid h-[36px] w-[36px] place-items-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage ${
                      isActive
                        ? "bg-cream text-sage"
                        : "text-sage/85 hover:bg-cream hover:text-sage"
                    }`}
                  >
                    <Icon size={19} strokeWidth={1.9} />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}