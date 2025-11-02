import { secureStorage } from '@/utils/storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// User type definition
export type User = {
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
};

// Auth state type
export type AuthState = {
  // State
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
};

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
    (set) => ({
      // Initial state
      token: null,
      user: null,
      isAuthenticated: false,

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
        });
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
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

// Selector hooks for better performance (deprecated - use AuthProvider context instead)
export const useAuthToken = () => useAuthStore((state) => state.token);
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthActions = () =>
  useAuthStore((state) => ({
    setToken: state.setToken,
    setUser: state.setUser,
    login: state.login,
    logout: state.logout,
  }));
