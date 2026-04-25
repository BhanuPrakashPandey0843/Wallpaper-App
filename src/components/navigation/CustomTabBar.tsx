import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Pressable, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
  interpolate,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';

const { width } = Dimensions.get('window');
const DOCK_WIDTH = width * 0.92;
const TAB_INNER_PADDING = 6;

interface Props {
  state: any;
  descriptors: any;
  navigation: any;
}

export default React.memo(function CustomTabBar({ state, descriptors, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const totalTabs = state.routes.length;
  const tabWidth = (DOCK_WIDTH - TAB_INNER_PADDING * 2) / totalTabs;
  
  const activeIndex = state.index;
  const translateX = useSharedValue(activeIndex * tabWidth);
  const scaleX = useSharedValue(1);

  useEffect(() => {
    // Liquid stretch effect during transition
    scaleX.value = withSequence(
      withTiming(1.2, { duration: 150 }),
      withSpring(1, { damping: 15, stiffness: 200 })
    );
    
    translateX.value = withSpring(activeIndex * tabWidth, {
      damping: 18,
      stiffness: 120,
      mass: 0.8,
    });
  }, [activeIndex, tabWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scaleX: scaleX.value }
    ],
  }));

  return (
    <View style={[styles.wrapper, { bottom: Math.max(insets.bottom, 20) }]}>
      <View style={styles.dockContainer}>
        <BlurView intensity={Platform.OS === 'ios' ? 45 : 100} tint="dark" style={styles.blurDock}>
          {/* Active Liquid Indicator */}
          <Animated.View style={[styles.indicator, { width: tabWidth }, indicatorStyle]} />

          <View style={styles.tabsRow}>
            {state.routes.map((route: any, index: number) => {
              const { options } = descriptors[route.key];
              const isFocused = state.index === index;
              const isQuiz = route.name === 'quiz';

              const onPress = () => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!isFocused && !event.defaultPrevented) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  navigation.navigate(route.name);
                }
              };

              return (
                <Pressable
                  key={route.key}
                  onPress={onPress}
                  style={styles.tabItem}
                >
                  <TabIcon 
                    isFocused={isFocused} 
                    isQuiz={isQuiz} 
                    options={options} 
                  />
                </Pressable>
              );
            })}
          </View>

          {/* Premium Rim Light Border */}
          <View style={styles.rimBorder} />
        </BlurView>
      </View>
    </View>
  );
});

function TabIcon({ isFocused, isQuiz, options }: any) {
  const scale = useSharedValue(isFocused ? 1 : 0.8);
  const translateY = useSharedValue(isFocused ? 0 : 0);
  const activeColor = isQuiz ? colors.accent : '#FFFFFF';

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.15 : 0.9, { damping: 12 });
    translateY.value = withSpring(isFocused ? -2 : 0, { damping: 12 });
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ],
    opacity: withTiming(isFocused ? 1 : 0.35, { duration: 200 }),
  }));

  return (
    <Animated.View style={[styles.iconWrapper, animatedStyle]}>
      {options.tabBarIcon ? (
        options.tabBarIcon({ 
          color: isFocused ? activeColor : '#FFFFFF', 
          size: 24, 
          focused: isFocused 
        })
      ) : null}
      {isFocused && !isQuiz && <View style={styles.activeDot} />}
      {isQuiz && isFocused && <View style={[styles.quizGlow, { backgroundColor: colors.accent }]} />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  dockContainer: {
    width: DOCK_WIDTH,
    borderRadius: 35,
    backgroundColor: 'rgba(10, 10, 12, 0.4)',
    ...shadows.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  blurDock: {
    paddingHorizontal: TAB_INNER_PADDING,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 2,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  indicator: {
    position: 'absolute',
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    left: TAB_INNER_PADDING,
    zIndex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    position: 'absolute',
    bottom: -10,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    opacity: 0.8,
  },
  quizGlow: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    opacity: 0.15,
    zIndex: -1,
  },
  rimBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    pointerEvents: 'none',
  },
});
