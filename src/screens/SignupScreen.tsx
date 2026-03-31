import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { colors } from "../theme/colors";
import { Pressable } from "react-native";
import { storage } from "../services/storage";
import { AUTH_STORAGE_KEY, AuthSession, defaultAuthSession } from "../features/auth/constants";

const pattern = require("../../assets/pattern.png");
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SignupScreen() {
  const onSignup = async () => {
    const current = (await storage.get<AuthSession>(AUTH_STORAGE_KEY)) ?? defaultAuthSession;
    await storage.set<AuthSession>(AUTH_STORAGE_KEY, {
      ...current,
      hasOnboarded: true,
      isAuthenticated: true,
    });
    router.replace("/(tabs)");
  };

  const router = useRouter();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
    translateY.value = withTiming(0, { duration: 500 });
  }, []);

  const screenAnim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const scale = useSharedValue(1);
  const buttonAnim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withTiming(0.97, { duration: 80 });
  };

  const onPressOut = () => {
    scale.value = withTiming(1, { duration: 80 });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.patternWrap}>
        <Image
          source={pattern}
          style={styles.pattern}
          resizeMode="repeat"
        />
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View style={[styles.container, screenAnim]}>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Start saving your favourite faith-filled wallpapers.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder="Full name"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="you@example.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              style={styles.input}
            />
          </View>

          <AnimatedPressable
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={onSignup}
            style={[styles.primaryButton, buttonAnim]}
          >
            <Text style={styles.primaryButtonText}>Sign Up</Text>
          </AnimatedPressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => router.push("/login")}>
              <Text style={styles.linkText}>Login</Text>
            </Pressable>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
  },
  patternWrap: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.05,
  },
  pattern: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#9CA3AF",
    marginBottom: 32,
  },
  form: {
    gap: 16,
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E5E7EB",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  linkText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "bold",
  },
});

