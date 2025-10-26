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
          <Ionicons name="close" size={24} color="#333" />
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
            <Ionicons name="calendar-outline" size={20} color="#666" />
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
            <Ionicons name="calendar-outline" size={20} color="#666" />
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
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  closeIcon: {
    position: "absolute",
    top: 14,
    right: 18,
    zIndex: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    width: "100%",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  dateButtonText: {
    color: "#555",
    fontSize: 16,
  },
  textArea: {
    height: 100,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
  },
  submitButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#CCCCCC",
    shadowOpacity: 0.1,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledInput: {
    backgroundColor: "#F5F5F5",
    opacity: 0.6,
  },
  spaceAbove: {
    marginTop: 20,
  },
});

export default OOOModal;
