import React, { useCallback } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons, Entypo, FontAwesome5 } from '@expo/vector-icons';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const CATEGORIES = [
  {
    id: 'prophets',
    title: 'Prophets',
    color: '#B8F28C',
    iconName: 'star-eight-points',
    IconLib: MaterialCommunityIcons,
    iconColor: '#4A7C2C',
    iconSize: 26,
  },
  {
    id: 'sahaba',
    title: 'Sahaba',
    color: '#8BE3B0',
    iconName: 'tree',
    IconLib: Entypo,
    iconColor: '#2D6A4F',
    iconSize: 24,
  },
  {
    id: 'morals',
    title: 'Morals',
    color: '#F5A58D',
    iconName: 'hand-holding-heart',
    IconLib: FontAwesome5,
    iconColor: '#A65D45',
    iconSize: 20,
  },
  {
    id: 'heroes',
    title: 'Heroes',
    color: '#B8B6F5',
    iconName: 'user-ninja',
    IconLib: FontAwesome5,
    iconColor: '#483D8B',
    iconSize: 20,
  },
];

// Moving CategoryItem to a separate component for cleaner state management
const CategoryItem = React.memo(({ item, onSelect, index }: { item: any, onSelect: (id: string) => void, index: number }) => {
  const scale = useSharedValue(1);
  const Icon = item.IconLib;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.92, { damping: 10 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 10 });
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: 'timing',
        duration: 500,
        delay: index * 80,
      }}
    >
      <Pressable 
        onPress={() => onSelect(item.id)} 
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.categoryItem}
      >
        <Animated.View style={[styles.itemContent, animatedStyle]}>
          <View style={styles.iconContainer}>
            <Icon name={item.iconName as any} size={item.iconSize} color={item.iconColor} />
          </View>

          <View style={styles.shapeWrapper}>
            <View style={styles.uDip} />
            <View style={[styles.semiCircle, { backgroundColor: item.color }]}>
              <Text style={styles.title}>{item.title}</Text>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </MotiView>
  );
});

export const CategoriesSection: React.FC<Props> = React.memo(({ onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Story Categories</Text>

      <View style={styles.row}>
        {CATEGORIES.map((item, index) => (
          <CategoryItem 
            key={item.id} 
            item={item} 
            onSelect={onSelect} 
            index={index} 
          />
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F0F0F',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EAEAEA',
    marginBottom: 24,
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  categoryItem: {
    width: 78,
  },
  itemContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -16,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  shapeWrapper: {
    width: 78,
    height: 60,
    alignItems: 'center',
  },
  semiCircle: {
    width: 78,
    height: 60,
    borderRadius: 28,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  uDip: {
    position: 'absolute',
    top: -7,
    width: 28,
    height: 14,
    borderRadius: 14,
    backgroundColor: '#0F0F0F',
    zIndex: 5,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D2D2D',
    textAlign: 'center',
  },
});

export default CategoriesSection;
