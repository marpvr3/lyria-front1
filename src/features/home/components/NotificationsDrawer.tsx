import { useEffect, useRef } from "react";
import { X, Utensils, Heart, LogOut, Bell } from "lucide-react";
import type { Notification } from "../domain/home.types";

interface NotificationsDrawerProps {
  open: boolean;
  notifications: Notification[];
  showLogout: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function NotificationsDrawer({
  open,
  notifications,
  showLogout,
  onClose,
  onLogout,
}: NotificationsDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[9998] bg-[rgba(31,38,30,0.18)] transition-opacity duration-250 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Notificaciones"
        className={`fixed top-0 right-0 z-[9999] flex h-dvh w-[89%] max-w-md flex-col overflow-hidden rounded-l-[48px] bg-rose px-[34px] pt-[76px] pb-[120px] text-text-darker shadow-[-12px_0_30px_rgba(31,38,30,0.18)] transition-transform duration-[280ms] ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Botón cerrar */}
        <button
          ref={closeButtonRef}
          type="button"
          className="absolute top-5 right-[18px] grid h-[30px] w-[30px] place-items-center text-text-darker focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-darker"
          onClick={onClose}
          aria-label="Cerrar notificaciones"
        >
          <X size={20} />
        </button>

        {/* Cabecera */}
        <div className="mb-[34px] flex items-center justify-center border-b border-text-darker/30 pb-8">
          <span className="flex items-center justify-center gap-[11px]">
            <Bell size={20} className="text-text-darker" />
            <strong className="text-[17px] font-black text-text-darker">
              Notificaciones
            </strong>
          </span>
        </div>

        {/* Lista */}
        <div className="flex flex-1 flex-col gap-0 overflow-y-auto">
          {notifications.map((notification) => (
            <button
              key={notification.title}
              type="button"
              className="grid grid-cols-[40px_1fr] items-center gap-3 border-b border-text-darker/30 px-0 py-[18px] text-left text-text-darker focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-darker"
              onClick={() => {}}
            >
              <span className="grid h-[34px] w-[34px] place-items-center rounded-full border-2 border-text-darker text-text-darker">
                {notification.icon === "utensils" ? (
                  <Utensils size={16} />
                ) : (
                  <Heart size={16} />
                )}
              </span>
              <span className="flex flex-col">
                <strong className="text-xs leading-tight font-extrabold text-text-darker">
                  {notification.title}
                </strong>
              </span>
            </button>
          ))}
        </div>

        {/* Logout */}
        {showLogout && (
          <button
            type="button"
            className="absolute right-[34px] bottom-[34px] left-[34px] flex h-[46px] items-center justify-center gap-[9px] rounded-full border-[1.5px] border-text-darker/85 bg-transparent text-[13px] font-extrabold text-text-darker transition-colors hover:bg-text-darker/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-darker"
            onClick={() => {
              onClose();
              onLogout();
            }}
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        )}
      </aside>
    </>
  );
}
