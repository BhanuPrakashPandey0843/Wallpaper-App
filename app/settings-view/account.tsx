import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Card from '../../src/components/ui/Card';
import Text from '../../src/components/ui/Text';
import Button from '../../src/components/ui/Button';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

export default function AccountScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="xs" color="textSecondary">
        Account
      </Text>
      <Card style={styles.card} elevated>
        <Text variant="sm">Name: Faith Frames User</Text>
        <Text variant="sm" color="textSecondary" style={styles.mtSm}>
          Email: user@example.com
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
  mtSm: { marginTop: spacing.sm },
  mtLg: { marginTop: spacing.lg },
});
