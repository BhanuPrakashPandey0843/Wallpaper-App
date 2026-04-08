import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../src/store/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="welcome" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="reel/[id]" />
          <Stack.Screen name="wallpaper/[id]" />
          <Stack.Screen name="library/daily-verse" />
          <Stack.Screen name="library/daily-prayer" />
          <Stack.Screen name="library/wallpapers" />
          <Stack.Screen name="library/prayer-room" />
          <Stack.Screen name="settings/account" />
          <Stack.Screen name="settings/wallpaper-settings" />
          <Stack.Screen name="settings/downloads" />
          <Stack.Screen name="settings/favorites" />
          <Stack.Screen name="settings/privacy-policy" />
          <Stack.Screen name="settings/terms" />
        </Stack>
      </Provider>
    </GestureHandlerRootView>
  );
}
