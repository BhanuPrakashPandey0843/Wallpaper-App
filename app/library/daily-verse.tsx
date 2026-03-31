import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import Text from '../../src/components/ui/Text';
import Button from '../../src/components/ui/Button';
import Card from '../../src/components/ui/Card';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

export default function DailyVerseScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="xs" color="textSecondary">
        Daily Verse
      </Text>
      <Card style={styles.card} elevated>
        <Text variant="xl" bold>
          Psalm 46:10
        </Text>
        <Text variant="md" style={styles.mtSm}>
          Be still, and know that I am God.
        </Text>
        <Text variant="sm" color="textSecondary" style={styles.mtMd}>
          Take a slow breath and rest in God presence for a moment of peace.
        </Text>
      </Card>
      <View style={styles.actions}>
        <Button variant="surface" title="Back to Library" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  card: { marginTop: spacing.md, padding: spacing.lg },
  actions: { marginTop: spacing.lg },
  mtSm: { marginTop: spacing.sm },
  mtMd: { marginTop: spacing.md },
});
