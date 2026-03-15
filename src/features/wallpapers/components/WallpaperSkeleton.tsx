import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  width: number;
  height: number;
  borderRadius?: number;
}

export const WallpaperSkeleton: React.FC<Props> = React.memo(({ width, height, borderRadius = 12 }) => {
  return (
    <View style={[styles.container, { width, height, borderRadius }]}>
      <MotiView
        style={styles.shimmer}
        from={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{
          type: 'timing',
          duration: 1000,
          loop: true,
        }}
      >
        <LinearGradient
          colors={['#1F2937', '#374151', '#1F2937']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, { borderRadius }]}
        />
      </MotiView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111827',
    overflow: 'hidden',
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default WallpaperSkeleton;
