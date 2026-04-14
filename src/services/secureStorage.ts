import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/**
 * Production-grade Storage Wrapper
 * Handles SecureStore with fallback to AsyncStorage if native modules are missing.
 * Prevents runtime crashes during Metro bundling or on unsupported environments.
 */

const isSecureStoreAvailable = async (): Promise<boolean> => {
  if (Platform.OS === 'web') return false;
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
};

export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      if (await isSecureStoreAvailable()) {
        await SecureStore.setItemAsync(key, value, {
          keychainAccessible: SecureStore.WHEN_UNLOCKED,
        });
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      if (__DEV__) {
        console.error(`Storage Error (setItem): ${key}`, error);
      }
      // Fallback to AsyncStorage if SecureStore fails at runtime
      await AsyncStorage.setItem(key, value);
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      if (await isSecureStoreAvailable()) {
        return await SecureStore.getItemAsync(key);
      }
      return await AsyncStorage.getItem(key);
    } catch (error) {
      if (__DEV__) {
        console.error(`Storage Error (getItem): ${key}`, error);
      }
      return await AsyncStorage.getItem(key);
    }
  },

  async deleteItem(key: string): Promise<void> {
    try {
      if (await isSecureStoreAvailable()) {
        await SecureStore.deleteItemAsync(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      if (__DEV__) {
        console.error(`Storage Error (deleteItem): ${key}`, error);
      }
      await AsyncStorage.removeItem(key);
    }
  },
};
