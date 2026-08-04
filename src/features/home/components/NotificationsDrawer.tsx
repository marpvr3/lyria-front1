import { Bell, Heart, MapPin, Star, Utensils, X } from "lucide-react";
import "./notifications.css";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type?: "restaurant" | "favorite" | "promo" | "map";
};

interface NotificationsDrawerProps {
  open: boolean;
  notifications: NotificationItem[];
  onClose: () => void;
  showLogout?: boolean;
  onLogout?: () => void;
}

const notificationIcons = {
  restaurant: Utensils,
  favorite: Heart,
  promo: Star,
  map: MapPin,
};

export function NotificationsDrawer({
  open,
  notifications,
  onClose,
}: NotificationsDrawerProps) {
  if (!open) return null;

  return (
    <aside className="notifications-drawer-backdrop absolute inset-0 z-[80] bg-sage/35">
      <div className="notifications-drawer-panel absolute inset-y-0 right-0 w-[82%] max-w-[320px] rounded-l-[34px] bg-rose px-7 pt-10 shadow-[-18px_0_45px_rgba(108,118,93,0.28)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full text-sage transition hover:bg-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Cerrar notificaciones"
        >
          <X size={18} strokeWidth={2} />
        </button>

        <header className="mb-8 flex items-center gap-3 text-white">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white/25">
            <Bell size={19} strokeWidth={2} />
          </span>

          <h2 className="text-[20px] font-black">Notificaciones</h2>
        </header>

        <div className="h-px w-full bg-white/35" />

        <div className="mt-6 space-y-4">
          {notifications.map((notification) => {
            const Icon =
              notificationIcons[notification.type ?? "restaurant"] ?? Bell;

            return (
              <article
                key={notification.id}
                className="flex items-start gap-4 border-b border-white/35 pb-4"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[15px] bg-white text-sage shadow-[0_6px_14px_rgba(108,118,93,0.14)]">
                  <Icon size={20} strokeWidth={2} />
                </span>

                <div className="pt-1">
                  <h3 className="text-[12px] font-black leading-tight text-white">
                    {notification.title}
                  </h3>

                  <p className="mt-1 text-[11px] font-semibold leading-tight text-white/90">
                    {notification.message}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
