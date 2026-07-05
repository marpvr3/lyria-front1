import type { ReactNode } from "react";
import { ClipboardList, Headphones, Heart, Home, MapPin } from "lucide-react";

interface AppShellProps {
  children: ReactNode;
  activeTab?: string;
  onNavigate?: (screen: string) => void;
}

const navItems = [
  { id: "home", label: "Inicio", icon: Home },
  { id: "map", label: "Mapa", icon: MapPin },
  { id: "favorites", label: "Favoritos", icon: Heart },
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

        <nav className="absolute inset-x-0 bottom-0 z-50 rounded-t-[28px] bg-sage px-6 pb-5 pt-3 text-white shadow-[0_-12px_28px_rgba(108,118,93,0.22)]">
          <ul className="flex items-center justify-between">
            {navItems.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;

              return (
                <li key={id}>
                  <button
                    type="button"
                    className={`grid h-9 w-9 place-items-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                      isActive ? "bg-white/15 text-white" : "text-white"
                    }`}
                    onClick={() => onNavigate?.(id)}
                    aria-label={label}
                  >
                    <Icon size={21} strokeWidth={1.6} />
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