import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Search, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import Text from '../../../components/ui/Text';

interface HomeHeaderProps {
  onSearchPress?: () => void;
  onProfilePress?: () => void;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onSearchPress, onProfilePress }) => {
  const insets = useSafeAreaInsets();
  const greeting = getGreeting();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <MotiView
        from={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 800 }}
        style={styles.content}
      >
        <View>
          <Text variant="xs" color="textSecondary" style={styles.greetingText}>
            {greeting.toUpperCase()}
          </Text>
          <Text variant="xl" bold style={styles.title}>
            Faith <Text variant="xl" bold style={{ color: colors.accent }}>Frames</Text>
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable onPress={onSearchPress} style={styles.iconBtn}>
            <BlurView intensity={10} tint="light" style={styles.iconBlur}>
              <Search size={20} color="#FFF" strokeWidth={2} />
            </BlurView>
          </Pressable>
          <Pressable onPress={onProfilePress} style={styles.iconBtn}>
            <BlurView intensity={10} tint="light" style={styles.iconBlur}>
              <User size={20} color="#FFF" strokeWidth={2} />
            </BlurView>
          </Pressable>
        </View>
      </MotiView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingText: {
    letterSpacing: 2,
    fontSize: 10,
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
    color: '#FFF',
    letterSpacing: -0.5,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconBtn: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  iconBlur: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});
