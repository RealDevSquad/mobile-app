import React from "react";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";
import styles from "./confirmation-modal.styles";

type ConfirmationModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  confirmVariant: "approve" | "reject";
  isLoading?: boolean;
};

export function ConfirmationModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  confirmVariant,
  isLoading = false,
}: ConfirmationModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!isLoading) {
          onClose();
        }
      }}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => !isLoading && onClose()}
        disabled={isLoading}
      >
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[
                styles.confirmButton,
                confirmVariant === "approve" ? styles.approveButton : styles.rejectButton,
                isLoading && styles.buttonDisabled,
              ]}
              onPress={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmButtonText}>{confirmLabel}</Text>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
