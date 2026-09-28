"use client";

import React, { useState, useEffect } from "react";
import { BootScreen } from "@/components/splash/BootScreen";
import { TitleSplash } from "@/components/splash/TitleSplash";
import { HomeHub } from "@/components/hub/HomeHub";
import { StudentUser } from "@nucmed/shared";
import { createDefaultUser } from "@/lib/user";
import { useRouter } from "next/navigation";

type ScreenState = "boot" | "splash" | "hub";

export default function HomePage() {
  const [screen, setScreen] = useState<ScreenState>("boot");
  const [user, setUser] = useState<StudentUser | null>(null);
  const router = useRouter();

  // Check saved session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nucmed_current_user");
      if (saved) {
        setUser(JSON.parse(saved));
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
    localStorage.removeItem("nucmed_current_user");
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
      user={user || createDefaultUser("68208307001", "นักศึกษาใหม่")}
      onLogout={handleLogout}
      onOpenGallery={handleOpenGallery}
    />
  );
}
