import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking, Share, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { shadows } from '../../src/theme/shadows';
import Text from '../../src/components/ui/Text';
import { AUTH_STORAGE_KEY, defaultAuthSession } from '../../src/features/auth/constants';
import { storage } from '../../src/services/storage';

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

  const onContactUs = async () => {
    const mailto = 'mailto:support@faithframes.app?subject=Faith%20Frames%20Support';
    const canOpen = await Linking.canOpenURL(mailto);
    if (canOpen) {
      await Linking.openURL(mailto);
    } else {
      Alert.alert('Contact', 'Email app is not available on this emulator.');
    }
  };

  const onRateApp = async () => {
    const url = 'https://example.com/faith-frames-rate';
    await Linking.openURL(url);
  };

  const onShareApp = async () => {
    await Share.share({
      message: 'Faith Frames - Christian wallpapers, Bible, and daily quiz. https://example.com/faith-frames',
    });
  };

  const onLogout = async () => {
    await storage.set(AUTH_STORAGE_KEY, defaultAuthSession);
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text variant="xs" color="textSecondary">
          Account
        </Text>
        <View style={styles.card}>
          <SettingItem label="Account" onPress={() => router.push('/settings/account')} />
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="xs" color="textSecondary">
          Personalization
        </Text>
        <View style={styles.card}>
          <SettingItem label="Wallpaper Settings" onPress={() => router.push('/settings/wallpaper-settings')} />
          <SettingItem label="Downloads" onPress={() => router.push('/settings/downloads')} />
          <SettingItem label="Favorites" onPress={() => router.push('/settings/favorites')} />
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
          <SettingItem label="Privacy Policy" onPress={() => router.push('/settings/privacy-policy')} />
          <SettingItem label="Terms & Conditions" onPress={() => router.push('/settings/terms')} />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.card}>
          <SettingItem label="Logout" isDestructive onPress={onLogout} />
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
    padding: spacing.lg,
    paddingBottom: 120,
  },
  section: {
    marginBottom: spacing.lg,
  },
  card: {
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.xs,
    ...shadows.sm,
  },
  itemTouchable: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  item: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 0,
  },
});