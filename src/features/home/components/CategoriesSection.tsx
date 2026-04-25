import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons, Entypo, FontAwesome5 } from '@expo/vector-icons';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import Text from '../../../components/ui/Text';

const CATEGORIES = [
  {
    id: 'prophets',
    title: 'Prophets',
    iconName: 'star-four-points',
    IconLib: MaterialCommunityIcons,
    accent: '#FF7D33',
  },
  {
    id: 'sahaba',
    title: 'Sahaba',
    iconName: 'tree',
    IconLib: Entypo,
    accent: '#FFA64D',
  },
  {
    id: 'morals',
    title: 'Morals',
    iconName: 'hand-holding-heart',
    IconLib: FontAwesome5,
    accent: '#FFB450',
  },
  {
    id: 'heroes',
    title: 'Heroes',
    iconName: 'user-ninja',
    IconLib: FontAwesome5,
    accent: '#FF8C46',
  },
];

const CategoryItem = React.memo(({ item, onSelect, index }: { item: any, onSelect: (id: string) => void, index: number }) => {
  const scale = useSharedValue(1);
  const Icon = item.IconLib;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.92, { damping: 15 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 15 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 600, delay: 500 + index * 100 }}
      style={styles.itemWrapper}
    >
      <Pressable 
        onPress={() => onSelect(item.id)} 
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.pressable}
      >
        <Animated.View style={[styles.itemContent, animatedStyle]}>
          <View style={[styles.iconContainer, { backgroundColor: `${item.accent}15` }]}>
            <Icon name={item.iconName as any} size={22} color={item.accent} />
          </View>
          <Text variant="xs" bold style={styles.title}>{item.title}</Text>
        </Animated.View>
      </Pressable>
    </MotiView>
  );
});

interface Props {
  onSelect: (id: string) => void;
}

export const CategoriesSection: React.FC<Props> = ({ onSelect }) => {
  return (
    <View style={styles.container}>
      {CATEGORIES.map((cat, i) => (
        <CategoryItem key={cat.id} item={cat} onSelect={onSelect} index={i} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  itemWrapper: {
    alignItems: 'center',
  },
  pressable: {
    alignItems: 'center',
  },
  itemContent: {
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  title: {
    color: '#FFF',
    fontSize: 11,
    opacity: 0.7,
    letterSpacing: 0.5,
  },
});
