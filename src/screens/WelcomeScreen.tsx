import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  Pressable,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  interpolateColor,
  SharedValue,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { storage } from "../services/storage";
import { AUTH_STORAGE_KEY, AuthSession, defaultAuthSession } from "../features/auth/constants";

const { width, height } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    title: "Daily Inspiration\nin Your Pocket",
    subtitle:
      "Receive a fresh Bible verse every day to start\nyour morning with peace and faith.",
    image: require("../../assets/caroscrone.png"),
  },
  {
    id: "2",
    title: "Test Your\nBible Knowledge",
    subtitle:
      "Engage with interactive quizzes designed to\nstrengthen your understanding of Scripture.",
    image: require("../../assets/caroscrtwo.png"),
  },
  {
    id: "3",
    title: "Beautiful\nFaith Wallpapers",
    subtitle:
      "Personalize your device with a curated collection\nof high-quality Christian wallpapers.",
    image: require("../../assets/caroscrthr.png"),
  },
];

const PaginationDot = ({ 
  index, 
  scrollX 
}: { 
  index: number; 
  scrollX: SharedValue<number>; 
}) => {
  const dotStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const dotWidth = interpolate(
      scrollX.value,
      inputRange,
      [10, 24, 10],
      Extrapolation.CLAMP
    );
    return {
      width: dotWidth,
      backgroundColor: interpolateColor(
        scrollX.value,
        inputRange,
        ["#E0E0E0", "#F4792B", "#E0E0E0"]
      ),
    };
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        dotStyle,
      ]}
    />
  );
};

export default function WelcomeScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const persistOnboardedAndNavigate = async () => {
    const current = (await storage.get<AuthSession>(AUTH_STORAGE_KEY)) ?? defaultAuthSession;
    await storage.set<AuthSession>(AUTH_STORAGE_KEY, {
      ...current,
      hasOnboarded: true,
    });
    router.push("/signup");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  const renderItem = ({ item, index }: { item: typeof SLIDES[0]; index: number }) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.carouselImage} resizeMode="cover" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* CAROUSEL */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
      />

      {/* BOTTOM CONTROLS */}
      <SafeAreaView edges={["bottom"]} style={styles.bottomContainer}>
        {/* PAGINATION DOTS */}
        <View style={styles.paginationContainer}>
          {SLIDES.map((_, index) => (
            <PaginationDot key={index} index={index} scrollX={scrollX} />
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <Pressable onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
          <Pressable onPress={handleSignup} style={styles.signupButton}>
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark background matching app theme
  },
  slide: {
    width: width,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: "center",
    backgroundColor: "#121212",
  },
  paginationContainer: {
    flexDirection: "row",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "#F4792B",
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: "#F4792B",
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "flex-end",
    width: "100%",
    gap: 12,
  },
  button: {
    width: "100%",
    height: 56,
    backgroundColor: "#F4792B",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#F4792B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  signupButton: {
    width: "100%",
    height: 56,
    backgroundColor: "transparent",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#F4792B",
  },
  signupButtonText: {
    color: "#F4792B",
    fontSize: 18,
    fontWeight: "600",
  },
});
