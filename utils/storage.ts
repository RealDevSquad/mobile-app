import AsyncStorage from '@react-native-async-storage/async-storage';

export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error storing item with key "${key}":`, error);
      throw new Error(`Failed to store data: ${error}`);
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error retrieving item with key "${key}":`, error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item with key "${key}":`, error);
      throw new Error(`Failed to remove data: ${error}`);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw new Error(`Failed to clear storage: ${error}`);
    }
  },
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_CREDENTIALS: 'user_credentials',
} as const;

export type StorageKey = keyof typeof STORAGE_KEYS;
