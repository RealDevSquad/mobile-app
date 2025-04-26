import { Stack } from 'expo-router';
import React from 'react';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }}/>
      <Stack.Screen name="details" options={{ headerShown: false }}/>
    </Stack>
  );
}