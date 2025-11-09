import { useQuery } from "@tanstack/react-query";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { TaskRequestsApi } from "../../api/task-requests/task-requests.api";
import { Sheet } from "../../components/Sheet";
import styles from "./task-requests-modal.styles";

type TaskRequestsModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function TaskRequestsModal({ visible, onClose }: TaskRequestsModalProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: TaskRequestsApi.getTaskRequests.key({ status: "ALL" }),
    queryFn: () => TaskRequestsApi.getTaskRequests.fn({ status: "ALL" }),
  });

  const taskRequests = data?.taskRequests || data?.data || [];

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#E30464" />
          <Text style={styles.loadingText}>Loading task requests...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <FontAwesome5 name="exclamation-circle" size={48} color="#EF4444" />
          <Text style={styles.errorText}>Failed to load task requests</Text>
        </View>
      );
    }

    if (taskRequests.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <FontAwesome5 name="inbox" size={48} color="#9CA3AF" />
          <Text style={styles.emptyText}>No task requests found</Text>
          <Text style={styles.emptySubtext}>Task requests will appear here when available</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={taskRequests}
        renderItem={({ item }) => (
          <View style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <Text style={styles.requestTitle} numberOfLines={2}>
                {item.taskTitle}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  item.status === "APPROVED" && styles.statusApproved,
                  item.status === "REJECTED" && styles.statusRejected,
                  item.status === "PENDING" && styles.statusPending,
                ]}
              >
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.requestMeta}>
              {item.usersCount} {item.usersCount === 1 ? "user" : "users"} •{" "}
              {new Date(item.createdAt * 1000).toLocaleDateString()}
            </Text>
            {!!item.externalIssueHtmlUrl && (
              <Pressable
                style={({ pressed }) => [styles.linkButton, pressed && styles.linkButtonPressed]}
              >
                <FontAwesome5 name="external-link-alt" size={14} color="#E30464" />
                <Text style={styles.linkText}>View Issue</Text>
              </Pressable>
            )}
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      heading="Task Requests"
      icon={<FontAwesome5 name="file-alt" size={20} color="#E30464" />}
      actionButtons={[]}
    >
      {renderContent()}
    </Sheet>
  );
}
