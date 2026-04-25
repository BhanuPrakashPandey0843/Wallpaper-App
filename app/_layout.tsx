import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { Provider, useSelector } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { 
  useFonts, 
  Poppins_400Regular, 
  Poppins_600SemiBold, 
  Poppins_700Bold 
} from '@expo-google-fonts/poppins';

import { store, RootState } from '../src/store/store';
import { useAuthInit } from '../src/features/auth/hooks/useAuthInit';

// Prevent the splash screen from auto-hiding before asset loading is complete.
void SplashScreen.preventAutoHideAsync().catch(() => {
  // no-op: splash may already be prevented
});

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
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationLayout />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
}

function NavigationLayout() {
  const { user, isInitialized } = useSelector((state: RootState) => state.auth);
  const segments = useSegments();
  const router = useRouter();

  // Handle Auth initialization (persistent login check)
  useAuthInit();

  useEffect(() => {
    if (!isInitialized) return;

    const authRoutes = ['login', 'signup', 'forgot-password', 'reset-password', 'otp-verification', 'success'];
    const inAuthGroup = authRoutes.includes(segments[0]);
    const isWelcome = segments[0] === 'welcome';

    // Auth Guard: Redirect based on authentication state
    if (!user && !inAuthGroup && !isWelcome) {
      router.replace('/welcome');
    } else if (user && (inAuthGroup || isWelcome)) {
      router.replace('/(tabs)');
    } else if (user && segments.length < 1) {
      // If we are at the root index and user is logged in
      router.replace('/(tabs)');
    } else if (!user && segments.length < 1) {
      // If we are at the root index and user is NOT logged in
      router.replace('/welcome');
    }

    // Hide splash screen once we've handled the initial redirect
    void SplashScreen.hideAsync().catch(() => {});
  }, [user, isInitialized, segments, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Root Entry */}
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome" />
      
      {/* Auth Flow */}
      <Stack.Screen name="login" options={{ animation: 'fade' }} />
      <Stack.Screen name="signup" options={{ animation: 'fade' }} />
      <Stack.Screen name="forgot-password" options={{ animation: 'fade' }} />
      <Stack.Screen name="reset-password" options={{ animation: 'fade' }} />
      <Stack.Screen name="otp-verification" options={{ animation: 'fade' }} />
      <Stack.Screen name="success" options={{ animation: 'fade' }} />
      
      {/* Main App */}
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      
      {/* Other Modals/Screens */}
      <Stack.Screen name="reel/[id]" />
      <Stack.Screen name="wallpaper/[id]" />
      
      {/* Direct Library Access (from Home) */}
      <Stack.Screen name="library/daily-verse" />
      <Stack.Screen name="library/daily-prayer" />
      <Stack.Screen name="library/wallpapers" />
      <Stack.Screen name="library/prayer-room" />
      
      {/* Settings Stack */}
      <Stack.Screen name="settings-view/account" />
      <Stack.Screen name="settings-view/wallpaper-settings" />
      <Stack.Screen name="settings-view/downloads" />
      <Stack.Screen name="settings-view/favorites" />
      <Stack.Screen name="settings-view/privacy-policy" />
      <Stack.Screen name="settings-view/terms" />
      <Stack.Screen name="settings-view/rate-app" />
      <Stack.Screen name="settings-view/share" />
      <Stack.Screen name="settings-view/contact-us" />
    </Stack>
  );
}
