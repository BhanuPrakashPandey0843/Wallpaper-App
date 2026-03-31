import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import Card from '../../src/components/ui/Card';
import Text from '../../src/components/ui/Text';
import Button from '../../src/components/ui/Button';

export default function WallpaperDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text variant="xs" color="textSecondary">
        Wallpaper Detail
      </Text>
      <Card style={styles.card} elevated>
        <Text variant="lg" bold>
          Wallpaper #{id}
        </Text>
        <Text variant="sm" color="textSecondary" style={styles.mtSm}>
          High quality Christian wallpaper preview and actions will appear here.
        </Text>
      </Card>
      <Button variant="surface" title="Back" onPress={() => router.back()} style={styles.mtLg} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  card: {
    marginTop: spacing.md,
    padding: spacing.lg,
  },
  mtSm: {
    marginTop: spacing.sm,
  },
  mtLg: {
    marginTop: spacing.lg,
  },
});
