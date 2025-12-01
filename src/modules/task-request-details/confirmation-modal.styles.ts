import { StyleSheet } from "react-native";

export default StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    width: "85%",
    maxWidth: 360,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  approveButton: {
    backgroundColor: "#10B981",
  },
  rejectButton: {
    backgroundColor: "#EF4444",
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

