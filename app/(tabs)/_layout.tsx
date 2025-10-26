import colors from "@/constants/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

const colorScheme: "light" | "dark" = "light";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors[colorScheme].tint,
        headerShown: false,
        tabBarStyle: route.name === "index" ? { display: "none" } : undefined,
      })}
    >
      {/* index screen */}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
          headerShown: false,
        }}
      />

      {/* Home tab */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome
              name="home"
              size={28}
              color={color}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />

      {/* Extension Requests tab */}
      <Tabs.Screen
        name="extension-requests"
        options={{
          title: "ER",
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome
              name="file-text-o"
              size={28}
              color={color}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />

      {/* Notify tab */}
      <Tabs.Screen
        name="notify"
        options={{
          title: "Notify",
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome
              name="bell-o"
              size={28}
              color={color}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />

      {/* Profile tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome
              name="user"
              size={28}
              color={color}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />

      {/* Hidden screens - accessible via home screen navigation */}
      <Tabs.Screen
        name="task-requests"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
