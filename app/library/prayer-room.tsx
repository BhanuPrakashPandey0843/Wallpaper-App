import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import Text from '../../src/components/ui/Text';
import Button from '../../src/components/ui/Button';
import Card from '../../src/components/ui/Card';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

export default function PrayerRoomScreen() {
  const router = useRouter();
  const [note, setNote] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="xs" color="textSecondary">
        Prayer Room
      </Text>
      <Card style={styles.card} elevated>
        <Text variant="sm" color="textSecondary">
          Write your prayer note and spend a quiet minute with God.
        </Text>
        <TextInput
          style={styles.input}
          multiline
          value={note}
          onChangeText={setNote}
          placeholder="Lord, today I pray for..."
          placeholderTextColor={colors.textSecondary}
        />
      </Card>
      <Button variant="surface" title="Back to Library" onPress={() => router.back()} style={styles.mtLg} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  card: { marginTop: spacing.md, padding: spacing.lg },
  input: {
    minHeight: 140,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderTranslucent,
    color: colors.textPrimary,
    marginTop: spacing.md,
    padding: spacing.md,
    textAlignVertical: 'top',
  },
  mtLg: { marginTop: spacing.lg },
});
