import React, { useCallback } from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { SectionHeader } from '../../../components/composites/SectionHeader';
import { WavyCurve } from '../../../components/ui/WavyCurve';
import { spacing } from '../../../theme/spacing';
import { colors } from '../../../theme/colors';
import Text from '../../../components/ui/Text';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.75;
const CARD_HEIGHT = 200;

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

const ProphetCard = React.memo(({ item, onPress }: { item: Story; onPress: () => void }) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.96, { damping: 10 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 10 });
  };

  return (
    <Pressable 
      onPress={onPress} 
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.cardContainer}
    >
      <Animated.View style={[styles.cardContent, animatedStyle]}>
        <View style={styles.imageWrapper}>
          <Image
            source={item.image}
            contentFit="cover"
            style={styles.image}
            transition={300}
          />
          <WavyCurve width={CARD_WIDTH} height={40} color={colors.background} />
        </View>
        <Text variant="sm" bold style={styles.cardTitle}>
          {item.title}
        </Text>
      </Animated.View>
    </Pressable>
  );
});

export const ProphetStoriesSection: React.FC<Props> = React.memo(({ stories, onOpen, loading }) => {
  const renderItem = useCallback(({ item }: { item: Story }) => {
    return <ProphetCard item={item} onPress={() => onOpen(item.id)} />;
  }, [onOpen]);

  const keyExtractor = useCallback((item: Story) => item.id, []);

  return (
    <View style={styles.container}>
      <SectionHeader title="Prophet Stories" />
      {loading ? (
        <View style={styles.content}>
          {Array.from({ length: 3 }).map((_, i) => (
            <View key={`ps-skeleton-${i}`} style={styles.skeleton} />
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
          snapToInterval={CARD_WIDTH + spacing.md}
          decelerationRate="fast"
          snapToAlignment="start"
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  content: {
    paddingHorizontal: spacing.md,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: spacing.md,
  },
  cardContent: {
    width: '100%',
  },
  imageWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: colors.surfaceElevated,
    position: 'relative',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
  cardTitle: {
    marginTop: 10,
    color: colors.textPrimary,
    paddingHorizontal: 4,
  },
  skeleton: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: spacing.md,
    borderRadius: 32,
    backgroundColor: colors.surfaceElevated,
  },
});

export default ProphetStoriesSection;
