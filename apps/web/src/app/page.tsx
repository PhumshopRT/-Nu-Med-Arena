"use client";

import React, { useState, useEffect } from "react";
import { BootScreen } from "@/components/splash/BootScreen";
import { TitleSplash } from "@/components/splash/TitleSplash";
import { HomeHub } from "@/components/hub/HomeHub";
import { StudentUser } from "@nucmed/shared";
import { createDefaultUser, getRememberedUser, logoutAccount } from "@/lib/user";
import { initAccountSync } from "@/lib/account-sync";
import { useRouter } from "next/navigation";

type ScreenState = "boot" | "splash" | "hub";

export default function HomePage() {
  const [screen, setScreen] = useState<ScreenState>("boot");
  const [user, setUser] = useState<StudentUser | null>(null);
  const [autoOpenLogin, setAutoOpenLogin] = useState(false);
  const router = useRouter();

  // Check saved session on mount and initialize multi-device account sync
  useEffect(() => {
    try {
      const remembered = getRememberedUser();
      if (remembered) {
        setUser(remembered);
      }
    } catch {
      // Ignore parse errors
    }
    const cleanupSync = initAccountSync();
    return () => {
      cleanupSync();
    };
  }, []);

  const handleBootComplete = () => {
    // After boot completes, go to Title Splash
    setScreen("splash");
  };

  const handleLoginSuccess = (loggedInUser: StudentUser) => {
    setUser(loggedInUser);
    setAutoOpenLogin(false);
    setScreen("hub");
  };

  const handleLogout = () => {
    logoutAccount();
    setUser(null);
    setAutoOpenLogin(false);
    setScreen("splash");
  };

  const handleSwitchAccount = () => {
    logoutAccount();
    setUser(null);
    setAutoOpenLogin(true);
    setScreen("splash");
  };

  const handleOpenGallery = () => {
    router.push("/gallery");
  };

  if (screen === "boot") {
    return <BootScreen onComplete={handleBootComplete} />;
  }

  if (screen === "splash") {
    return (
      <TitleSplash
        currentUser={user}
        onLoginSuccess={handleLoginSuccess}
        onOpenGallery={handleOpenGallery}
        initialLoginOpen={autoOpenLogin}
        onOpenHowTo={() => {
          // Can transition to hub or howto
          if (user) {
            setScreen("hub");
          } else {
            setAutoOpenLogin(true);
          }
        }}
      />
    );
  }

  return (
    <HomeHub
      user={user || createDefaultUser("68208307052", "นักศึกษา 7052")}
      onLogout={handleLogout}
      onSwitchAccount={handleSwitchAccount}
      onOpenGallery={handleOpenGallery}
    />
  );
}
