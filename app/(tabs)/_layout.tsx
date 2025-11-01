import { theme } from '@/constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.colors.primary[500],
        headerShown: false,
        tabBarStyle: route.name === 'index' ? { display: 'none' } : undefined,
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
          title: 'Home',
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

      {/* Tasks tab */}
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome
              name="tasks"
              size={28}
              color={color}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />

      {/* Manage tab */}
      <Tabs.Screen
        name="manage"
        options={{
          tabBarLabel: 'Manage',
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome
              name="cog"
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
          title: 'Profile',
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
        name="extension-requests"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="task-requests"
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
      <Tabs.Screen
        name="my-tasks"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="create-task"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
