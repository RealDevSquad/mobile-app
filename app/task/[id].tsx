import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { TaskDetailsModule } from "../../src/modules/task-details";

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <TaskDetailsModule taskId={id} />
    </>
  );
}
