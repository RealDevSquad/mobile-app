import { StyleSheet } from "react-native";
import { ModalStyles, ButtonStyles, Colors } from "../styles/common.styles";

export default StyleSheet.create({
  backdrop: {
    ...ModalStyles.overlay,
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    flexDirection: "column",
  },
  header: {
    paddingTop: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    gap: 12,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundGray,
  },
  closeButtonPressed: {
    backgroundColor: Colors.borderGray,
    transform: [{ scale: 0.95 }],
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 20,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGray,
  },
  button: {
    flex: 1,
    ...ButtonStyles.base,
  },
  secondaryButton: ButtonStyles.cancel,
  primaryButton: ButtonStyles.primary,
  dangerButton: {
    backgroundColor: Colors.errorDark,
  },
  buttonDisabled: ButtonStyles.disabled,
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textTertiary,
  },
  primaryButtonText: ButtonStyles.text,
  dangerButtonText: ButtonStyles.text,
});
