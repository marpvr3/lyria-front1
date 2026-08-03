import { useState, useEffect, useMemo } from "react";
import type { HomeScreenProps } from "./domain/home.types";
import { categories, notificationPool, promoSlides } from "./data/home.mock";
import { AppShell } from "@/layouts/AppShell";
import { HomeHeader } from "./components/HomeHeader";
import { HomeGreeting } from "./components/HomeGreeting";
import { CategoryFilters } from "./components/CategoryFilters";
import { BestSellerList } from "./components/BestSellerList";
import { PromoCard } from "./components/PromoCard";
import { RecommendedGrid } from "./components/RecommendedGrid";
import { NotificationsDrawer } from "./components/NotificationsDrawer";

export function HomeScreen({
  user,
  profile,
  restaurants,
  onCategory,
  onOpen,
  onMap,
  onFavorites,
  onRecommend,
  onNavigate,
  onLogout,
}: HomeScreenProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const bestSellers = restaurants
    .filter((restaurant) => restaurant.rating >= 4.5)
    .slice(0, 4);

  const recommended = restaurants
    .filter((restaurant) => restaurant.diets.length >= 2)
    .slice(0, 2);

  const heroPlace = bestSellers[activeSlide] ?? bestSellers[0] ?? restaurants[0];
  const activePromo = promoSlides[activeSlide];

  const notifications = useMemo(() => notificationPool, []);

  const initials = user?.nombre ? user.nombre.slice(0, 2).toUpperCase() : "LY";

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % promoSlides.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <AppShell>
      <div className={notificationsOpen ? "pointer-events-none" : ""}>
        {/* Panel verde superior */}
        <div className="px-6 pt-[34px]">
          <HomeHeader
            profile={profile}
            initials={initials}
            onMap={onMap}
            onOpenNotifications={() => setNotificationsOpen(true)}
            onNavigate={onNavigate}
          />

          <HomeGreeting user={user} />
        </div>

        {/* Content card */}
        <div className="rounded-t-[30px] bg-cream-light px-6 pt-14 pb-[150px]">
          <CategoryFilters categories={categories} onCategory={onCategory} />

          <BestSellerList
            restaurants={bestSellers}
            onOpen={onOpen}
            onRecommend={onRecommend}
          />

          <PromoCard
            activePromo={activePromo}
            heroPlace={heroPlace}
            promoSlides={promoSlides}
            activeSlide={activeSlide}
            onSlideChange={setActiveSlide}
          />

          <RecommendedGrid
            restaurants={recommended}
            onOpen={onOpen}
            onFavorites={onFavorites}
          />
        </div>
      </div>

      <NotificationsDrawer
        open={notificationsOpen}
        notifications={notifications}
        showLogout={user !== null}
        onClose={() => setNotificationsOpen(false)}
        onLogout={onLogout}
      />
    </AppShell>
  );
}
