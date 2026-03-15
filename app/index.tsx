import React, { useEffect, useMemo } from "react";
import {
  StyleSheet,
  View,
  Image,
  useWindowDimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import {
  useFonts,
  Poppins_300Light,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

export default function Splash() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_600SemiBold,
  });

  const pattern = require("../assets/pattern.png");

  const smallest = Math.min(width, height);

  /* Responsive scaling */

  const titleSize = useMemo(() => {
    if (smallest < 360) return 20;
    if (smallest < 420) return 24;
    if (smallest < 768) return 28;
    return 34;
  }, [smallest]);

  /* Logo animation */

  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(12);

  useEffect(() => {
    scale.value = withTiming(1, {
      duration: 900,
      easing: Easing.out(Easing.exp),
    });

    opacity.value = withTiming(1, {
      duration: 900,
    });

    taglineOpacity.value = withTiming(1, {
      duration: 800,
      delay: 500,
      easing: Easing.out(Easing.cubic),
    });

    taglineTranslateY.value = withTiming(0, {
      duration: 800,
      delay: 500,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const logoAnim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const taglineAnim = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslateY.value }],
  }));

  /* Navigation */

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/welcome");
    }, 2600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      {/* Pattern Background */}
      <View style={styles.patternWrap}>
        <Image
          source={pattern}
          style={styles.pattern}
          resizeMode="repeat"
        />
      </View>

      {/* Centered animated title */}
      <View style={styles.center}>
        <Animated.Text
          style={[
            styles.title,
            {
              fontSize: titleSize,
              fontFamily: fontsLoaded
                ? "Poppins_600SemiBold"
                : Platform.OS === "android"
                ? "sans-serif-medium"
                : undefined,
              transform: [{ scale: scale.value }],
              opacity: opacity.value,
            },
          ]}
        >
          Faith Frames
        </Animated.Text>

        <Animated.Text
          style={[
            styles.tagline,
            taglineAnim,
            {
              fontFamily: fontsLoaded
                ? "Poppins_300Light"
                : Platform.OS === "android"
                ? "sans-serif"
                : undefined,
            },
          ]}
        >
          Faith in Every Frame
        </Animated.Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FDF7ED",
    overflow: "hidden",
  },

  patternWrap: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.08,
  },

  pattern: {
    width: "100%",
    height: "100%",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: "#1F2933",
    letterSpacing: 3,
    textTransform: "uppercase",
  },

  tagline: {
    marginTop: 12,
    color: "rgba(55, 65, 81, 0.9)",
    fontSize: 14,
    letterSpacing: 0.5,
    textAlign: "center",
    paddingHorizontal: 24,
  },
});