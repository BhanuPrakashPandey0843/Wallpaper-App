import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Text from '../../src/components/ui/Text';
import Button from '../../src/components/ui/Button';
import Card from '../../src/components/ui/Card';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

export default function DailyPrayerScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="xs" color="textSecondary">
        Daily Prayer
      </Text>
      <Card style={styles.card} elevated>
        <Text variant="md">
          Heavenly Father, thank You for this day. Fill my heart with peace, guide my words, and
          help me reflect Your love in everything I do. Amen.
        </Text>
      </Card>
      <Button variant="surface" title="Back to Library" onPress={() => router.back()} style={styles.mtLg} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  card: { marginTop: spacing.md, padding: spacing.lg },
  mtLg: { marginTop: spacing.lg },
});
