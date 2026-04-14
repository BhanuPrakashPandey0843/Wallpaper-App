import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Text from '../src/components/ui/Text';
import { colors } from '../src/theme/colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text variant="xl" bold style={styles.title}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text color={colors.primary}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    marginBottom: 10,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
