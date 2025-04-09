import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UserState {
  token: string | null;
  setToken: (token: string) => void;
}

const useUserStore = create<UserState>()(
  devtools((set) => ({
    token: null,
    setToken: async (token) => {
      await AsyncStorage.setItem('github_token', token); // Store token in AsyncStorage
      set({ token }); // Update Zustand state
    },
  }))
);

export default useUserStore;