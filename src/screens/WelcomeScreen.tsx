import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

// Images
const bgImage = require("../../assets/baground.png");
const images = [
  require("../../assets/caroselone.png"),
  require("../../assets/caroseltwo.png"),
  require("../../assets/caroselthree.png"),
  require("../../assets/caroselfour.png"),
  require("../../assets/caroselfive.png"),
  require("../../assets/caroselsix.png"),
];

export default function WelcomeScreen() {
  const router = useRouter();

  const translateX1 = useSharedValue(0);
  const translateX2 = useSharedValue(0);
  const scaleAnim = useSharedValue(1);

  useEffect(() => {
    // Smooth cinematic movement
    translateX1.value = withRepeat(
      withTiming(-width, {
        duration: 14000,
        easing: Easing.linear,
      }),
      -1
    );

    translateX2.value = withRepeat(
      withTiming(width, {
        duration: 16000,
        easing: Easing.linear,
      }),
      -1
    );

    // subtle floating animation
    scaleAnim.value = withRepeat(
      withTiming(1.05, { duration: 3000 }),
      -1,
      true
    );
  }, []);

  const row1Style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX1.value }],
  }));

  const row2Style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX2.value }],
  }));

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      {/* BACKGROUND */}
      <Image source={bgImage} style={styles.bgImage} />

      {/* DARK + GRADIENT OVERLAY */}
      <View style={styles.overlay} />

      {/* MOVING CARDS */}
      <View style={styles.carouselContainer}>
        <Animated.View style={[styles.row, row1Style]}>
          {images.concat(images).map((img, i) => (
            <Animated.Image
              key={i}
              source={img}
              style={[styles.cardImage, floatingStyle]}
            />
          ))}
        </Animated.View>

        <Animated.View style={[styles.row, row2Style]}>
          {images.reverse().concat(images).map((img, i) => (
            <Animated.Image
              key={i}
              source={img}
              style={[styles.cardImage, floatingStyle]}
            />
          ))}
        </Animated.View>
      </View>

      {/* GLASS TEXT CARD */}
      <BlurView intensity={50} tint="dark" style={styles.glassCard}>
        <Text style={styles.title}>Faith Frames</Text>
        <Text style={styles.subtitle}>
          Experience faith in a modern, beautiful way
        </Text>
      </BlurView>

      {/* BUTTONS */}
      <View style={styles.buttonContainer}>
        <PremiumButton
          title="Create Account"
          primary
          onPress={() => router.push("/signup")}
        />
        <PremiumButton
          title="Login"
          onPress={() => router.push("/login")}
        />
      </View>
    </SafeAreaView>
  );
}

/* ================= PREMIUM BUTTON ================= */

function PremiumButton({ title, onPress, primary }) {
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[style]}>
      <Pressable
        onPressIn={() => (scale.value = withTiming(0.96))}
        onPressOut={() => (scale.value = withTiming(1))}
        onPress={onPress}
        style={[
          styles.button,
          primary ? styles.primaryButton : styles.secondaryButton,
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            primary ? styles.primaryText : styles.secondaryText,
          ]}
        >
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  bgImage: {
    ...StyleSheet.absoluteFillObject,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
  },

  carouselContainer: {
    marginTop: 80,
    gap: 25,
  },

  row: {
    flexDirection: "row",
  },

  cardImage: {
    width: 150,
    height: 200,
    marginHorizontal: 10,
    borderRadius: 20,
    resizeMode: "cover",
    opacity: 0.9,
  },

  glassCard: {
    marginTop: 40,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    overflow: "hidden",
  },

  title: {
    fontSize: 38,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 1,
  },

  subtitle: {
    fontSize: 15,
    color: "#ffb380",
    marginTop: 10,
    textAlign: "center",
  },

  buttonContainer: {
    marginTop: "auto",
    paddingHorizontal: 20,
    marginBottom: 40,
    gap: 16,
  },

  button: {
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  primaryButton: {
    backgroundColor: "#ff7217",
    shadowColor: "#ff7217",
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },

  secondaryButton: {
    borderWidth: 1.5,
    borderColor: "#ff7217",
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "700",
  },

  primaryText: {
    color: "#fff",
  },

  secondaryText: {
    color: "#ff7217",
  },
});