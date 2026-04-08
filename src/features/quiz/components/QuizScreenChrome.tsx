import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Share2 } from 'lucide-react-native';
import Text from '../../../components/ui/Text';
import { quizTheme } from '../theme';

interface Props {
  title: string;
  onBack?: () => void;
  onShare?: () => void;
  showShare?: boolean;
}

export const QuizScreenChrome = React.memo(function QuizScreenChrome({
  title,
  onBack,
  onShare,
  showShare = true,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingTop: Math.max(insets.top, 12) }]}>
      <Pressable
        onPress={onBack}
        style={styles.circleBtn}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={10}
      >
        <ChevronLeft size={22} color={quizTheme.textMuted} strokeWidth={2.2} />
      </Pressable>
      <Text variant="lg" bold style={styles.title}>
        {title}
      </Text>
      {showShare && onShare ? (
        <Pressable
          onPress={onShare}
          style={styles.circleBtn}
          accessibilityRole="button"
          accessibilityLabel="Share"
          hitSlop={10}
        >
          <Share2 size={20} color={quizTheme.textMuted} strokeWidth={2.2} />
        </Pressable>
      ) : (
        <View style={styles.circleBtnPlaceholder} />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: quizTheme.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBtnPlaceholder: {
    width: 44,
    height: 44,
  },
});
