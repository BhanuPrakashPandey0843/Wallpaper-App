import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking, Share, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { shadows } from '../../src/theme/shadows';
import Text from '../../src/components/ui/Text';
import { useAuth } from '../../src/features/auth/hooks/useAuth';

interface SettingItemProps {
  label: string;
  onPress?: () => void;
  isDestructive?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({ label, onPress, isDestructive }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.itemTouchable}>
      <View style={styles.item}>
        <Text variant="sm" color={isDestructive ? 'accent' : 'textPrimary'}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  const onContactUs = () => {
    router.push('/settings-view/contact-us');
  };

  const onRateApp = () => {
    router.push('/settings-view/rate-app');
  };

  const onShareApp = () => {
    router.push('/settings-view/share');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/welcome');
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text variant="xs" color="textSecondary">
          Account
        </Text>
        <View style={styles.card}>
          <SettingItem label="Account" onPress={() => router.push('/settings-view/account')} />
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="xs" color="textSecondary">
          Personalization
        </Text>
        <View style={styles.card}>
          <SettingItem label="Wallpaper Settings" onPress={() => router.push('/settings-view/wallpaper-settings')} />
          <SettingItem label="Downloads" onPress={() => router.push('/settings-view/downloads')} />
          <SettingItem label="Favorites" onPress={() => router.push('/settings-view/favorites')} />
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="xs" color="textSecondary">
          Support
        </Text>
        <View style={styles.card}>
          <SettingItem label="Contact Us" onPress={onContactUs} />
          <SettingItem label="Rate App" onPress={onRateApp} />
          <SettingItem label="Share App" onPress={onShareApp} />
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="xs" color="textSecondary">
          Legal
        </Text>
        <View style={styles.card}>
          <SettingItem label="Privacy Policy" onPress={() => router.push('/settings-view/privacy-policy')} />
          <SettingItem label="Terms & Conditions" onPress={() => router.push('/settings-view/terms')} />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.card}>
          <SettingItem label="Logout" isDestructive onPress={handleLogout} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  itemTouchable: {
    width: '100%',
  },
  item: {
    minHeight: 52,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.surfaceElevated,
  },
});
