import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
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
          const isQuiz = route.name === 'quiz';

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={[
                styles.item,
                isQuiz && styles.quizItem
              ]}
            >
              {options.tabBarIcon
                ? options.tabBarIcon({ 
                    color: isQuiz ? '#FFF' : (isFocused ? colors.textPrimary : colors.textSecondary), 
                    size: 24, 
                    focused: isFocused 
                  })
                : null}
              {!isQuiz && (
                <Text style={[
                  styles.label,
                  { color: isFocused ? colors.textPrimary : colors.textSecondary }
                ]}>
                  {options.title || route.name}
                </Text>
              )}
              {isQuiz && (
                <Text style={[styles.label, { color: '#FFF' }]}>
                  Quiz
                </Text>
              )}
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
    left: 16,
    right: 16,
    bottom: 24,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E', // Darker background for floating navbar
    borderRadius: 32,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    ...shadows.lg,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    flex: 1,
  },
  quizItem: {
    backgroundColor: colors.accent,
    borderRadius: 24,
    height: 64,
    marginTop: -8, /* Slight lift for the highlighted button */
    paddingVertical: 8,
  },
  label: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500',
  },
});
