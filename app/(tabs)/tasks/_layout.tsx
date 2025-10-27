import { Stack } from 'expo-router';
import React from 'react';

export default function TasksLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Tasks',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
