import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

type FormInputProps = {
  label: string;
  htmlFor?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  required?: boolean;
  errorMessage?: string;
  children?: React.ReactNode;
  direction?: "row" | "column";
} & TextInputProps;

const FormInput = ({
  children,
  label,
  htmlFor,
  icon,
  required,
  errorMessage,
  direction = "column",
  style,
  ...textInputProps
}: FormInputProps) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.labelContainer,
          direction === "row" ? styles.labelRow : styles.labelColumn,
        ]}
      >
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

      {children ?? (
        <TextInput
          style={[styles.input, errorMessage && styles.inputError, style]}
          placeholderTextColor={theme.colors.text.tertiary}
          {...textInputProps}
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
    marginBottom: theme.spacing.sm,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    width: 120,
  },
  labelColumn: {
    flexDirection: "row",
    alignItems: "center",
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
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.primary,
    minHeight: 44,
  },
  inputError: {
    borderColor: theme.colors.error[500],
  },
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.error[500],
    marginTop: theme.spacing.xs,
  },
});

export default FormInput;
