import { Stack } from 'expo-router';
import React from 'react';

export default function MyTasksLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'My Tasks',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
