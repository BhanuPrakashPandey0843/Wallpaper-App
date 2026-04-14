import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Card from '../../src/components/ui/Card';
import Text from '../../src/components/ui/Text';
import Button from '../../src/components/ui/Button';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="xs" color="textSecondary">
        Privacy Policy
      </Text>
      <Card style={styles.card} elevated>
        <Text variant="sm" color="textSecondary">
          Faith Frames respects your privacy. We store only necessary app settings and preferences
          to improve your experience.
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
