import { secureStorage } from '@/utils/secureStorage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// User type definition
export interface User {
  id: string;
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  github_display_name?: string;
  github_id?: string;
  linkedin_id?: string;
  twitter_id?: string;
  instagram_id?: string;
  website?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  phone?: string;
  picture?: {
    url?: string;
    publicId?: string;
  };
  roles?: {
    member?: boolean;
    archived?: boolean;
    super_user?: boolean;
    app_owner?: boolean;
  };
  status?: string;
  created_at?: string;
  updated_at?: string;
}

// Auth state interface
interface AuthState {
  // State
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  initialize: () => Promise<void>;
  clearLoading: () => void;
}

// Custom storage adapter for Zustand persist
const secureStorageAdapter = {
  getItem: async (name: string): Promise<string | null> => {
    return await secureStorage.getItem(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await secureStorage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await secureStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: true,

      // Actions
      setToken: (token) => {
        set({
          token,
          isAuthenticated: !!token,
        });
      },

      setUser: (user) => {
        set({ user });
      },

      login: (token, user) => {
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      initialize: async () => {
        try {
          set({ isLoading: true });

          // Try to load token from secure storage
          const storedToken = await secureStorage.getItem('auth_token');

          if (storedToken) {
            set({
              token: storedToken,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Error initializing auth store:', error);
          set({
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      clearLoading: () => {
        set({ isLoading: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorageAdapter),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);

// Selector hooks for better performance
export const useAuthToken = () => useAuthStore((state) => state.token);
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthActions = () =>
  useAuthStore((state) => ({
    setToken: state.setToken,
    setUser: state.setUser,
    login: state.login,
    logout: state.logout,
    initialize: state.initialize,
    clearLoading: state.clearLoading,
  }));
