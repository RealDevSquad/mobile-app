import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Text, View } from "react-native";
import { TaskRequestsApi } from "../../api/task-requests/task-requests.api";
import { TaskRequestCard, TaskRequestCardSkeleton } from "./task-request-card";
import styles from "./task-requests.styles";

const SKELETON_COUNT = 5;

type TaskRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

type TaskRequestsListProps = {
  status: TaskRequestStatus;
};

const getStatusLabel = (status: TaskRequestStatus): string => {
  switch (status) {
    case "PENDING":
      return "pending";
    case "APPROVED":
      return "approved";
    case "REJECTED":
      return "denied";
    default:
      return "pending";
  }
};

export function TaskRequestsList({ status }: TaskRequestsListProps) {
  const router = useRouter();
  const apiStatus = status === "REJECTED" ? "DENIED" : status;

  const { data, isLoading, error } = useQuery({
    queryKey: TaskRequestsApi.getTaskRequests.key({ status: apiStatus }),
    queryFn: () => TaskRequestsApi.getTaskRequests.fn({ status: apiStatus }),
  });

  if (isLoading) {
    return (
      <View style={styles.listContainer}>
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <TaskRequestCardSkeleton key={`skeleton-${status}-${index}`} />
        ))}
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load {getStatusLabel(status)} task requests</Text>
      </View>
    );
  }

  const taskRequests = data?.taskRequests || data?.data || [];

  if (taskRequests.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No {getStatusLabel(status)} task requests found</Text>
        <Text style={styles.emptySubtext}>
          {getStatusLabel(status).charAt(0).toUpperCase() + getStatusLabel(status).slice(1)} task
          requests will appear here when available
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={taskRequests}
      renderItem={({ item }) => (
        <TaskRequestCard
          taskRequest={item}
          onPress={() => router.push(`/task-request/${item.id}`)}
        />
      )}
      keyExtractor={(item) => item.id}
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}
