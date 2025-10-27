import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type FormDatePickerProps = {
  label: string;
  value: Date | null;
  onDateChange: (date: Date | null) => void;
  placeholder?: string;
  required?: boolean;
  errorMessage?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
};

const FormDatePicker = ({
  label,
  value,
  onDateChange,
  placeholder = "Select date",
  required = false,
  errorMessage,
  minimumDate,
  maximumDate,
  disabled = false,
  icon = "calendar-outline",
}: FormDatePickerProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };

  const handlePress = () => {
    if (!disabled) {
      setShowDatePicker(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        {icon && (
          <Ionicons
            name={icon}
            size={16}
            color={theme.colors.text.secondary}
            style={styles.icon}
          />
        )}
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.dateButton,
          errorMessage && styles.dateButtonError,
          disabled && styles.dateButtonDisabled,
        ]}
        onPress={handlePress}
        disabled={disabled}
      >
        <Text
          style={[
            styles.dateButtonText,
            !value && styles.placeholderText,
            disabled && styles.disabledText,
          ]}
        >
          {value ? formatDate(value) : placeholder}
        </Text>
        <Ionicons
          name="chevron-down"
          size={16}
          color={
            disabled ? theme.colors.text.disabled : theme.colors.text.secondary
          }
        />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onChange={handleDateChange}
        />
      )}

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  icon: {
    marginRight: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  required: {
    color: theme.colors.error[500],
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
    minHeight: 44,
  },
  dateButtonError: {
    borderColor: theme.colors.error[500],
  },
  dateButtonDisabled: {
    backgroundColor: theme.colors.background.secondary,
    borderColor: theme.colors.border.secondary,
  },
  dateButtonText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    flex: 1,
  },
  placeholderText: {
    color: theme.colors.text.tertiary,
  },
  disabledText: {
    color: theme.colors.text.disabled,
  },
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.error[500],
    marginTop: theme.spacing.xs,
  },
});

export default FormDatePicker;


