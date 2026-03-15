import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { Carousel } from "../components/Carousel";
import { colors } from "../theme/colors";

const pattern = require("../../assets/pattern.png");
const image1 = require("../../assets/caroselone.png");
const image2 = require("../../assets/caroseltwo.png");
const image3 = require("../../assets/caroselthree.png");

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function WelcomeScreen() {
  const { height } = useWindowDimensions();
  const router = useRouter();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
    translateY.value = withTiming(0, { duration: 600 });
  }, []);

  const screenAnim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const createButtonScale = () => {
    const scale = useSharedValue(1);
    const style = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));
    const handlers = {
      onPressIn: () => {
        scale.value = withTiming(0.97, { duration: 80 });
      },
      onPressOut: () => {
        scale.value = withTiming(1, { duration: 80 });
      },
    };
    return { style, handlers };
  };

  const primaryButton = createButtonScale();
  const secondaryButton = createButtonScale();

  const onSignUp = () => {
    router.push("/signup");
  };

  const onSignIn = () => {
    router.push("/login");
  };

  const topSectionHeight = height * 0.5;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.patternWrap}>
        <Image
          source={pattern}
          style={styles.pattern}
          resizeMode="repeat"
        />
      </View>

      <Animated.View style={[styles.container, screenAnim]}>
        <View style={[styles.topSection, { height: topSectionHeight }]}>
          <Carousel images={[image1, image2, image3]} />
        </View>

        <View style={styles.textSection}>
          <Text style={styles.title}>Faith Frames</Text>
          <Text style={styles.subtitleEmphasis}>Faith in Every Frame</Text>
          <Text style={styles.subtitle}>
            Discover beautiful Christian wallpapers and inspiring Bible verses
            for your phone.
          </Text>
        </View>

        <View style={styles.footer}>
          <AnimatedPressable
            {...primaryButton.handlers}
            style={[styles.primaryButton, primaryButton.style]}
            onPress={onSignUp}
          >
            <Text style={styles.primaryText}>SIGN UP</Text>
          </AnimatedPressable>

          <AnimatedPressable
            {...secondaryButton.handlers}
            style={[styles.secondaryButton, secondaryButton.style]}
            onPress={onSignIn}
          >
            <Text style={styles.secondaryText}>SIGN IN</Text>
          </AnimatedPressable>
        </View>
      </Animated.View>
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
    paddingBottom: 24,
  },
  topSection: {
    justifyContent: "flex-start",
    paddingTop: 12,
  },
  textSection: {
    marginTop: 28,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2933",
    textAlign: "center",
  },
  subtitleEmphasis: {
    marginTop: 6,
    fontSize: 16,
    color: colors.warning,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  footer: {
    marginTop: "auto",
    gap: 12,
  },
  primaryButton: {
    height: 56,
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
  secondaryButton: {
    height: 56,
    borderRadius: 999,
    borderWidth: 1.4,
    borderColor: colors.warning,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  secondaryText: {
    color: colors.warning,
    fontSize: 16,
    fontWeight: "600",
  },
});

