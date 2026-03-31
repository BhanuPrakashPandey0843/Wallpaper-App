import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import { storage } from "../src/services/storage";
import { AUTH_STORAGE_KEY, AuthSession } from "../src/features/auth/constants";
import { colors } from "../src/theme/colors";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const bootstrap = async () => {
      const session = await storage.get<AuthSession>(AUTH_STORAGE_KEY);
      if (!session) {
        router.replace("/welcome");
        return;
      }
      if (session.isAuthenticated) {
        router.replace("/(tabs)");
        return;
      }
      if (session.hasOnboarded) {
        router.replace("/login");
        return;
      }
      router.replace("/welcome");
    };
    bootstrap();
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
      <ActivityIndicator size="small" color={colors.accent} />
    </View>
  );
}