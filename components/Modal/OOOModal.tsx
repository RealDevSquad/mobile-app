import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface OOOModalProps {
  onSubmit: (fromDate: Date, toDate: Date, reason: string) => void;
  onClose: () => void;
  isVisible: boolean;
  isLoading?: boolean;
}

const OOOModal: React.FC<OOOModalProps> = ({
  onSubmit,
  onClose,
  isVisible,
  isLoading = false,
}) => {
  const [fromDate, setFromDate] = useState<Date | null>(new Date());
  const [toDate, setToDate] = useState<Date | null>(null);
  const [reason, setReason] = useState("");
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const isFormValid = (): boolean => {
    if (!fromDate || !toDate) {
      Alert.alert("Error", "Please select both start date and end date.");
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison

    if (fromDate < today) {
      Alert.alert(
        "Error",
        "Start date cannot be in the past. Please select today or a future date."
      );
      return false;
    }

    if (fromDate >= toDate) {
      Alert.alert("Error", "Start date must be before end date.");
      return false;
    }

    if (!reason.trim()) {
      Alert.alert("Error", "Reason is required.");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      const formattedFromDate = fromDate || new Date();
      const formattedToDate = toDate || new Date();
      onSubmit(formattedFromDate, formattedToDate, reason.trim());
      resetForm();
    }
  };

  const resetForm = () => {
    setFromDate(new Date());
    setToDate(null);
    setReason("");
    setShowFromDatePicker(false);
    setShowToDatePicker(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        {/* Close Icon */}
        <TouchableOpacity
          style={styles.closeIcon}
          onPress={handleClose}
          testID="close-button"
        >
          <Ionicons name="close" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>

        <Text style={styles.title}>Apply for OOO</Text>

        {/* Start Date Picker */}
        <View style={styles.spaceAbove}>
          <Text style={styles.label}>Start Date</Text>
          <TouchableOpacity
            style={[styles.dateButton, isLoading && styles.disabledInput]}
            onPress={() => !isLoading && setShowFromDatePicker(true)}
            disabled={isLoading}
          >
            <Text style={styles.dateButtonText}>
              {fromDate ? formatDate(fromDate) : "Select Start Date"}
            </Text>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>
          {showFromDatePicker && (
            <DateTimePicker
              value={fromDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowFromDatePicker(false);
                if (selectedDate) {
                  setFromDate(selectedDate);
                }
              }}
            />
          )}
        </View>

        {/* End Date Picker */}
        <View>
          <Text style={styles.label}>End Date</Text>
          <TouchableOpacity
            style={[styles.dateButton, isLoading && styles.disabledInput]}
            onPress={() => !isLoading && setShowToDatePicker(true)}
            disabled={isLoading}
          >
            <Text style={styles.dateButtonText}>
              {toDate
                ? formatDate(toDate)
                : "Select End Date (After start date)"}
            </Text>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>
          {showToDatePicker && (
            <DateTimePicker
              value={toDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              minimumDate={fromDate || new Date()}
              onChange={(event, selectedDate) => {
                setShowToDatePicker(false);
                if (selectedDate) {
                  setToDate(selectedDate);
                }
              }}
            />
          )}
        </View>

        {/* Reason Input */}
        <View>
          <Text style={styles.label}>Reason</Text>
          <TextInput
            placeholder="Enter reason for OOO"
            style={[
              styles.input,
              styles.textArea,
              isLoading && styles.disabledInput,
            ]}
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={4}
            editable={!isLoading}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isLoading && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Applying...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>Apply for OOO</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
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
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.radius.lg,
    ...theme.shadow.lg,
  },
  closeIcon: {
    position: "absolute",
    top: 14,
    right: 18,
    zIndex: 4,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    width: "100%",
    justifyContent: "center",
    backgroundColor: theme.colors.surface.secondary,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.surface.secondary,
  },
  dateButtonText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.regular,
  },
  textArea: {
    height: 100,
    borderColor: theme.colors.border.primary,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface.secondary,
  },
  submitButton: {
    backgroundColor: theme.colors.primary[500],
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    alignSelf: "center",
    width: "100%",
    ...theme.shadow.md,
  },
  submitButtonDisabled: {
    backgroundColor: theme.colors.gray[300],
    shadowOpacity: 0.1,
  },
  submitButtonText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.bold,
    textAlign: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledInput: {
    backgroundColor: theme.colors.surface.tertiary,
    opacity: 0.6,
  },
  spaceAbove: {
    marginTop: theme.spacing.lg,
  },
});

export default OOOModal;
