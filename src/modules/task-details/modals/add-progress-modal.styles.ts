import { StyleSheet } from "react-native";
import { InputStyles, Colors } from "../../../styles/common.styles";

export default StyleSheet.create({
  formGroup: {
    marginBottom: 20,
  },
  label: {
    ...InputStyles.label,
    marginBottom: 4,
  },
  labelHint: {
    fontSize: 12,
    color: Colors.textGray,
    marginBottom: 8,
  },
  input: InputStyles.base,
  textArea: {
    ...InputStyles.base,
    minHeight: 100,
    paddingTop: 12,
  },
  inputError: InputStyles.error,
  errorText: InputStyles.errorText,
});
