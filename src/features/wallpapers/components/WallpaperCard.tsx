import React, { useCallback } from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LQIPImage } from './LQIPImage';
import type { Wallpaper } from '../types';

interface Props {
  item: Wallpaper;
}

export const WallpaperCard: React.FC<Props> = React.memo(({ item }) => {
  const router = useRouter();
  const onPress = useCallback(() => {
    router.push(`/wallpaper/${item.id}`);
  }, [router, item.id]);

  const CARD_WIDTH = 180;
  const CARD_HEIGHT = 320;

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <LQIPImage
        thumb={item.image.thumb}
        full={item.image.preview}
        blurhash={item.image.blurhash}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        borderRadius={16}
      />
      <View style={styles.meta}>
        <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 8,
    marginVertical: 12,
  },
  meta: {
    marginTop: 8,
    width: 180,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default WallpaperCard;
