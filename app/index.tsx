import React, { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Immediately go to the welcome screen; native splash is handled by app.json
    router.replace("/welcome");
  }, []);

  return <View style={{ flex: 1 }} />;
}