import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Quote } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import Text from '../../../components/ui/Text';

export const VerseOfTheDay: React.FC = () => {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 800, delay: 300 }}
      style={styles.container}
    >
      <BlurView intensity={15} tint="dark" style={styles.blur}>
        <LinearGradient
          colors={['rgba(255, 125, 51, 0.1)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        
        <View style={styles.header}>
          <View style={styles.tag}>
            <Text variant="xs" bold style={styles.tagText}>VERSE OF THE DAY</Text>
          </View>
          <Quote size={20} color={colors.accent} opacity={0.5} />
        </View>

        <Text variant="md" bold style={styles.verseText}>
          "For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you."
        </Text>

        <View style={styles.footer}>
          <Text variant="xs" color="textSecondary" style={styles.reference}>
            JEREMIAH 29:11
          </Text>
          <Pressable style={styles.shareBtn}>
            <Text variant="xs" bold style={{ color: colors.accent }}>SHARE</Text>
          </Pressable>
        </View>

        <View style={styles.rimLight} />
      </BlurView>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  blur: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  tag: {
    backgroundColor: 'rgba(255, 125, 51, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 9,
    letterSpacing: 1,
    color: colors.accent,
  },
  verseText: {
    color: '#FFF',
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reference: {
    letterSpacing: 1.5,
    fontSize: 10,
    fontWeight: '700',
    opacity: 0.6,
  },
  shareBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  rimLight: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: radius.xl,
    pointerEvents: 'none',
  },
});
