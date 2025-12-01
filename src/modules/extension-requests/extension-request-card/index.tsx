import { useMutation, useQueryClient } from "@tanstack/react-query";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ExtensionRequestDTO } from "../../../api/extension-requests/extension-request.dto";
import { ExtensionRequestsApi } from "../../../api/extension-requests/extension-requests.api";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { formatDateShort } from "../../../utils/common.utils";
import { StatusBadge } from "../status-badge";
import { ConfirmationModal } from "./confirmation-modal";
import styles from "./extension-request-card.styles";

type ExtensionRequestCardProps = {
  extensionRequest: ExtensionRequestDTO;
};

export function ExtensionRequestCard({ extensionRequest }: ExtensionRequestCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<"APPROVED" | "DENIED" | null>(null);
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  const isSuperUser = user?.roles?.super_user === true;
  const isPending = extensionRequest.status === "PENDING";
  const showActions = isSuperUser && isPending;

  const rotation = useSharedValue(0);

  const updateStatusMutation = useMutation({
    mutationFn: (status: "APPROVED" | "DENIED") =>
      ExtensionRequestsApi.updateExtensionRequestStatus.fn(extensionRequest.id, { status }),
    onSuccess: (_, status) => {
      queryClient.invalidateQueries({
        queryKey: ["ExtensionRequestsApi.getExtensionRequests"],
      });
      setPendingAction(null);
      setShowApproveModal(false);
      setShowRejectModal(false);
      Alert.alert(
        "Success",
        `Extension request ${status === "APPROVED" ? "approved" : "rejected"} successfully`
      );
    },
    onError: (error: any) => {
      setPendingAction(null);
      Alert.alert("Error", error?.message || "Failed to update extension request status");
    },
  });

  const handleApproveClick = () => {
    setShowApproveModal(true);
  };

  const handleRejectClick = () => {
    setShowRejectModal(true);
  };

  const handleApproveConfirm = () => {
    setPendingAction("APPROVED");
    updateStatusMutation.mutate("APPROVED");
  };

  const handleRejectConfirm = () => {
    setPendingAction("DENIED");
    updateStatusMutation.mutate("DENIED");
  };

  const toggleExpand = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    rotation.value = withTiming(newExpanded ? 180 : 0, { duration: 200 });
  };

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const renderActionButtons = () => {
    if (!showActions) return null;

    const isRejectPending = pendingAction === "DENIED" && updateStatusMutation.isPending;
    const isApprovePending = pendingAction === "APPROVED" && updateStatusMutation.isPending;

    return (
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
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <FontAwesome5 name="times" size={14} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Reject</Text>
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
              <Text style={styles.actionButtonText}>Approve</Text>
            </>
          )}
        </Pressable>
      </View>
    );
  };

  return (
    <Animated.View style={styles.card} layout={Layout.duration(200)}>
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {extensionRequest.title}
          </Text>
        </View>
        <StatusBadge status={extensionRequest.status} />
      </View>

      <Text style={styles.meta}>
        Request #{extensionRequest.requestNumber} • {formatDateShort(extensionRequest.timestamp)}
      </Text>

      <View style={styles.datesContainer}>
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>Old Deadline:</Text>
          <Text style={styles.dateValue}>{formatDateShort(extensionRequest.oldEndsOn)}</Text>
        </View>
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>New Deadline:</Text>
          <Text style={styles.dateValue}>{formatDateShort(extensionRequest.newEndsOn)}</Text>
        </View>
      </View>

      {extensionRequest.reason && (
        <>
          <Pressable
            onPress={toggleExpand}
            style={styles.reasonToggle}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.reasonToggleContent}>
              <Animated.View style={animatedIconStyle}>
                <FontAwesome5 name="chevron-down" size={16} color="#6B7280" />
              </Animated.View>
            </View>
          </Pressable>

          {isExpanded && (
            <Animated.View style={styles.collapsibleContent} entering={FadeIn} exiting={FadeOut}>
              <View style={styles.reasonContainer}>
                <Text style={styles.reasonLabel}>Reason:</Text>
                <Text style={styles.reasonText}>{extensionRequest.reason}</Text>
              </View>
              {renderActionButtons()}
            </Animated.View>
          )}
        </>
      )}

      {!extensionRequest.reason && renderActionButtons()}

      <ConfirmationModal
        visible={showApproveModal}
        onClose={() => {
          if (!updateStatusMutation.isPending) {
            setShowApproveModal(false);
          }
        }}
        onConfirm={handleApproveConfirm}
        title="Approve Extension Request"
        message="Are you sure you want to approve this extension request?"
        confirmLabel="Approve"
        confirmVariant="approve"
        isLoading={updateStatusMutation.isPending && pendingAction === "APPROVED"}
      />

      <ConfirmationModal
        visible={showRejectModal}
        onClose={() => {
          if (!updateStatusMutation.isPending) {
            setShowRejectModal(false);
          }
        }}
        onConfirm={handleRejectConfirm}
        title="Reject Extension Request"
        message="Are you sure you want to reject this extension request?"
        confirmLabel="Reject"
        confirmVariant="reject"
        isLoading={updateStatusMutation.isPending && pendingAction === "DENIED"}
      />
    </Animated.View>
  );
}
