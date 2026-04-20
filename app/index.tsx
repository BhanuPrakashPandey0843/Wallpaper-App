import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#F4792B" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF9F2", // Warm peach background
  },
});
