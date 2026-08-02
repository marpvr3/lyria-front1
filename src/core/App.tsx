import { useEffect, useState } from "react";

import { HomeScreen } from "@/features/home";
import {
  mockProfile,
  mockRestaurants,
  mockUser,
} from "@/features/home/data/home.mock";

import { LoginScreen } from "../features/Login/LoginScreen";
import { RegisterScreen } from "../features/Login/RegisterScreen";
import { SplashScreen } from "../features/Login/SplashScreen";
import { WelcomeScreen } from "../features/Login/WelcomeScreen";

type Screen =
  | "splash"
  | "welcome"
  | "login"
  | "register"
  | "home";

function App() {
  const [screen, setScreen] = useState<Screen>("splash");

  useEffect(() => {
    if (screen !== "splash") return;

    const timer = window.setTimeout(() => {
      setScreen("welcome");
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [screen]);

  if (screen === "splash") {
    return <SplashScreen />;
  }

  if (screen === "welcome") {
    return (
      <WelcomeScreen
        onLogin={() => setScreen("login")}
        onRegister={() => setScreen("register")}
      />
    );
  }

  if (screen === "login") {
    return (
      <LoginScreen
        onBack={() => setScreen("welcome")}
        onSubmit={() => setScreen("home")}
        onRegister={() => setScreen("register")}
      />
    );
  }

  if (screen === "register") {
    return (
      <RegisterScreen
        onBack={() => setScreen("welcome")}
        onSubmit={() => setScreen("home")}
        onLogin={() => setScreen("login")}
      />
    );
  }

  return (
    <HomeScreen
      user={mockUser}
      profile={mockProfile}
      restaurants={mockRestaurants}
      onCategory={(category) => console.info("category:", category)}
      onOpen={(id) => console.info("open:", id)}
      onMap={() => console.info("map")}
      onFavorites={() => console.info("favorites")}
      onRecommend={() => console.info("recommend")}
      onNavigate={(destination) =>
        console.info("navigate:", destination)
      }
      onLogout={() => setScreen("welcome")}
    />
  );
}

export default App;