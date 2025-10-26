import { TaskRequestsApi } from "@/api/task-requests/task-requests.api";
import useCheckUserSession from "@/hooks/getUserToken";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import moment from "moment";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TaskRequestDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useCheckUserSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const {
    data: taskRequest,
    isLoading: loading,
    isError,
    error,
  } = useQuery({
    queryKey: TaskRequestsApi.getTaskRequestById.key(id || ""),
    queryFn: () =>
      TaskRequestsApi.getTaskRequestById.fn(id!, token || undefined),
    enabled: !!token && !!id,
  });

  const approveMutation = useMutation({
    mutationFn: ({
      taskRequestId,
      userId,
    }: {
      taskRequestId: string;
      userId: string;
    }) =>
      TaskRequestsApi.approveTaskRequest.fn(
        { taskRequestId, userId },
        token || undefined
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TaskRequestsApi.getTaskRequestById.key(id || ""),
      });
      queryClient.invalidateQueries({
        queryKey: TaskRequestsApi.getTaskRequests.key({ status: "PENDING" }),
      });
      Alert.alert("Success", "Task request approved successfully");
      router.back();
    },
    onError: (error) => {
      Alert.alert("Error", "Failed to approve task request");
      console.error("Error approving task request:", error);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({
      taskRequestId,
      userId,
      reason,
    }: {
      taskRequestId: string;
      userId: string;
      reason?: string;
    }) =>
      TaskRequestsApi.rejectTaskRequest.fn(
        { taskRequestId, userId, reason },
        token || undefined
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TaskRequestsApi.getTaskRequestById.key(id || ""),
      });
      queryClient.invalidateQueries({
        queryKey: TaskRequestsApi.getTaskRequests.key({ status: "PENDING" }),
      });
      Alert.alert("Success", "Task request rejected successfully");
      router.back();
    },
    onError: (error) => {
      Alert.alert("Error", "Failed to reject task request");
      console.error("Error rejecting task request:", error);
    },
  });

  const handleApprove = () => {
    if (!taskRequest) return;

    Alert.alert(
      "Approve Task Request",
      "Are you sure you want to approve this task request?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: () => {
            setIsApproving(true);
            approveMutation.mutate(
              {
                taskRequestId: taskRequest.id,
                userId: taskRequest.requestors?.[0] || "",
              },
              {
                onSettled: () => setIsApproving(false),
              }
            );
          },
        },
      ]
    );
  };

  const handleReject = () => {
    if (!taskRequest) return;

    Alert.alert(
      "Reject Task Request",
      "Are you sure you want to reject this task request?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: () => {
            setIsRejecting(true);
            rejectMutation.mutate(
              {
                taskRequestId: taskRequest.id,
                userId: taskRequest.requestors?.[0] || "",
              },
              {
                onSettled: () => setIsRejecting(false),
              }
            );
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    return moment(timestamp).format("MMM DD, YYYY");
  };

  const formatDateTime = (timestamp: number) => {
    return moment(timestamp).format("MMM DD, YYYY [at] h:mm A");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "#FFA500";
      case "APPROVED":
        return "#4CAF50";
      case "REJECTED":
        return "#F44336";
      default:
        return "#666";
    }
  };

  const handleExternalLink = (url: string) => {
    Linking.openURL(url);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading task request...</Text>
      </SafeAreaView>
    );
  }

  if (isError || !taskRequest) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error?.message || "Task request not found"}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            queryClient.invalidateQueries({
              queryKey: TaskRequestsApi.getTaskRequestById.key(id || ""),
            });
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const primaryUser = taskRequest.users[0];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{taskRequest.taskTitle}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(taskRequest.status) },
              ]}
            >
              <Text style={styles.statusText}>{taskRequest.status}</Text>
            </View>
          </View>

          {/* Request Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Request Details</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Requested by:</Text>
              <Text style={styles.value}>
                {primaryUser.first_name && primaryUser.last_name
                  ? `${primaryUser.first_name} ${primaryUser.last_name}`
                  : primaryUser.username}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Request Type:</Text>
              <Text style={styles.value}>{taskRequest.requestType}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Created:</Text>
              <Text style={styles.value}>
                {formatDateTime(taskRequest.createdAt)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Last Modified:</Text>
              <Text style={styles.value}>
                {formatDateTime(taskRequest.lastModifiedAt)}
              </Text>
            </View>
          </View>

          {/* Timeline */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Proposed Timeline</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Start Date:</Text>
              <Text style={styles.value}>
                {formatDate(primaryUser.proposedStartDate)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Deadline:</Text>
              <Text style={styles.value}>
                {formatDate(primaryUser.proposedDeadline)}
              </Text>
            </View>
          </View>

          {/* Description */}
          {primaryUser.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{primaryUser.description}</Text>
            </View>
          )}

          {/* External Links */}
          {taskRequest.externalIssueUrl && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>External Links</Text>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() =>
                  handleExternalLink(taskRequest.externalIssueUrl!)
                }
              >
                <Text style={styles.linkText}>View GitHub Issue</Text>
              </TouchableOpacity>
              {taskRequest.externalIssueHtmlUrl && (
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() =>
                    handleExternalLink(taskRequest.externalIssueHtmlUrl!)
                  }
                >
                  <Text style={styles.linkText}>View on GitHub</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Additional Users */}
          {taskRequest.usersCount > 1 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Additional Users ({taskRequest.usersCount - 1})
              </Text>
              {taskRequest.users.slice(1).map((user) => (
                <View key={user.userId} style={styles.userItem}>
                  <Text style={styles.userName}>
                    {user.first_name && user.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : user.username}
                  </Text>
                  <Text style={styles.userStatus}>{user.status}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {taskRequest.status === "PENDING" && (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.rejectButton,
              (isApproving || isRejecting) && styles.disabledButton,
            ]}
            onPress={handleReject}
            disabled={isApproving || isRejecting}
          >
            {isRejecting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.actionButtonText}>Reject</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.approveButton,
              (isApproving || isRejecting) && styles.disabledButton,
            ]}
            onPress={handleApprove}
            disabled={isApproving || isRejecting}
          >
            {isApproving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.actionButtonText}>Approve</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#F44336",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#1D1283",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 80,
    alignItems: "center",
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: "#333",
    flex: 2,
    textAlign: "right",
  },
  description: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  linkButton: {
    backgroundColor: "#1D1283",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  linkText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  userName: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  userStatus: {
    fontSize: 12,
    color: "#666",
    textTransform: "uppercase",
  },
  actionContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  approveButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#F44336",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.6,
  },
});
