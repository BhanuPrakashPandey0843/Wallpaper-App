import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';

interface Props {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function CustomTabBar({ state, descriptors, navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };
          return (
            <TouchableOpacity key={route.key} accessibilityRole="button" accessibilityState={isFocused ? { selected: true } : {}} onPress={onPress} style={styles.item}>
              {options.tabBarIcon
                ? options.tabBarIcon({ color: isFocused ? colors.textPrimary : colors.textSecondary, size: 22, focused: isFocused })
                : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 16,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.glass,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassBorder,
    ...shadows.md,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
