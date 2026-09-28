"use client";

import React, { useState, useEffect } from "react";
import { BootScreen } from "@/components/splash/BootScreen";
import { TitleSplash } from "@/components/splash/TitleSplash";
import { HomeHub } from "@/components/hub/HomeHub";
import { StudentUser } from "@nucmed/shared";
import { createDefaultUser, getRememberedUser, logoutAccount } from "@/lib/user";
import { useRouter } from "next/navigation";

type ScreenState = "boot" | "splash" | "hub";

export default function HomePage() {
  const [screen, setScreen] = useState<ScreenState>("boot");
  const [user, setUser] = useState<StudentUser | null>(null);
  const router = useRouter();

  // Check saved session on mount
  useEffect(() => {
    try {
      const remembered = getRememberedUser();
      if (remembered) {
        setUser(remembered);
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const handleBootComplete = () => {
    // After boot completes, go to Title Splash
    setScreen("splash");
  };

  const handleLoginSuccess = (loggedInUser: StudentUser) => {
    setUser(loggedInUser);
    setScreen("hub");
  };

  const handleLogout = () => {
    logoutAccount();
    setUser(null);
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
        onOpenHowTo={() => {
          // Can transition to hub or howto
          if (user) {
            setScreen("hub");
          } else {
            alert("กรุณากด PLAY เพื่อกรอกรหัสนักศึกษาเข้าสู่สังเวียนการประลอง");
          }
        }}
      />
    );
  }

  return (
    <HomeHub
      user={user || createDefaultUser("68208307052", "นักศึกษา 7052")}
      onLogout={handleLogout}
      onOpenGallery={handleOpenGallery}
    />
  );
}
