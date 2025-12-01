import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  actionsContainer: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    ...(Platform.OS === "android"
      ? { elevation: 10 }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 8,
        }),
    zIndex: 999,
  },

  actionButton: {
    flex: 1,
    minWidth: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 8,
  },

  approveButton: {
    backgroundColor: "#E30464",
    shadowColor: "#E30464",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },

  rejectButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E30464",
  },

  approveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },

  rejectButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E30464",
    letterSpacing: 0.3,
  },

  actionButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  actionButtonDisabled: {
    opacity: 0.5,
  },
});
