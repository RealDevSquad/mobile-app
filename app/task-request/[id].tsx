import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { TaskRequestDetailsModule } from "../../src/modules/task-request-details";

export default function TaskRequestDetailsScreen() {
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
      <TaskRequestDetailsModule taskRequestId={id} />
    </>
  );
}

