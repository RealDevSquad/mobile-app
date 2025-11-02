import { theme } from '@/constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)',
        headerShown: false,
        tabBarStyle:
          route.name === 'index'
            ? { display: 'none' }
            : {
                backgroundColor: theme.colors.primary[500],
                borderTopWidth: 0,
                paddingTop: theme.spacing.sm,
                height: Platform.OS === 'ios' ? 76 : 64,
                elevation: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                borderTopLeftRadius: theme.radius['xl'],
                borderTopRightRadius: theme.radius['xl'],
              },
        tabBarLabelStyle: {
          fontSize: theme.typography.fontSize.xs,
          fontFamily: theme.typography.fontFamily.medium,
          fontWeight: theme.typography.fontWeight.medium,
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome name="home" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome name="tasks" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="extension-requests"
        options={{
          title: 'ER',
          tabBarLabel: 'ER',
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome name="file-text-o" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="task-requests"
        options={{
          title: 'TCR',
          tabBarLabel: 'TCR',
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome name="list-alt" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="create-task"
        options={{
          title: 'New Task',
          tabBarLabel: 'New Task',
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome name="plus-circle" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
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
    </Tabs>
  );
}
