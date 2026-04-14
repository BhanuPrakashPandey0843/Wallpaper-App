import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Card from '../../src/components/ui/Card';
import Text from '../../src/components/ui/Text';
import Button from '../../src/components/ui/Button';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

export default function DownloadsScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="xs" color="textSecondary">
        Downloads
      </Text>
      <Card style={styles.card} elevated>
        <Text variant="sm" color="textSecondary">
          Downloaded wallpapers will appear here for offline use.
        </Text>
      </Card>
      <Button variant="surface" title="Back to Settings" onPress={() => router.back()} style={styles.mtLg} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  card: { marginTop: spacing.md, padding: spacing.lg },
  mtLg: { marginTop: spacing.lg },
});
