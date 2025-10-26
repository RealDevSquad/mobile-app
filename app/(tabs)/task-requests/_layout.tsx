import { Stack } from "expo-router";
import React from "react";

export default function TaskRequestsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Task Requests",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Task Request Details",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
