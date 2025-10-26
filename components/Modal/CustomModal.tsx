import { theme } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CustomModal: React.FC<ModalProps> = ({ visible, onClose, onConfirm }) => {
  if (!visible) return null;

  return (
    <View style={styles.modalContainer} testID="custom-modal-container">
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>
          Your QR code has been scanned successfully. Please visit the website
          to verify your status before proceeding.
        </Text>
        <TouchableOpacity
          style={styles.modalButton}
          onPress={onConfirm}
          testID="confirm-button"
        >
          <Text style={styles.modalButtonText}>Verify Status & Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.modalButton}
          onPress={onClose}
          testID="close-button"
        >
          <Text style={styles.modalButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.radius.md,
    alignItems: "center",
  },
  modalText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  modalButton: {
    backgroundColor: theme.colors.primary[500],
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.sm,
    marginTop: theme.spacing.sm,
  },
  modalButtonText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.bold,
  },
});
