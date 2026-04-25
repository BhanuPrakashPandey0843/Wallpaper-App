import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

export const AnimatedBackground: React.FC = () => {
  const lightPos = useSharedValue(0);
  const rayRotation = useSharedValue(0);
  const pattern = require('../../../assets/pattern.png');

  useEffect(() => {
    lightPos.value = withRepeat(
      withTiming(1, { duration: 18000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    
    rayRotation.value = withRepeat(
      withTiming(1, { duration: 30000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const lightStyle = useAnimatedStyle(() => {
    const translateX = interpolate(lightPos.value, [0, 1], [-width * 0.3, width * 0.3]);
    const translateY = interpolate(lightPos.value, [0, 1], [-height * 0.15, height * 0.15]);
    return {
      transform: [{ translateX }, { translateY }],
    };
  });

  const rayStyle = useAnimatedStyle(() => {
    const rotate = interpolate(rayRotation.value, [0, 1], [0, 360]);
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Base deep background */}
      <View style={styles.base} />
      
      {/* Texture Overlay (Grain) */}
      <View style={styles.patternWrap}>
        <Image source={pattern} style={styles.pattern} resizeMode="repeat" />
      </View>

      {/* Subtle Light Rays */}
      <Animated.View style={[styles.rayContainer, rayStyle]}>
        <LinearGradient
          colors={['rgba(255, 140, 70, 0.03)', 'transparent']}
          style={styles.ray}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>
      
      {/* Ambient light bleed */}
      <Animated.View style={[styles.lightContainer, lightStyle]}>
        <LinearGradient
          colors={['rgba(255, 140, 70, 0.04)', 'transparent']}
          style={styles.light}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Elegant Vignette */}
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.4)']}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#050506',
  },
  base: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    opacity: 0.95,
  },
  patternWrap: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.04,
  },
  pattern: {
    width: '100%',
    height: '100%',
  },
  rayContainer: {
    position: 'absolute',
    top: -height * 0.5,
    left: -width * 0.5,
    width: width * 2,
    height: height * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ray: {
    width: 2,
    height: '100%',
    opacity: 0.5,
  },
  lightContainer: {
    position: 'absolute',
    top: -height * 0.3,
    left: -width * 0.3,
    width: width * 1.6,
    height: width * 1.6,
  },
  light: {
    flex: 1,
    borderRadius: width,
  },
});

export default AnimatedBackground;