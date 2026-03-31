import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { colors } from '../../theme/colors';
import { WavyCurve } from '../ui/WavyCurve';
import Text from '../ui/Text';
import * as Haptics from 'expo-haptics';

interface Props {
  title: string;
  image: any;
  onPress: () => void;
  width: number;
  height: number;
  loading?: boolean;
}

export const StoryCard: React.FC<Props> = React.memo(({ title, image, onPress, width, height, loading }) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const onPressIn = () => {
    scale.value = withSpring(0.96, { damping: 15 });
  };
  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePress = useCallback(onPress, [onPress]);

  return (
    <Pressable onPress={handlePress} onPressIn={onPressIn} onPressOut={onPressOut} style={styles.root}>
      <Animated.View style={[animatedStyle]}>
        <View style={[styles.imageWrap, { width, height, borderRadius: 24 }]}>
          <Image
            source={image}
            contentFit="cover"
            cachePolicy="memory-disk"
            style={{ width, height, borderRadius: 24 }}
          />
          <WavyCurve width={width} height={30} color={colors.background} />
        </View>
        <Text variant="xs" bold style={styles.cardTitle} numberOfLines={2}>
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  root: {
    marginRight: spacing.md,
    width: 160,
  },
  imageWrap: {
    overflow: 'hidden',
    backgroundColor: colors.surfaceElevated,
    marginBottom: spacing.xs,
  },
  cardTitle: {
    color: colors.textPrimary,
    marginTop: 4,
  },
});

export default StoryCard;
