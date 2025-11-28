import { AuthData } from '@/features/auth/types/auth.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from './data';

// Storage keys
const STORAGE_KEYS = {
  AUTH_DATA: '@parkeoya:auth_data',
  LEGACY_USER: '@parkeoya:current_user', // For backward compatibility
};

export const StorageService = {
  // Authentication Data (new API)
  async setAuthData(authData: AuthData): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_DATA, JSON.stringify(authData));
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw error;
    }
  },

  async getAuthData(): Promise<AuthData | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting auth data:', error);
      return null;
    }
  },

  async removeAuthData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_DATA);
    } catch (error) {
      console.error('Error removing auth data:', error);
    }
  },

  // Legacy User methods (for backward compatibility)
  async setCurrentUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LEGACY_USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.LEGACY_USER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async removeCurrentUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.LEGACY_USER);
    } catch (error) {
      console.error('Error removing user:', error);
    }
  },

  // Clear all storage
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_DATA,
        STORAGE_KEYS.LEGACY_USER,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
