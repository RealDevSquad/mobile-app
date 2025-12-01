import { useQuery } from "@tanstack/react-query";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { ExtensionRequestsApi } from "../../../api/extension-requests/extension-requests.api";
import { TaskDetailsDTO } from "../../../api/tasks/task.dto";
import { AddProgressModal } from "../modals/add-progress-modal";
import { ExtensionRequestDetailsModal } from "../modals/extension-request-details-modal";
import { ExtensionRequestModal } from "../modals/extension-request-modal";
import { UpdateTaskModal } from "../modals/update-task-modal";
import styles from "./task-actions.styles";

type TaskActionsProps = {
  taskId: string;
  task: TaskDetailsDTO["taskData"];
};

export function TaskActions({ taskId, task }: TaskActionsProps) {
  const [extensionModalVisible, setExtensionModalVisible] = useState(false);
  const [extensionDetailsModalVisible, setExtensionDetailsModalVisible] = useState(false);
  const [updateTaskModalVisible, setUpdateTaskModalVisible] = useState(false);
  const [addProgressModalVisible, setAddProgressModalVisible] = useState(false);

  const { data: extensionRequestsData, isLoading: isLoadingExtensionRequests } = useQuery({
    queryKey: ExtensionRequestsApi.getSelfExtensionRequests.key({ taskId }),
    queryFn: () => ExtensionRequestsApi.getSelfExtensionRequests.fn({ taskId }),
    enabled: !!taskId,
  });

  const pendingExtensionRequest = extensionRequestsData?.allExtensionRequests?.find(
    (er) => er.status === "PENDING"
  );

  const handleRaiseExtensionRequest = () => {
    if (pendingExtensionRequest) {
      setExtensionDetailsModalVisible(true);
    } else {
      setExtensionModalVisible(true);
    }
  };

  const getExtensionRequestButtonText = () => {
    if (isLoadingExtensionRequests) {
      return "Checking...";
    }
    if (pendingExtensionRequest) {
      return "Pending ER";
    }
    return "Raise ER";
  };

  const handleUpdateTask = () => setUpdateTaskModalVisible(true);
  const handleAddProgress = () => setAddProgressModalVisible(true);

  return (
    <>
      <View style={styles.actionsContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButtonSecondary,
            pressed && styles.actionButtonPressed,
          ]}
          onPress={handleUpdateTask}
        >
          <FontAwesome5 name="edit" size={13} color="#E30464" style={{ marginRight: 6 }} />
          <Text style={styles.actionButtonTextSecondary}>Update</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButtonPrimary,
            pressed && styles.actionButtonPressed,
          ]}
          onPress={handleAddProgress}
        >
          <FontAwesome5 name="plus-circle" size={13} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.actionButtonTextPrimary}>Progress</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButtonTertiary,
            (pressed || isLoadingExtensionRequests) && styles.actionButtonPressed,
            isLoadingExtensionRequests && styles.actionButtonDisabled,
          ]}
          onPress={handleRaiseExtensionRequest}
          disabled={isLoadingExtensionRequests}
        >
          {isLoadingExtensionRequests ? (
            <ActivityIndicator size="small" color="#E30464" style={{ marginRight: 6 }} />
          ) : (
            <FontAwesome5
              name={pendingExtensionRequest ? "clock" : "calendar-plus"}
              size={13}
              color="#A91C56"
              style={{ marginRight: 6 }}
            />
          )}
          <Text style={styles.actionButtonTextTertiary}>{getExtensionRequestButtonText()}</Text>
        </Pressable>
      </View>

      <ExtensionRequestModal
        visible={extensionModalVisible}
        onClose={() => setExtensionModalVisible(false)}
        taskId={taskId}
        task={task}
      />

      {pendingExtensionRequest && (
        <ExtensionRequestDetailsModal
          visible={extensionDetailsModalVisible}
          onClose={() => setExtensionDetailsModalVisible(false)}
          extensionRequest={pendingExtensionRequest}
          taskId={taskId}
        />
      )}

      <UpdateTaskModal
        visible={updateTaskModalVisible}
        onClose={() => setUpdateTaskModalVisible(false)}
        taskId={taskId}
        task={task}
      />

      <AddProgressModal
        visible={addProgressModalVisible}
        onClose={() => setAddProgressModalVisible(false)}
        taskId={taskId}
      />
    </>
  );
}
