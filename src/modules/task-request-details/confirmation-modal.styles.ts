import { StyleSheet, Platform } from "react-native";
import { ModalStyles, ButtonStyles } from "../../styles/common.styles";

export default StyleSheet.create({
  modalOverlay: ModalStyles.overlay,
  modalContent: {
    ...ModalStyles.content,
    maxWidth: 360,
    ...(Platform.OS === "ios" && {
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    }),
    elevation: 5,
  },
  modalTitle: ModalStyles.title,
  modalMessage: ModalStyles.message,
  buttonContainer: ModalStyles.buttonContainer,
  cancelButton: {
    flex: 1,
    ...ButtonStyles.base,
    paddingVertical: 10,
    paddingHorizontal: 16,
    ...ButtonStyles.cancel,
  },
  cancelButtonText: ButtonStyles.textCancel,
  confirmButton: {
    flex: 1,
    ...ButtonStyles.base,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  approveButton: ButtonStyles.success,
  rejectButton: ButtonStyles.danger,
  confirmButtonText: ButtonStyles.text,
  buttonDisabled: ButtonStyles.disabled,
});
