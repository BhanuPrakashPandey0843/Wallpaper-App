import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface Props {
  thumb: string;
  full: string;
  blurhash?: string;
  width: number;
  height: number;
  borderRadius?: number;
}

export const LQIPImage: React.FC<Props> = React.memo(({ thumb, full, blurhash, width, height, borderRadius = 12 }) => {
  const opacity = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const onHighResLoad = () => {
    opacity.value = withTiming(1, { duration: 300 });
  };

  return (
    <View style={[styles.container, { width, height, borderRadius }]}>
      <Image
        style={[styles.absolute, { borderRadius }]}
        source={{ uri: thumb }}
        placeholder={blurhash}
        contentFit="cover"
        cachePolicy="memory-disk"
      />
      <Animated.View style={[styles.absolute, animatedStyle, { borderRadius }]}>
        <Image
          style={[StyleSheet.absoluteFill, { borderRadius }]}
          source={{ uri: full }}
          contentFit="cover"
          cachePolicy="memory-disk"
          onLoadEnd={onHighResLoad}
        />
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  absolute: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default LQIPImage;
