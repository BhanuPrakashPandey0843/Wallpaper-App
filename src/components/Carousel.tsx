import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type CarouselProps = {
  images: number[];
  autoPlayIntervalMs?: number;
};

export const Carousel: React.FC<CarouselProps> = ({
  images,
  autoPlayIntervalMs = 3500,
}) => {
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<number>>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!images.length) return;

    const id = setInterval(() => {
      const next = (activeIndex + 1) % images.length;
      listRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveIndex(next);
    }, autoPlayIntervalMs);

    return () => clearInterval(id);
  }, [activeIndex, images.length, autoPlayIntervalMs]);

  useEffect(() => {
    progress.value = withTiming(activeIndex, { duration: 350 });
  }, [activeIndex]);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <View style={[styles.container, { width: width * 0.9 }]}>
      <FlatList
        ref={listRef}
        data={images}
        keyExtractor={(_, idx) => String(idx)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: width * 0.9 }]}>
            <Image source={item} style={styles.image} resizeMode="cover" />
          </View>
        )}
      />

      <View style={styles.dotsRow}>
        {images.map((_, index) => {
          const animatedDotStyle = useAnimatedStyle(() => {
            const isActive = Math.round(progress.value) === index;
            return {
              width: withTiming(isActive ? 18 : 8, { duration: 200 }),
              opacity: withTiming(isActive ? 1 : 0.4, { duration: 200 }),
            };
          });

          return (
            <Animated.View
              key={index}
              style={[styles.dot, animatedDotStyle]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 10,
    alignSelf: "center",
  },
  slide: {
    height: 260,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "#F59E0B",
  },
});

