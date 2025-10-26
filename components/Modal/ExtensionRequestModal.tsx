import { EXTENSION_REQUEST_API } from "@/constants/apiConstant/extension-request-api";
import { theme } from "@/constants/theme";
import { createAuthHeaders } from "@/utils/authHeaders";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ExtensionRequestModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  taskId: string;
  oldEndsOn: number;
  assignee: string;
  token: string;
}

interface ExtensionRequestData {
  assignee: string;
  newEndsOn: number;
  oldEndsOn: number;
  reason: string;
  status: "PENDING";
  taskId: string;
  title: string;
}

const ExtensionRequestModal: React.FC<ExtensionRequestModalProps> = ({
  visible,
  onClose,
  onSubmit,
  taskId,
  oldEndsOn,
  assignee,
  token,
}) => {
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const [newDeadline, setNewDeadline] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const isFormValid = (): boolean => {
    if (!title.trim()) {
      Alert.alert("Error", "Title is required.");
      return false;
    }
    if (!reason.trim()) {
      Alert.alert("Error", "Reason is required.");
      return false;
    }
    if (!newDeadline) {
      Alert.alert("Error", "New deadline is required.");
      return false;
    }

    // Check if new deadline is after old deadline
    const oldDeadlineDate = moment.unix(oldEndsOn).toDate();
    if (newDeadline <= oldDeadlineDate) {
      Alert.alert("Error", "New deadline must be after the current deadline.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!isFormValid() || !newDeadline) return;

    setIsLoading(true);

    try {
      const extensionRequestData: ExtensionRequestData = {
        assignee,
        newEndsOn: moment(newDeadline).unix(),
        oldEndsOn,
        reason: reason.trim(),
        status: "PENDING",
        taskId,
        title: title.trim(),
      };

      const response = await fetch(
        EXTENSION_REQUEST_API.CREATE_EXTENSION_REQUEST,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...createAuthHeaders(token),
          },
          body: JSON.stringify(extensionRequestData),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to create extension request: ${response.statusText}`
        );
      }

      Alert.alert("Success", "Extension request submitted successfully!", [
        {
          text: "OK",
          onPress: () => {
            resetForm();
            onSubmit();
          },
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to submit extension request"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setReason("");
    setNewDeadline(null);
    setShowDatePicker(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const oldDeadlineDate = moment.unix(oldEndsOn).format("MMM DD, YYYY");

  if (!visible) return null;

  return (
    <>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close Icon */}
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={handleClose}
            disabled={isLoading}
            testID="close-button"
          >
            <Ionicons
              name="close"
              size={24}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>

          <Text style={styles.title}>Raise Extension Request</Text>

          {/* Current Deadline Info */}
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Current Deadline:</Text>
            <Text style={styles.infoValue}>{oldDeadlineDate}</Text>
          </View>

          {/* Title Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={[styles.input, isLoading && styles.disabledInput]}
              placeholder="Enter extension request title"
              value={title}
              onChangeText={setTitle}
              editable={!isLoading}
            />
          </View>

          {/* Reason Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Reason *</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                isLoading && styles.disabledInput,
              ]}
              placeholder="Explain why you need an extension"
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={4}
              editable={!isLoading}
            />
          </View>

          {/* New Deadline Picker */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Deadline *</Text>
            <TouchableOpacity
              style={[styles.dateButton, isLoading && styles.disabledInput]}
              onPress={() => !isLoading && setShowDatePicker(true)}
              disabled={isLoading}
            >
              <Text style={styles.dateButtonText}>
                {newDeadline ? formatDate(newDeadline) : "Select new deadline"}
              </Text>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={newDeadline || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                minimumDate={moment.unix(oldEndsOn).add(1, "day").toDate()}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setNewDeadline(selectedDate);
                  }
                }}
              />
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                isLoading && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? "Submitting..." : "Submit Request"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContainer: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    ...theme.shadow.lg,
  },
  closeIcon: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md,
    zIndex: 1,
    padding: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.sm,
    marginRight: theme.spacing.xl,
    textAlign: "center",
  },
  infoSection: {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.md,
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  infoValue: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.primary,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  dateButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background.primary,
  },
  dateButtonText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  cancelButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
  },
  submitButton: {
    backgroundColor: theme.colors.legacy.primary,
  },
  submitButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.inverted,
  },
  disabledInput: {
    backgroundColor: theme.colors.background.secondary,
    color: theme.colors.text.disabled,
  },
  disabledButton: {
    backgroundColor: theme.colors.gray[300],
  },
});

export default ExtensionRequestModal;
