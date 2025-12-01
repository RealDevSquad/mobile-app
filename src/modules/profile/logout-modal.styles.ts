import { StyleSheet } from "react-native";
import { ModalStyles, ButtonStyles, Colors } from "../../styles/common.styles";

export default StyleSheet.create({
  modalOverlay: ModalStyles.overlay,
  modalContent: {
    ...ModalStyles.content,
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    ...ModalStyles.title,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  modalMessage: {
    ...ModalStyles.message,
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    ...ModalStyles.buttonContainer,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    ...ButtonStyles.base,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: Colors.borderLight,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textGray,
  },
  logoutButton: {
    flex: 1,
    ...ButtonStyles.base,
    paddingVertical: 12,
    paddingHorizontal: 20,
    ...ButtonStyles.danger,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textWhite,
  },
});
