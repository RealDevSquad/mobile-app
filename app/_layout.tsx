import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../src/contexts/AuthProvider";
import { QueryProvider } from "../src/contexts/QueryProvider";
import * as QuickActions from "expo-quick-actions";
import { useEffect } from "react";
import { Platform } from "react-native";
import { useQuickActionRouting } from "expo-quick-actions/router";

export default function RootLayout() {
  useQuickActionRouting();

  useEffect(() => {
    QuickActions.setItems([
      {
        title: "Create New Task",
        subtitle: "Request a new task",
        icon: Platform.select({ ios: "symbol:plus.circle", android: "add" }),
        id: "create-task",
        params: { href: "/(tabs)/explore?action=create-task" },
      },
      {
        title: "View your tasks",
        subtitle: "Check your assigned tasks",
        icon: Platform.select({ ios: "symbol:checklist", android: "task" }),
        id: "tasks",
        params: { href: "/(tabs)/tasks" },
      },
      {
        title: "View Extension requests",
        subtitle: "Check extension requests",
        icon: Platform.select({ ios: "symbol:puzzlepiece", android: "extension" }),
        id: "extension-requests",
        params: { href: "/(tabs)/extension-requests" },
      },
    ]);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryProvider>
          <AuthProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </AuthProvider>
        </QueryProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
