import React, { useCallback } from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { SectionHeader } from '../../../components/composites/SectionHeader';
import { spacing } from '../../../theme/spacing';
import { colors } from '../../../theme/colors';
import Text from '../../../components/ui/Text';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const REEL_WIDTH = 180; // Increased size
const REEL_HEIGHT = 320; // Increased size

interface Reel {
  id: string;
  title: string;
  image: any;
}

interface Props {
  reels: Reel[];
  onOpen: (id: string) => void;
  loading?: boolean;
}

const ReelCard = React.memo(({ item, onPress }: { item: Reel; onPress: () => void }) => {
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
          <View style={styles.topBulge} />
          
          <Image
            source={item.image}
            contentFit="cover"
            style={styles.image}
            transition={300}
          />
          
          <View style={styles.playOverlay}>
            <View style={styles.playIcon} />
          </View>
        </View>
        <Text variant="xs" bold style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
      </Animated.View>
    </Pressable>
  );
});

export const ProphetReelsSection: React.FC<Props> = React.memo(({ reels, onOpen, loading }) => {
  const renderItem = useCallback(({ item }: { item: Reel }) => {
    return <ReelCard item={item} onPress={() => onOpen(item.id)} />;
  }, [onOpen]);

  const keyExtractor = useCallback((item: Reel) => item.id, []);

  return (
    <View style={styles.container}>
      <SectionHeader title="Prophet Reels" />
      {loading ? (
        <View style={styles.content}>
          {Array.from({ length: 4 }).map((_, i) => (
            <View key={`reel-skeleton-${i}`} style={styles.skeleton} />
          ))}
        </View>
      ) : (
        <FlashList
          data={reels}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.content}
          estimatedItemSize={REEL_WIDTH}
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
    width: REEL_WIDTH,
    marginRight: spacing.md,
    alignItems: 'center',
  },
  cardContent: {
    width: '100%',
    alignItems: 'center',
  },
  imageWrapper: {
    width: REEL_WIDTH,
    height: REEL_HEIGHT,
    borderRadius: 24,
    backgroundColor: colors.surfaceElevated,
    position: 'relative',
    overflow: 'visible', // Allow bulge to show
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  topBulge: {
    position: 'absolute',
    top: -15, // Pushed slightly higher
    alignSelf: 'center',
    width: 80, // Wider bulge
    height: 40, // More prominent bulge
    borderRadius: 40,
    backgroundColor: '#1E1E1E', // Matches surface color
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  playIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  cardTitle: {
    marginTop: 8,
    color: colors.textSecondary,
    width: '100%',
    textAlign: 'center',
  },
  skeleton: {
    width: REEL_WIDTH,
    height: REEL_HEIGHT,
    marginRight: spacing.md,
    borderRadius: 24,
    backgroundColor: colors.surfaceElevated,
  },
});

export default ProphetReelsSection;
