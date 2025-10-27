import EncryptedStorage from 'react-native-encrypted-storage';

export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await EncryptedStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error storing secure item with key "${key}":`, error);
      throw new Error(`Failed to store secure data: ${error}`);
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      return await EncryptedStorage.getItem(key);
    } catch (error) {
      console.error(`Error retrieving secure item with key "${key}":`, error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await EncryptedStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing secure item with key "${key}":`, error);
      throw new Error(`Failed to remove secure data: ${error}`);
    }
  },

  async clear(): Promise<void> {
    try {
      await EncryptedStorage.clear();
    } catch (error) {
      console.error('Error clearing secure storage:', error);
      throw new Error(`Failed to clear secure storage: ${error}`);
    }
  },
};

export const SECURE_STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_CREDENTIALS: 'user_credentials',
} as const;

export type SecureStorageKey = keyof typeof SECURE_STORAGE_KEYS;
