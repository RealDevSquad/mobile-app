import ErrorBoundary from '@/components/ErrorBoundary';
import { AuthProvider } from '@/contexts/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Export ErrorBoundary for catching errors from the layout tree.
export { ErrorBoundary } from 'expo-router';

// Set initial route for Expo Router
export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent splash screen from auto-hiding until fonts are loaded.
SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  // Load custom fonts
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    // Hide splash screen after fonts are loaded
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor="#ffffff" translucent={false} />
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
              <RootLayoutNav />
            </SafeAreaView>
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    // <ThemeProvider value={DefaultTheme}>
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* <Stack.Screen
        name="modal"
        options={{ presentation: "modal", headerShown: false }}
      /> */}
    </Stack>
    // </ThemeProvider>
  );
}
// Test comment
