import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { storage } from "../src/services/storage";
import { AUTH_STORAGE_KEY, AuthSession } from "../src/features/auth/constants";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const session = await storage.get<AuthSession>(AUTH_STORAGE_KEY);
        
        // Determinate target first
        let target: "/welcome" | "/(tabs)" | "/login" = "/welcome";
        if (session) {
          if (session.isAuthenticated) {
            target = "/(tabs)";
          } else if (session.hasOnboarded) {
            target = "/login";
          }
        }

        // Only hide splash AFTER redirect is triggered
        await SplashScreen.hideAsync();
        router.replace(target);
      } catch (e) {
        await SplashScreen.hideAsync();
        router.replace("/welcome");
      }
    };
    bootstrap();
  }, [router]);

  return null;
}