import { TasksApi } from "@/api/tasks/tasks.api";
import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface UpdateTaskStatusModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  taskId: string;
  currentStatus: string;
  currentProgress: number;
  token: string;
}

const STATUS_OPTIONS = [
  "ASSIGNED",
  "IN_PROGRESS",
  "BLOCKED",
  "SMOKE_TESTING",
  "NEEDS_REVIEW",
  "IN_REVIEW",
  "APPROVED",
  "MERGED",
  "SANITY_CHECK",
  "REGRESSION_CHECK",
  "RELEASED",
  "VERIFIED",
  "DONE",
  "COMPLETED",
  "BACKLOG",
  "OVERDUE",
];

const UpdateTaskStatusModal: React.FC<UpdateTaskStatusModalProps> = ({
  visible,
  onClose,
  onSubmit,
  taskId,
  currentStatus,
  currentProgress,
  token,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [progress, setProgress] = useState(currentProgress);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const queryClient = useQueryClient();

  const updateTaskStatusMutation = useMutation({
    mutationFn: (statusData: { status: string; percentCompleted: number }) =>
      TasksApi.updateTaskStatus.fn(taskId, statusData, token || undefined),
    onSuccess: () => {
      Alert.alert("Success", "Task status and progress updated successfully.");
      // Invalidate task-related queries
      queryClient.invalidateQueries({ queryKey: ["TasksApi.getSelfTasks"] });
      queryClient.invalidateQueries({ queryKey: ["TasksApi.getTaskDetails"] });
      onSubmit();
      onClose();
    },
    onError: (error) => {
      console.error("Error updating task status:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to update task status."
      );
    },
  });

  const handleSubmit = () => {
    if (!selectedStatus || progress < 0 || progress > 100) {
      Alert.alert(
        "Error",
        "Please select a valid status and progress (0-100%)."
      );
      return;
    }

    updateTaskStatusMutation.mutate({
      status: selectedStatus,
      percentCompleted: Math.round(progress),
    });
  };

  const handleClose = () => {
    setSelectedStatus(currentStatus);
    setProgress(currentProgress);
    setShowStatusDropdown(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Update Task Status</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {/* Status Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Status</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowStatusDropdown(!showStatusDropdown)}
              >
                <Text style={styles.dropdownText}>{selectedStatus}</Text>
                <Ionicons
                  name={showStatusDropdown ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>

              {showStatusDropdown && (
                <View style={styles.dropdownList}>
                  <ScrollView
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <TouchableOpacity
                        key={status}
                        style={[
                          styles.dropdownItem,
                          selectedStatus === status &&
                            styles.dropdownItemSelected,
                        ]}
                        onPress={() => {
                          setSelectedStatus(status);
                          setShowStatusDropdown(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            selectedStatus === status &&
                              styles.dropdownItemTextSelected,
                          ]}
                        >
                          {status}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Progress Slider */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Progress: {Math.round(progress)}%
              </Text>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>0%</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  value={progress}
                  onValueChange={setProgress}
                  step={1}
                  minimumTrackTintColor={theme.colors.primary[600]}
                  maximumTrackTintColor={theme.colors.border.secondary}
                  thumbTintColor={theme.colors.primary[600]}
                />
                <Text style={styles.sliderLabel}>100%</Text>
              </View>
            </View>

            {/* Current Values Display */}
            <View style={styles.currentValues}>
              <Text style={styles.currentValuesTitle}>Current Values:</Text>
              <Text style={styles.currentValuesText}>
                Status: {currentStatus} | Progress: {currentProgress}%
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={updateTaskStatusMutation.isPending}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                updateTaskStatusMutation.isPending && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={updateTaskStatusMutation.isPending}
            >
              {updateTaskStatusMutation.isPending ? (
                <Text style={styles.submitButtonText}>Updating...</Text>
              ) : (
                <Text style={styles.submitButtonText}>Update Task</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  modalContainer: {
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.radius.lg,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    ...theme.shadow.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  content: {
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.background.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
  },
  dropdownText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
    borderRadius: theme.radius.sm,
    marginTop: 4,
    maxHeight: 300,
    zIndex: 1000,
    ...theme.shadow.md,
  },
  dropdownItem: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  dropdownItemSelected: {
    backgroundColor: theme.colors.primary[50],
  },
  dropdownItemText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  dropdownItemTextSelected: {
    color: theme.colors.primary[600],
    fontWeight: theme.typography.fontWeight.semibold,
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.sm,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: theme.spacing.sm,
  },
  sliderThumb: {
    backgroundColor: theme.colors.primary[600],
    width: 20,
    height: 20,
  },
  sliderLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  currentValues: {
    backgroundColor: theme.colors.background.tertiary,
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    marginTop: theme.spacing.sm,
  },
  currentValuesTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  currentValuesText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  actions: {
    flexDirection: "row",
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: theme.colors.background.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  cancelButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  submitButton: {
    backgroundColor: theme.colors.primary[600],
  },
  submitButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.inverted,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default UpdateTaskStatusModal;
