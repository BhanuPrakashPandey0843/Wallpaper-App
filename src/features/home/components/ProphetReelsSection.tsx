import React, { useCallback } from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { SectionHeader } from '../../../components/composites/SectionHeader';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import Text from '../../../components/ui/Text';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const REEL_WIDTH = SCREEN_WIDTH - 32;
const REEL_HEIGHT = 200; // Optimized height to allow ~3 items to fit better vertically

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
          <Image
            source={item.image}
            contentFit="cover"
            style={styles.image}
            transition={300}
          />
          <View style={styles.bulgeContainer}>
            <Svg
              width={REEL_WIDTH}
              height={30}
              viewBox={`0 0 ${REEL_WIDTH} 30`}
            >
              <Path
                d={`M0 0 Q${REEL_WIDTH / 2} 30 ${REEL_WIDTH} 0 L${REEL_WIDTH} 30 L0 30 Z`}
                fill={colors.background}
              />
            </Svg>
          </View>
          
          <View style={styles.playOverlay}>
            <View style={styles.playIconContainer}>
              <Ionicons name="play" size={32} color="#FFF" style={{ marginLeft: 4 }} />
            </View>
          </View>
        </View>
        <Text variant="sm" bold style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
      </Animated.View>
    </Pressable>
  );
});

const ProphetReelsSection: React.FC<Props> = ({ reels, onOpen, loading }) => {
  const router = useRouter();
  
  const renderItem = useCallback(({ item }: { item: Reel }) => (
    <ReelCard item={item} onPress={() => onOpen(item.id)} />
  ), [onOpen]);

  const keyExtractor = useCallback((item: Reel) => item.id, []);

  return (
    <View style={styles.container}>
      <SectionHeader title="Prophet Reels" />
      {loading ? (
        <View style={styles.content}>
          {Array.from({ length: 3 }).map((_, i) => (
            <View key={`reel-skeleton-${i}`} style={styles.skeleton} />
          ))}
        </View>
      ) : (
        <View style={styles.content}>
          <FlashList
            data={reels}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            numColumns={1}
            estimatedItemSize={REEL_HEIGHT + 40}
            contentContainerStyle={styles.listContent}
          />
          <Pressable style={styles.viewMoreButton} onPress={() => router.push('/(tabs)/library')}>
            <Text style={styles.viewMoreText}>View More</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  content: {
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 8,
  },
  cardContainer: {
    width: '100%',
    marginBottom: 24,
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
    backgroundColor: '#2C2C2C',
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  bulgeContainer: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 30,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  playIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  cardTitle: {
    marginTop: 10,
    color: '#FFFFFF',
    width: '100%',
    textAlign: 'center',
    fontSize: 15,
  },
  skeleton: {
    width: REEL_WIDTH,
    height: REEL_HEIGHT,
    marginBottom: 24,
    borderRadius: 24,
    backgroundColor: '#2C2C2C',
  },
  viewMoreButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#FF7D33',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  viewMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default React.memo(ProphetReelsSection);
