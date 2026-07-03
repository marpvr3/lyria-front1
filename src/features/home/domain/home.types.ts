export interface User {
  nombre: string;
  email: string;
}

export interface Profile {
  photo: string | null;
}

export interface Restaurant {
  id: string;
  name: string;
  photo: string | null;
  rating: number;
  diets: string[];
}

export interface Notification {
  icon: "utensils" | "heart";
  title: string;
}

export interface PromoSlide {
  small: string;
  title: string;
}

export interface HomeScreenProps {
  user: User | null;
  profile: Profile | null;
  restaurants: Restaurant[];
  onCategory: (category: string) => void;
  onOpen: (id: string) => void;
  onMap: () => void;
  onFavorites: () => void;
  onRecommend: () => void;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}
