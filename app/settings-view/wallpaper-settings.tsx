import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import Card from '../../src/components/ui/Card';
import Text from '../../src/components/ui/Text';
import Button from '../../src/components/ui/Button';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

export default function WallpaperSettingsScreen() {
  const router = useRouter();
  const [autoRotate, setAutoRotate] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="xs" color="textSecondary">
        Wallpaper Settings
      </Text>
      <Card style={styles.card} elevated>
        <View style={styles.row}>
          <Text variant="sm">Auto-rotate wallpapers</Text>
          <Switch value={autoRotate} onValueChange={setAutoRotate} />
        </View>
      </Card>
      <Button variant="surface" title="Back to Settings" onPress={() => router.back()} style={styles.mtLg} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  card: { marginTop: spacing.md, padding: spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mtLg: { marginTop: spacing.lg },
});
