import AsyncStorage from '@react-native-async-storage/async-storage';
import Cookies from 'js-cookie';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import AuthApi from '../apiConstant/AuthApi'; // Import your API constants

interface UserState {
  token: string | null;
  userState: string | null; // "Active" or "OOO"
  setToken: (token: string) => void;
  fetchUserState: () => void;
}

const useUserStore = create<UserState>()(
  devtools((set) => ({
    token: null,
    userState: null,
    setToken: async (token) => {
      await AsyncStorage.setItem('github_token', token); // Store token in AsyncStorage
      Cookies.set('github_token', token); // Store token in cookies
      set({ token }); // Update Zustand state
    },
    fetchUserState: async () => {
      const token = Cookies.get('github_token'); // Get token from cookies
      console.log('Token from cookies:', token); // Debug token
      if (!token) {
        console.error('No token found in cookies');
        return;
      }
      if (token) {
        try {
          // Fetch user state from the backend
          const response = await fetch(AuthApi.USER_DETAIL, {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch user state');
          }

          const data = await response.json();
          const userState = data.status; // Assuming the backend returns a `status` field
          set({ userState }); // Update Zustand state
        } catch (error) {
          console.error('Error fetching user state:', error);
        }
      } else {
        console.error('No token found in cookies');
      }
    },
  }))
);

export default useUserStore;