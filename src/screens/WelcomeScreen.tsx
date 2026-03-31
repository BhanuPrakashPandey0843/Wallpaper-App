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
import { WavyCurve } from "../components/ui/WavyCurve";
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
    title: "Discover Stories from\nIslamic History",
    subtitle:
      "Listen to beautiful audio stories of Prophets and\nheroes of Islam — made just for kids!",
    image: require("../../assets/ooks.png"),
  },
  {
    id: "2",
    title: "Fun Quizzes After\nEach Story",
    subtitle:
      "Unlock quizzes after listening to test what you’ve\nlearned — smart and exciting!",
    image: require("../../assets/reelo.png"),
  },
  {
    id: "3",
    title: "Grow with\nRewards",
    subtitle:
      "Earn points, unlock badges, and see your learning\njourney come to life!",
    image: require("../../assets/pattern.png"),
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

  const handleContinue = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      persistOnboardedAndNavigate();
    }
  };

  const handleSkip = () => {
    persistOnboardedAndNavigate();
  };

  const renderItem = ({ item, index }: { item: typeof SLIDES[0]; index: number }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.image} resizeMode="cover" />
          <WavyCurve width={width} color="#FFFBF0" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* SKIP BUTTON */}
      {currentIndex < SLIDES.length - 1 && (
        <Pressable onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      )}

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

        {/* CONTINUE BUTTON */}
        <Pressable onPress={handleContinue} style={styles.continueButton}>
          <Text style={styles.continueButtonText}>
            {currentIndex === SLIDES.length - 1 ? "Get Started" : "Continue"}
          </Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBF0", // Warm cream/beige from image
  },
  skipButton: {
    position: "absolute",
    top: 60,
    right: 24,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  slide: {
    width: width,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  imageContainer: {
    width: width,
    height: height * 0.55,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    paddingHorizontal: 40,
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A1A",
    textAlign: "center",
    lineHeight: 36,
    marginBottom: 16,
    fontFamily: "Poppins_700Bold", // Use Poppins if available, otherwise default
  },
  subtitle: {
    fontSize: 15,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
    fontFamily: "Poppins_400Regular",
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  dot: {
    height: 6,
    width: 10,
    borderRadius: 3,
    backgroundColor: "#F4792B", // Active color from image
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#F4792B",
  },
  continueButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#F4792B",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#F4792B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
