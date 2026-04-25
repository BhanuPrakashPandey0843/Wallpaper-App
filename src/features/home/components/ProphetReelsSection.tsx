import React, { useCallback } from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Play } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { SectionHeader } from '../../../components/composites/SectionHeader';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import Text from '../../../components/ui/Text';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const REEL_WIDTH = SCREEN_WIDTH * 0.85;
const REEL_HEIGHT = 180;

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
    scale.value = withSpring(0.98, { damping: 15 });
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
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.overlay}>
          <BlurView intensity={20} tint="light" style={styles.playBtn}>
            <Play size={20} color="#FFF" fill="#FFF" />
          </BlurView>
          
          <View style={styles.textContainer}>
            <Text variant="sm" bold style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text variant="xs" style={styles.subtitle}>Watch Now</Text>
          </View>
        </View>

        <View style={styles.rimLight} />
      </Animated.View>
    </Pressable>
  );
});

export const ProphetReelsSection: React.FC<Props> = ({ reels, onOpen, loading }) => {
  const renderItem = useCallback(({ item }: { item: Reel }) => (
    <ReelCard item={item} onPress={() => onOpen(item.id)} />
  ), [onOpen]);

  const keyExtractor = useCallback((item: Reel) => item.id, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <SectionHeader title="Faith Reels" />
      </View>
      {loading ? (
        <View style={styles.content}>
          <View style={[styles.skeleton, { width: REEL_WIDTH, height: REEL_HEIGHT }]} />
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
          decelerationRate="fast"
        />
      )}
    </View>
  );
};

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
    width: REEL_WIDTH,
    height: REEL_HEIGHT,
    marginRight: spacing.md,
    borderRadius: radius.xl,
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
  overlay: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  rimLight: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: radius.xl,
    pointerEvents: 'none',
  },
  skeleton: {
    borderRadius: radius.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});

export default ProphetReelsSection;
