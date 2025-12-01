import { StyleSheet } from "react-native";
import { InputStyles, Colors } from "../../styles/common.styles";

export default StyleSheet.create({
  formGroup: {
    marginTop: 8,
  },
  label: InputStyles.label,
  input: InputStyles.base,
  textArea: {
    ...InputStyles.base,
    ...InputStyles.textArea,
  },
  displayValue: {
    ...InputStyles.base,
    backgroundColor: Colors.background,
  },
  displayValueText: {
    fontSize: 15,
    color: Colors.textGray,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    ...InputStyles.base,
  },
  datePickerText: {
    fontSize: 15,
    color: Colors.textSecondary,
    flex: 1,
  },
  inputError: InputStyles.error,
  errorText: InputStyles.errorText,
  helpTextContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 16,
    padding: 12,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 8,
  },
  helpText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textGray,
    lineHeight: 18,
  },
  issueDetailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  labelsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  labelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  labelBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
});
