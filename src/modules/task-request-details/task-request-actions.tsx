import { useMutation, useQueryClient } from "@tanstack/react-query";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { TaskRequestsApi } from "../../api/task-requests/task-requests.api";
import { TaskRequestDTO } from "../../api/task-requests/task-request.dto";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { ConfirmationModal } from "./confirmation-modal";
import styles from "./task-request-actions.styles";

type TaskRequestActionsProps = {
  taskRequest: TaskRequestDTO;
};

export function TaskRequestActions({ taskRequest }: TaskRequestActionsProps) {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<"approve" | "reject" | null>(null);

  const isSuperUser = user?.roles?.super_user === true;
  const isPending = taskRequest.status === "PENDING";
  const showActions = isSuperUser && isPending;

  const updateStatusMutation = useMutation({
    mutationFn: ({ action, userId }: { action: "approve" | "reject"; userId?: string }) =>
      TaskRequestsApi.updateTaskRequestStatus.fn({
        taskRequestId: taskRequest.id,
        userId: userId || "",
        action,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["TaskRequestsApi.getTaskRequests"],
      });
      queryClient.invalidateQueries({
        queryKey: TaskRequestsApi.getTaskRequestById.key(taskRequest.id),
      });
      setPendingAction(null);
      setShowApproveModal(false);
      setShowRejectModal(false);
      Alert.alert(
        "Success",
        `Task request ${variables.action === "approve" ? "approved" : "rejected"} successfully`
      );
    },
    onError: (error: any) => {
      setPendingAction(null);
      Alert.alert("Error", error?.message || "Failed to update task request status");
    },
  });

  const handleApproveClick = () => {
    setShowApproveModal(true);
  };

  const handleRejectClick = () => {
    setShowRejectModal(true);
  };

  const handleApproveConfirm = () => {
    if (!user?.id) {
      Alert.alert("Error", "User ID not found");
      return;
    }
    setPendingAction("approve");
    updateStatusMutation.mutate({ action: "approve", userId: user.id });
  };

  const handleRejectConfirm = () => {
    setPendingAction("reject");
    updateStatusMutation.mutate({ action: "reject" });
  };

  if (!showActions) {
    return null;
  }

  const isRejectPending = pendingAction === "reject" && updateStatusMutation.isPending;
  const isApprovePending = pendingAction === "approve" && updateStatusMutation.isPending;

  return (
    <>
      <View style={styles.actionsContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            styles.rejectButton,
            pressed && styles.actionButtonPressed,
            (updateStatusMutation.isPending || showRejectModal) && styles.actionButtonDisabled,
          ]}
          onPress={handleRejectClick}
          disabled={updateStatusMutation.isPending}
        >
          {isRejectPending ? (
            <ActivityIndicator size="small" color="#E30464" />
          ) : (
            <>
              <FontAwesome5 name="times" size={14} color="#E30464" />
              <Text style={styles.rejectButtonText}>Reject</Text>
            </>
          )}
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            styles.approveButton,
            pressed && styles.actionButtonPressed,
            (updateStatusMutation.isPending || showApproveModal) && styles.actionButtonDisabled,
          ]}
          onPress={handleApproveClick}
          disabled={updateStatusMutation.isPending}
        >
          {isApprovePending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <FontAwesome5 name="check" size={14} color="#FFFFFF" />
              <Text style={styles.approveButtonText}>Approve</Text>
            </>
          )}
        </Pressable>
      </View>

      <ConfirmationModal
        visible={showApproveModal}
        onClose={() => {
          if (!updateStatusMutation.isPending) {
            setShowApproveModal(false);
          }
        }}
        onConfirm={handleApproveConfirm}
        title="Approve Task Request"
        message="Are you sure you want to approve this task request?"
        confirmLabel="Approve"
        confirmVariant="approve"
        isLoading={updateStatusMutation.isPending && pendingAction === "approve"}
      />

      <ConfirmationModal
        visible={showRejectModal}
        onClose={() => {
          if (!updateStatusMutation.isPending) {
            setShowRejectModal(false);
          }
        }}
        onConfirm={handleRejectConfirm}
        title="Reject Task Request"
        message="Are you sure you want to reject this task request?"
        confirmLabel="Reject"
        confirmVariant="reject"
        isLoading={updateStatusMutation.isPending && pendingAction === "reject"}
      />
    </>
  );
}
