import { useEffect, useState } from "react";

import { HomeScreen } from "@/features/home";
import {
  CommunityScreen,
  CreatePostScreen,
  PostSuccessScreen,
} from "@/features/community";
import {
  createCommunityPost,
  getCommunityData,
  sendCommunityMessage,
} from "@/features/community/services/community.api";
import { fallbackCommunityChats, fallbackCommunityPosts } from "@/features/community/data/community.mock";
import type {
  CommunityMessage,
  CreateCommunityPostRequest,
} from "@/features/community/domain/community.types";
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
  | "home"
  | "community"
  | "community-create"
  | "community-success";

function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [communityPosts, setCommunityPosts] = useState(fallbackCommunityPosts);
  const [communityChats, setCommunityChats] = useState(fallbackCommunityChats);
  const [communityLoading, setCommunityLoading] = useState(true);
  const [communityError, setCommunityError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getCommunityData()
      .then((data) => {
        if (!active) return;
        setCommunityPosts(data.posts);
        setCommunityChats(data.chats);
        setCommunityError(null);
      })
      .catch(() => {
        if (!active) return;
        setCommunityError("Mostrando contenido de ejemplo hasta conectar la base de datos.");
      })
      .finally(() => {
        if (active) setCommunityLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

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
        onLogin={() => setScreen("login")}
      />
    );
  }

  function handleNavigate(destination: string) {
    if (destination === "community") {
      setScreen("community");
      return;
    }

    if (destination === "community-create") {
      setScreen("community-create");
      return;
    }

    if (destination === "community-success") {
      setScreen("community-success");
      return;
    }

    if (destination === "home") {
      setScreen("home");
    }
  }

  async function handleSendCommunityMessage(chatId: string, text: string): Promise<CommunityMessage> {
    const message = await sendCommunityMessage(chatId, text);
    setCommunityChats((current) =>
      current.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, message], time: "Ahora", unread: 0 }
          : chat,
      ),
    );
    return message;
  }

  async function handlePublishCommunityPost(payload: CreateCommunityPostRequest) {
    const post = await createCommunityPost(payload);
    setCommunityPosts((current) => [post, ...current]);
    setScreen("community-success");
  }

  if (screen === "community") {
    return (
      <CommunityScreen
        posts={communityPosts}
        chats={communityChats}
        loading={communityLoading}
        error={communityError}
        onSendMessage={handleSendCommunityMessage}
        onNavigate={handleNavigate}
      />
    );
  }

  if (screen === "community-create") {
    return (
      <CreatePostScreen
        authorName={mockUser.nombre}
        onBack={() => setScreen("community")}
        onPublish={handlePublishCommunityPost}
        onNavigate={handleNavigate}
      />
    );
  }

  if (screen === "community-success") {
    return (
      <PostSuccessScreen
        onCommunity={() => setScreen("community")}
        onNavigate={handleNavigate}
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
      onNavigate={handleNavigate}
      onLogout={() => setScreen("welcome")}
    />
  );
}

export default App;
