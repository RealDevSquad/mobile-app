// import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import "react-native-reanimated";

// Export ErrorBoundary for catching errors from the layout tree.
export { ErrorBoundary } from "expo-router";

// Set initial route for Expo Router
export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent splash screen from auto-hiding until fonts are loaded.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Load custom fonts
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    // "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    // "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    // "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return <RootLayoutNav />;
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
