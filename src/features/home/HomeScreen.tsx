import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { HomeScreenProps } from "./domain/home.types";

import {
  categories,
  notificationPool,
  promoSlides,
} from "./data/home.mock";

import { AppShell } from "@/layouts/AppShell";

import { HomeHeader } from "./components/HomeHeader";
import { CategoryFilters } from "./components/CategoryFilters";
import { BestSellerList } from "./components/BestSellerList";
import { PromoCard } from "./components/PromoCard";
import { RecommendedGrid } from "./components/RecommendedGrid";
import { NotificationsDrawer } from "./components/NotificationsDrawer";

interface HomePromoProps {
  bestSellers: HomeScreenProps["restaurants"];
  restaurants: HomeScreenProps["restaurants"];
}

function HomePromo({
  bestSellers,
  restaurants,
}: HomePromoProps) {
  const [
    activeSlide,
    setActiveSlide,
  ] = useState(0);

  useEffect(() => {
    if (promoSlides.length <= 1) {
      return;
    }

    const interval =
      window.setInterval(
        () => {
          if (document.hidden) {
            return;
          }

          setActiveSlide(
            (current) =>
              (current + 1) %
              promoSlides.length,
          );
        },
        6000,
      );

    return () => {
      window.clearInterval(
        interval,
      );
    };
  }, []);

  if (promoSlides.length === 0) {
    return null;
  }

  const activePromo =
    promoSlides[
      activeSlide %
        promoSlides.length
    ];

  const heroPlace =
    bestSellers[
      activeSlide %
        Math.max(
          bestSellers.length,
          1,
        )
    ] ??
    bestSellers[0] ??
    restaurants[0];

  if (!activePromo || !heroPlace) {
    return null;
  }

  return (
    <div className="mt-5">
      <PromoCard
        activePromo={
          activePromo
        }
        heroPlace={
          heroPlace
        }
        promoSlides={
          promoSlides
        }
        activeSlide={
          activeSlide
        }
        onSlideChange={
          setActiveSlide
        }
      />
    </div>
  );
}

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
  const [
    notificationsOpen,
    setNotificationsOpen,
  ] = useState(false);

  const bestSellers =
    useMemo(() => {
      return restaurants
        .filter(
          (restaurant) =>
            restaurant.rating >= 4.5,
        )
        .slice(0, 4);
    }, [restaurants]);

  const recommended =
    useMemo(() => {
      return restaurants
        .filter(
          (restaurant) =>
            restaurant.diets.length >= 2,
        )
        .slice(0, 2);
    }, [restaurants]);

  const notifications =
    useMemo(() => {
      return notificationPool.map(
        (
          notification,
          index,
        ) => ({
          id: String(index),
          title:
            notification.title,
          message: "",
          type:
            notification.icon ===
            "heart"
              ? ("favorite" as const)
              : ("restaurant" as const),
        }),
      );
    }, []);

  return (
    <AppShell
      activeTab="home"
      onNavigate={
        onNavigate
      }
    >
      <main
        className={`min-h-full bg-white ${
          notificationsOpen
            ? "pointer-events-none"
            : ""
        }`}
      >
        <section className="bg-sage px-6 pb-10 pt-8">
          <HomeHeader
            user={user}
            profile={profile}
            onMap={onMap}
            onOpenNotifications={() =>
              setNotificationsOpen(
                true,
              )
            }
            onNavigate={
              onNavigate
            }
          />
        </section>

        <section className="-mt-7 rounded-t-[38px] bg-white px-5 pb-5 pt-5 shadow-[0_-10px_24px_rgba(57,64,50,0.08)]">
          <CategoryFilters
            categories={
              categories
            }
            onCategory={
              onCategory
            }
          />

          <div className="h-5" />

          <BestSellerList
            restaurants={
              bestSellers
            }
            onOpen={
              onOpen
            }
            onRecommend={
              onRecommend
            }
          />

          <HomePromo
            bestSellers={
              bestSellers
            }
            restaurants={
              restaurants
            }
          />

          <div className="mt-6">
            <RecommendedGrid
              restaurants={
                recommended
              }
              onOpen={
                onOpen
              }
              onFavorites={
                onFavorites
              }
            />
          </div>
        </section>
      </main>

      <NotificationsDrawer
        open={
          notificationsOpen
        }
        notifications={
          notifications
        }
        showLogout={
          user !== null
        }
        onClose={() =>
          setNotificationsOpen(
            false,
          )
        }
        onLogout={
          onLogout
        }
      />
    </AppShell>
  );
}