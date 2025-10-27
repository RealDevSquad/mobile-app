import { theme } from '@/constants/theme';
import { User, useAuthStore } from '@/store/authStore';
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

// Auth context types
interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Loading screen component
const AuthLoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={theme.colors.primary[500]} />
  </View>
);

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Get auth state and actions from Zustand store
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue: AuthContextType = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      isLoading: false, // Always false after initialization
      login,
      logout,
      setToken,
      setUser,
    }),
    [token, user, isAuthenticated, login, logout, setToken, setUser]
  );

  // Initialize auth store on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Trigger Zustand persist hydration
        await useAuthStore.persist.rehydrate();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize auth store:', error);
        setInitError(error instanceof Error ? error.message : 'Unknown error');
        setIsInitialized(true); // Still allow app to render
      }
    };

    initializeAuth();
  }, []);

  // Show loading screen during initialization
  if (!isInitialized) {
    return <AuthLoadingScreen />;
  }

  // Show error state if initialization failed
  if (initError) {
    console.warn('Auth initialization failed:', initError);
    // Continue with app - auth will work but may need re-authentication
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// Convenience hooks for specific auth values
export const useAuthToken = (): string | null => {
  const { token } = useAuth();
  return token;
};

export const useAuthUser = (): User | null => {
  const { user } = useAuth();
  return user;
};

export const useIsAuthenticated = (): boolean => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.secondary,
  },
});
