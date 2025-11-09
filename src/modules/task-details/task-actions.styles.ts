import { StyleSheet } from "react-native";

export default StyleSheet.create({
  actionsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  actionButtonPressed: {
    opacity: 0.7,
    backgroundColor: "#F3F4F6",
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#E30464",
    textAlign: "center",
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
});
