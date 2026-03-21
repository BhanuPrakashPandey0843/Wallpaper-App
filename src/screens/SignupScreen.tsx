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

const pattern = require("../../assets/pattern.png");
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SignupScreen() {
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
            onPress={() => router.replace("/(tabs)")}
            style={[styles.primaryButton, buttonAnim]}
          >
            <Text style={styles.primaryText}>SIGN UP</Text>
          </AnimatedPressable>

          <Pressable onPress={() => router.replace("/login")}>
            <Text style={styles.bottomText}>
              Already have an account?{" "}
              <Text style={styles.link}>Sign in</Text>
            </Text>
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FDF7ED",
  },
  patternWrap: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.06,
  },
  pattern: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1F2933",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280",
  },
  form: {
    marginTop: 28,
    gap: 16,
  },
  label: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 4,
  },
  input: {
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    color: "#111827",
  },
  primaryButton: {
    marginTop: 32,
    height: 54,
    borderRadius: 999,
    backgroundColor: colors.warning,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomText: {
    marginTop: 18,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 13,
  },
  link: {
    color: colors.warning,
    fontWeight: "600",
  },
});

