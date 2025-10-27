import { Stack } from 'expo-router';
import React from 'react';

export default function CreateTaskLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Create New Task',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
