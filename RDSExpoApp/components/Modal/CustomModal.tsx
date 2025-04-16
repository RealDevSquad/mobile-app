import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CustomModal: React.FC<ModalProps> = ({ visible, onClose, onConfirm }) => {
  if (!visible) return null;

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>
          Your QR code has been scanned successfully. Please visit the website to verify your status before proceeding.
        </Text>
        <TouchableOpacity style={styles.modalButton} onPress={onConfirm}>
          <Text style={styles.modalButtonText}>Verify Status & Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalButton} onPress={onClose}>
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
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#E94560",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});