import { View, Text } from 'react-native';
import { colors } from '../../theme/colors';

export default function QuizScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: colors.textPrimary }}>Quiz Screen</Text>
    </View>
  );
}