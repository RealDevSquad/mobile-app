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
    marginTop: 20,
    width: "90%",
    padding: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignSelf: "center",
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
  dateText: {
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
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "center",
    width: "50%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  spaceAbove: {
    marginTop: 20,
  },
});

export default StatusUpdateForm;
