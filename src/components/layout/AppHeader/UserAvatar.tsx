import React, { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Avatar from '../../ui/Avatar';
import * as Haptics from 'expo-haptics';

interface Props {
  uri?: string;
  premium?: boolean;
  onPress: () => void;
}

export const UserAvatar: React.FC<Props> = React.memo(({ uri, premium, onPress }) => {
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
    <Pressable accessibilityRole="button" onPress={handlePress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={animatedStyle}>
        <Avatar uri={uri} size={36} glow={premium} />
      </Animated.View>
    </Pressable>
  );
});

export default UserAvatar;
