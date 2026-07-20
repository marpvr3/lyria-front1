import type { User, Profile, Restaurant, Notification, PromoSlide } from "../domain/home.types";

export const mockUser: User = {
  nombre: "María Paula",
  email: "maria@example.com",
};

export const mockProfile: Profile = {
  photo: null,
};

export const mockRestaurants: Restaurant[] = [
  {
    id: "r1",
    name: "Verde & Sano",
    photo: null,
    rating: 4.8,
    diets: ["Vegetariano", "Sin TACC", "Vegano"],
  },
  {
    id: "r2",
    name: "La Huerta Fit",
    photo: null,
    rating: 4.6,
    diets: ["Vegetariano", "Keto"],
  },
  {
    id: "r3",
    name: "Cocina Natural",
    photo: null,
    rating: 4.9,
    diets: ["Sin TACC"],
  },
  {
    id: "r4",
    name: "Bowl & Grain",
    photo: null,
    rating: 4.5,
    diets: ["Vegano", "Sin TACC", "Vegetariano"],
  },
  {
    id: "r5",
    name: "Delicias Verdes",
    photo: null,
    rating: 4.2,
    diets: ["Vegetariano", "Keto", "Sin TACC"],
  },
  {
    id: "r6",
    name: "Raíces",
    photo: null,
    rating: 4.0,
    diets: ["Vegano"],
  },
];

export const categories = [
  "Sin TACC",
  "Vegano",
  "Vegetariano",
  "Sin lactosa",
  "Sin azúcar",
  "Saludable",
  "Keto",
  "Sin frutos secos",
];

export const notificationPool: Notification[] = [
  {
    icon: "utensils",
    title: "Nuevo restaurante cerca de ti.",
  },
  {
    icon: "heart",
    title: "Uno de tus favoritos está en promoción.",
  },
];

export const promoSlides: PromoSlide[] = [
  {
    small: "Experimenta nuestro nuevo plato",
    title: "30% OFF",
  },
  {
    small: "Descubre opciones seguras",
    title: "Sin tacc",
  },
  {
    small: "Lugares recomendados",
    title: "Veggie",
  },
];
