import React, { useCallback } from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { SectionHeader } from '../../../components/composites/SectionHeader';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { colors } from '../../../theme/colors';
import Text from '../../../components/ui/Text';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.45;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

interface Story {
  id: string;
  title: string;
  image: any;
}

interface Props {
  stories: Story[];
  onOpen: (id: string) => void;
  loading?: boolean;
}

const ProphetCard = React.memo(({ item, onPress, index }: { item: Story; onPress: () => void; index: number }) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.96, { damping: 15 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <Pressable 
      onPress={onPress} 
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.cardContainer}
    >
      <Animated.View style={[styles.cardContent, animatedStyle]}>
        <Image
          source={item.image}
          contentFit="cover"
          style={styles.image}
          transition={400}
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={StyleSheet.absoluteFill}
        />

        <BlurView intensity={10} tint="dark" style={styles.textOverlay}>
          <Text variant="xs" bold style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
        </BlurView>

        <View style={styles.rimLight} />
      </Animated.View>
    </Pressable>
  );
});

export const ProphetStoriesSection: React.FC<Props> = React.memo(({ stories, onOpen, loading }) => {
  const renderItem = useCallback(({ item, index }: { item: Story, index: number }) => {
    return <ProphetCard item={item} onPress={() => onOpen(item.id)} index={index} />;
  }, [onOpen]);

  const keyExtractor = useCallback((item: Story) => item.id, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <SectionHeader title="Spiritual Stories" />
      </View>
      {loading ? (
        <View style={styles.content}>
          {Array.from({ length: 3 }).map((_, i) => (
            <View key={`ps-skeleton-${i}`} style={[styles.skeleton, { width: CARD_WIDTH, height: CARD_HEIGHT }]} />
          ))}
        </View>
      ) : (
        <FlashList
          data={stories}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.content}
          estimatedItemSize={CARD_WIDTH}
          decelerationRate="fast"
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  headerContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  content: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.md,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: spacing.md,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardContent: {
    flex: 1,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  textOverlay: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 12,
    letterSpacing: 0.2,
  },
  rimLight: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: radius.lg,
    pointerEvents: 'none',
  },
  skeleton: {
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: spacing.md,
  },
});
