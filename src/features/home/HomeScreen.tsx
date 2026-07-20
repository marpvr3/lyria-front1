import { useState, useEffect, useMemo } from "react";
import type { HomeScreenProps } from "./domain/home.types";
import { categories, notificationPool, promoSlides } from "./data/home.mock";
import { AppShell } from "@/layouts/AppShell";
import { HomeHeader } from "./components/HomeHeader";
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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % promoSlides.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <AppShell>
      <main
        className={`min-h-full bg-sage ${
          notificationsOpen ? "pointer-events-none" : ""
        }`}
      >
        <section className="bg-sage px-6 pt-8 pb-10">
          <HomeHeader
            user={user}
            profile={profile}
            onMap={onMap}
            onOpenNotifications={() => setNotificationsOpen(true)}
            onNavigate={onNavigate}
          />
        </section>

        <section className="-mt-5 min-h-[650px] rounded-t-[34px] bg-white px-5 pt-8 pb-[135px] shadow-[0_-12px_30px_rgba(108,118,93,0.16)]">
          <CategoryFilters categories={categories} onCategory={onCategory} />

          <div className="my-6 h-px w-full bg-sage/25" />

          <BestSellerList
            restaurants={bestSellers}
            onOpen={onOpen}
            onRecommend={onRecommend}
          />

          <div className="mt-5">
            <PromoCard
              activePromo={activePromo}
              heroPlace={heroPlace}
              promoSlides={promoSlides}
              activeSlide={activeSlide}
              onSlideChange={setActiveSlide}
            />
          </div>

          <div className="mt-6">
            <RecommendedGrid
              restaurants={recommended}
              onOpen={onOpen}
              onFavorites={onFavorites}
            />
          </div>
        </section>
      </main>

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