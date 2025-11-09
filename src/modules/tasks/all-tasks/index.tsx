import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Text, View } from "react-native";
import { TasksApi } from "../../../api/tasks/tasks.api";
import { TaskCard, TaskCardSkeleton } from "../task-card";
import styles from "./all-tasks.styles";

const SKELETON_COUNT = 3;

export function AllTasks() {
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: TasksApi.getTasks.key({ dev: true }),
    queryFn: () => TasksApi.getTasks.fn({ dev: true }),
  });

  if (isLoading) {
    return (
      <View style={styles.listContainer}>
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <TaskCardSkeleton key={`skeleton-${index}`} />
        ))}
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load tasks</Text>
      </View>
    );
  }

  const tasks = data?.tasks || data?.data || [];

  if (tasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No tasks found</Text>
        <Text style={styles.emptySubtext}>Tasks will appear here when available</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tasks}
      renderItem={({ item }) => (
        <TaskCard task={item} onPress={() => router.push(`/task/${item.id}`)} />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}
