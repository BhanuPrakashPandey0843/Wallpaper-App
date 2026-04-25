import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View, Platform } from 'react-native';
import { MotiView } from 'moti';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import Text from '../ui/Text';

export type CardVariant = 'verse' | 'prayer' | 'wisdom' | 'testimony';

interface LibraryCardProps {
  title: string;
  subtitle: string;
  description?: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  variant: CardVariant;
  onPress: () => void;
  delay?: number;
}

const VARIANT_CONFIG = {
  verse: { accentColor: '#FF7D33' },
  prayer: { accentColor: '#FFA64D' },
  wisdom: { accentColor: '#FFB450' },
  testimony: { accentColor: '#FF8C46' },
};

export const LibraryCard: React.FC<LibraryCardProps> = React.memo(
  ({ title, subtitle, description, icon: Icon, variant, onPress, delay = 0 }) => {
    const isPressed = useSharedValue(false);
    const config = VARIANT_CONFIG[variant];

    const handlePressIn = useCallback(() => {
      isPressed.value = true;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, []);

    const handlePressOut = useCallback(() => {
      isPressed.value = false;
    }, []);

    const containerAnimatedStyle = useAnimatedStyle(() => ({
      transform: [
        { scale: withSpring(isPressed.value ? 0.97 : 1, { damping: 20, stiffness: 300 }) },
      ],
    }));

    const contentAnimatedStyle = useAnimatedStyle(() => ({
      opacity: withSpring(isPressed.value ? 0.7 : 1),
      transform: [{ scale: withSpring(isPressed.value ? 0.98 : 1) }],
    }));

    return (
      <MotiView
        from={{ opacity: 0, translateY: 15, scale: 0.98 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{ type: 'timing', duration: 700, delay }}
        style={styles.wrapper}
      >
        <Animated.View style={[styles.container, containerAnimatedStyle]}>
          <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.pressable}
          >
            <BlurView intensity={10} tint="dark" style={styles.card}>
              <Animated.View style={[styles.content, contentAnimatedStyle]}>
                {/* Minimalist Icon with subtle glow */}
                <View style={styles.iconWrapper}>
                  <Icon size={24} color={config.accentColor} strokeWidth={1.5} />
                  <View style={[styles.iconRim, { borderColor: config.accentColor }]} />
                </View>

                {/* Typography Focus */}
                <View style={styles.textContainer}>
                  <Text variant="sm" bold style={styles.title}>
                    {title}
                  </Text>
                  <Text variant="xs" color="textSecondary" style={styles.subtitle}>
                    {subtitle.toUpperCase()}
                  </Text>
                  {description && (
                    <Text variant="xs" color="textSecondary" numberOfLines={2} style={styles.description}>
                      {description}
                    </Text>
                  )}
                </View>
              </Animated.View>

              {/* Rim Light Effect (Top & Left) */}
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.12)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.3, y: 0.3 }}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />

              {/* Ultra-thin elegant border */}
              <View style={styles.borderOverlay} />
            </BlurView>
          </Pressable>
        </Animated.View>
      </MotiView>
    );
  }
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    aspectRatio: 0.85,
    margin: spacing.sm,
  },
  container: {
    flex: 1,
  },
  pressable: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconRim: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    borderWidth: 1,
    opacity: 0.1,
  },
  textContainer: {
    gap: 4,
  },
  title: {
    letterSpacing: -0.1,
    color: '#FFFFFF',
    fontSize: 17,
  },
  subtitle: {
    opacity: 0.4,
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  description: {
    marginTop: 4,
    opacity: 0.3,
    lineHeight: 15,
    fontSize: 11,
  },
  borderOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: radius.xl,
    pointerEvents: 'none',
  },
});

export default LibraryCard;