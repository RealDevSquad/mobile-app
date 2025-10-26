import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DatePicker from "react-native-date-picker";

interface StatusUpdateFormProps {
  onSubmit: (fromDate: Date, toDate: Date, description: string) => void;
  onClose: () => void; // Callback to handle closing the form
}

const StatusUpdateForm: React.FC<StatusUpdateFormProps> = ({
  onSubmit,
  onClose,
}) => {
  const [fromDate, setFromDate] = useState<Date | null>(null); // State for From Date
  const [toDate, setToDate] = useState<Date | null>(null); // State for To Date
  const [description, setDescription] = useState("");
  const [openFromDatePicker, setOpenFromDatePicker] = useState(false); // State to toggle From Date picker
  const [openToDatePicker, setOpenToDatePicker] = useState(false); // State to toggle To Date picker

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
  };

  const isFormValid = (): boolean => {
    if (!fromDate || !toDate) {
      Alert.alert("Error", "Please select both From Date and To Date.");
      return false;
    }
    if (fromDate >= toDate) {
      Alert.alert("Error", "From Date must be less than To Date.");
      return false;
    }
    if (!description) {
      Alert.alert("Error", "Description is required.");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      const formattedFromDate = fromDate ? fromDate : new Date();
      const formattedToDate = toDate ? toDate : new Date();
      onSubmit(formattedFromDate, formattedToDate, description);
      setFromDate(null);
      setToDate(null);
      setDescription("");
      setOpenFromDatePicker(false);
      setOpenToDatePicker(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* Close Icon */}
      <TouchableOpacity
        style={styles.closeIcon}
        onPress={onClose}
        testID="close-button"
      >
        <Ionicons name="close" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>Update Status</Text>

      {/* From Date Picker */}
      <TouchableOpacity
        style={[styles.input, styles.spaceAbove]}
        onPress={() => setOpenFromDatePicker(true)}
      >
        <Text style={styles.dateText}>
          {fromDate ? formatDate(fromDate) : "Select From Date"}
        </Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={openFromDatePicker}
        date={fromDate || new Date()}
        mode="date"
        onConfirm={(date) => {
          setOpenFromDatePicker(false);
          setFromDate(date);
        }}
        onCancel={() => setOpenFromDatePicker(false)}
      />

      {/* To Date Picker */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setOpenToDatePicker(true)}
      >
        <Text style={styles.dateText}>
          {toDate ? formatDate(toDate) : "Select To Date"}
        </Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={openToDatePicker}
        date={toDate || new Date()}
        mode="date"
        onConfirm={(date) => {
          setOpenToDatePicker(false);
          setToDate(date);
        }}
        onCancel={() => setOpenToDatePicker(false)}
      />

      {/* Description Input */}
      <TextInput
        placeholder="Add description"
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: theme.spacing.lg,
    width: "90%",
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.background.primary,
    ...theme.shadow.lg,
    alignSelf: "center",
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
  dateText: {
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
    width: "50%",
    ...theme.shadow.lg,
  },
  submitButtonText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.bold,
    textAlign: "center",
  },
  spaceAbove: {
    marginTop: theme.spacing.lg,
  },
});

export default StatusUpdateForm;
