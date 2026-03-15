import React from 'react';
import { View, StyleSheet, Image as RNImage } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { colors } from '../../theme/colors';

interface Props {
  uri?: string;
  size?: number;
  glow?: boolean;
}

export const Avatar: React.FC<Props> = React.memo(({ uri, size = 32, glow }) => {
  const ringSize = size + 6;
  return (
    <View style={{ marginLeft: spacing.sm }}>
      {glow ? (
        <LinearGradient
          colors={[colors.goldStart, colors.goldEnd]}
          style={{ width: ringSize, height: ringSize, borderRadius: ringSize / 2, alignItems: 'center', justifyContent: 'center' }}
        >
          <View style={[styles.root, { width: size, height: size, borderRadius: size / 2 }]}>
            {uri ? <RNImage source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} /> : null}
          </View>
        </LinearGradient>
      ) : (
        <View style={[styles.root, { width: size, height: size, borderRadius: size / 2 }]}>
          {uri ? <RNImage source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} /> : null}
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    borderRadius: radius.pill,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderTranslucent,
  },
});

export default Avatar;
