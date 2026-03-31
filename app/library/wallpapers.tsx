import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Card from '../../src/components/ui/Card';
import Text from '../../src/components/ui/Text';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

const WALLPAPER_ITEMS = [
  { id: 'w1', title: 'Grace in the Morning' },
  { id: 'w2', title: 'Faith Over Fear' },
  { id: 'w3', title: 'Walk by Faith' },
];

export default function LibraryWallpapersScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="xs" color="textSecondary">
        Wallpapers
      </Text>
      <View style={styles.list}>
        {WALLPAPER_ITEMS.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => router.push(`/wallpaper/${item.id}`)}>
            <Card style={styles.item} elevated>
              <Text variant="sm" bold>
                {item.title}
              </Text>
              <Text variant="xs" color="textSecondary" style={styles.mtXs}>
                Open wallpaper details
              </Text>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  list: { marginTop: spacing.md, gap: spacing.sm },
  item: { padding: spacing.md },
  mtXs: { marginTop: spacing.xs },
});
