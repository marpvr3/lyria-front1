import { useEffect, useState } from "react";

import { clearSession } from "@/core/auth/authSession";

import { HomeScreen } from "@/features/home";

import {
  mockProfile,
  mockRestaurants,
  mockUser,
} from "@/features/home/data/home.mock";

import { CommunityScreen } from "../features/Comunidad/CommunityScreen";

import { CommunityGroupScreen } from "../features/Comunidad/CommunityGroupScreen";

import { CommunityPostDetailScreen } from "../features/Comunidad/CommunityPostDetailScreen";

import { CreateCommunityPostScreen } from "../features/Comunidad/CreateCommunityPostScreen";

import { EmailVerificationScreen } from "../features/Login/EmailVerificationScreen";

import { LoginScreen } from "../features/Login/LoginScreen";

import { RegisterScreen } from "../features/Login/RegisterScreen";

import { SplashScreen } from "../features/Login/SplashScreen";

import { WelcomeScreen } from "../features/Login/WelcomeScreen";

type Screen =
  | "splash"
  | "welcome"
  | "login"
  | "register"
  | "verify-email"
  | "home"
  | "community"
  | "community-group"
  | "community-post"
  | "community-create";

function App() {
  const [screen, setScreen] =
    useState<Screen>("splash");

  const [
    selectedGroupId,
    setSelectedGroupId,
  ] = useState<string>(
    "sin-tacc",
  );

  /**
   * Id de la publicación abierta.
   *
   * Se guarda al abrir el detalle, pero todavía nadie lo lee:
   * `CommunityPostDetailScreen` aún es estático y no acepta `postId`. Por eso
   * se omite el valor del destructuring —declararlo rompería `noUnusedLocals`—
   * y se conserva solo el setter, listo para cuando la pantalla lo reciba.
   */
  const [
    ,
    setSelectedPostId,
  ] = useState<string>(
    "",
  );

  /**
   * Correo pendiente de verificar.
   *
   * Vive solo en memoria y solo entre el registro y la verificación: la
   * navegación ya vive en este componente, así que no hace falta persistirlo
   * —una recarga vuelve al splash de todas formas—. Nunca se guarda la
   * contraseña.
   */
  const [
    pendingVerificationEmail,
    setPendingVerificationEmail,
  ] = useState<string>(
    "",
  );

  useEffect(() => {
    if (
      screen !== "splash"
    ) {
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          setScreen(
            "welcome",
          );
        },
        2000,
      );

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [screen]);

  function handleNavigation(
    destination: string,
  ) {
    if (
      destination === "home"
    ) {
      setScreen(
        "home",
      );

      return;
    }

    if (
      destination ===
      "community"
    ) {
      setScreen(
        "community",
      );

      return;
    }

    if (
      destination ===
      "favorites"
    ) {
      console.info(
        "favorites",
      );

      return;
    }

    if (
      destination === "map"
    ) {
      console.info(
        "map",
      );

      return;
    }

    if (
      destination ===
      "support"
    ) {
      console.info(
        "support",
      );
    }
  }

  /**
   * Registro exitoso (201): la cuenta queda sin verificar, así que el paso
   * siguiente es la verificación del correo y no el login.
   */
  function handleRegistered(
    email: string,
  ) {
    setPendingVerificationEmail(
      email,
    );

    setScreen(
      "verify-email",
    );
  }

  /** Vuelve al login y descarta el correo pendiente: ya cumplió su función. */
  function goToLogin() {
    setPendingVerificationEmail(
      "",
    );

    setScreen(
      "login",
    );
  }

  function handleOpenGroup(
    groupId: string,
  ) {
    setSelectedGroupId(
      groupId,
    );

    setScreen(
      "community-group",
    );
  }

  function handleCreatePost() {
    setScreen(
      "community-create",
    );
  }

  function handleOpenPost(
    postId: string,
  ) {
    setSelectedPostId(
      postId,
    );

    setScreen(
      "community-post",
    );
  }

  if (
    screen === "splash"
  ) {
    return (
      <SplashScreen />
    );
  }

  if (
    screen === "welcome"
  ) {
    return (
      <WelcomeScreen
        onLogin={() =>
          setScreen(
            "login",
          )
        }
        onRegister={() =>
          setScreen(
            "register",
          )
        }
      />
    );
  }

  if (
    screen === "login"
  ) {
    return (
      <LoginScreen
        onBack={() =>
          setScreen(
            "welcome",
          )
        }
        onSubmit={() =>
          setScreen(
            "home",
          )
        }
        onRegister={() =>
          setScreen(
            "register",
          )
        }
      />
    );
  }

  if (
    screen === "register"
  ) {
    return (
      <RegisterScreen
        onBack={() =>
          setScreen(
            "welcome",
          )
        }
        onLogin={() =>
          setScreen(
            "login",
          )
        }
        onRegistered={
          handleRegistered
        }
      />
    );
  }

  if (
    screen ===
    "verify-email"
  ) {
    return (
      <EmailVerificationScreen
        email={
          pendingVerificationEmail
        }
        onVerified={
          goToLogin
        }
        onBack={
          goToLogin
        }
      />
    );
  }

  if (
    screen ===
    "community"
  ) {
    return (
      <CommunityScreen
        onNavigate={
          handleNavigation
        }
        onOpenGroup={
          handleOpenGroup
        }
        onCreatePost={
          handleCreatePost
        }
        onOpenPost={
          handleOpenPost
        }
      />
    );
  }

  if (
    screen ===
    "community-group"
  ) {
    return (
      <CommunityGroupScreen
        groupId={
          selectedGroupId
        }
        onBack={() =>
          setScreen(
            "community",
          )
        }
        onCreatePost={
          handleCreatePost
        }
        onOpenPost={
          handleOpenPost
        }
      />
    );
  }

  if (
    screen ===
    "community-create"
  ) {
    return (
      <CreateCommunityPostScreen
        onBack={() =>
          setScreen(
            "community",
          )
        }
        onPublish={(
          post,
        ) => {
          console.info(
            "Nueva publicación:",
            post,
          );

          setScreen(
            "community",
          );
        }}
      />
    );
  }

  if (
    screen ===
    "community-post"
  ) {
    return (
      <CommunityPostDetailScreen
        onBack={() =>
          setScreen(
            "community",
          )
        }
      />
    );
  }

  return (
    <HomeScreen
      user={mockUser}
      profile={
        mockProfile
      }
      restaurants={
        mockRestaurants
      }
      onCategory={(
        category,
      ) =>
        console.info(
          "category:",
          category,
        )
      }
      onOpen={(id) =>
        console.info(
          "open:",
          id,
        )
      }
      onMap={() =>
        console.info(
          "map",
        )
      }
      onFavorites={() =>
        console.info(
          "favorites",
        )
      }
      onRecommend={() =>
        console.info(
          "recommend",
        )
      }
      onNavigate={
        handleNavigation
      }
      onLogout={() => {
        clearSession();

        setScreen(
          "welcome",
        );
      }}
    />
  );
}

export default App;