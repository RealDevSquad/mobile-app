import { TASK_API } from "@/constants/apiConstant/task-api";
import { theme } from "@/constants/theme";
import { createAuthHeaders } from "@/utils/authHeaders";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface AddProgressModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  taskId: string;
  token: string;
}

export default function AddProgressModal({
  visible,
  onClose,
  onSubmit,
  taskId,
  token,
}: AddProgressModalProps) {
  const [completed, setCompleted] = useState("");
  const [planned, setPlanned] = useState("");
  const [blockers, setBlockers] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!completed.trim() && !planned.trim() && !blockers.trim()) {
      Alert.alert("Error", "Please fill at least one field");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(TASK_API.SUBMIT_PROGRESS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...createAuthHeaders(token),
        },
        body: JSON.stringify({
          type: "task",
          taskId,
          completed: completed.trim() || "",
          planned: planned.trim() || "",
          blockers: blockers.trim() || "",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const baseMessage = `Failed to submit progress: ${response.status} ${response.statusText}`;
        const errorMessage = errorText
          ? `${baseMessage} - ${errorText}`
          : baseMessage;
        throw new Error(errorMessage);
      }

      Alert.alert("Success", "Progress updated successfully");
      setCompleted("");
      setPlanned("");
      setBlockers("");
      onSubmit();
      onClose();
    } catch (error) {
      console.error("Error submitting progress:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to submit progress"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCompleted("");
    setPlanned("");
    setBlockers("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={handleClose}
        />
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Add Task Update</Text>
              <Text style={styles.sectionSubtitle}>
                On{" "}
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Completed</Text>
              <TextInput
                style={styles.textInput}
                value={completed}
                onChangeText={setCompleted}
                placeholder="What have you completed since the last update?"
                placeholderTextColor={theme.colors.text.tertiary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Planned</Text>
              <TextInput
                style={styles.textInput}
                value={planned}
                onChangeText={setPlanned}
                placeholder="What do you plan to work on next?"
                placeholderTextColor={theme.colors.text.tertiary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Blockers</Text>
              <TextInput
                style={styles.textInput}
                value={blockers}
                onChangeText={setBlockers}
                placeholder="Any issues or blockers preventing progress?"
                placeholderTextColor={theme.colors.text.tertiary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color={theme.colors.text.inverted}
                />
              ) : (
                <Text style={styles.submitButtonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  overlayTouchable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.radius.lg,
    width: "100%",
    maxHeight: "90%",
    ...theme.shadow.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 28,
  },
  content: {
    maxHeight: 450,
    padding: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  inputSection: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  textInput: {
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    minHeight: 70,
    ...theme.shadow.sm,
  },
  footer: {
    flexDirection: "row",
    padding: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.background.tertiary,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  cancelButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  submitButton: {
    flex: 1,
    backgroundColor: theme.colors.primary[600],
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.inverted,
  },
});
