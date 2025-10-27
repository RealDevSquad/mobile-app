import { Stack } from 'expo-router';
import React from 'react';

export default function ExtensionRequestsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Extension Requests',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
