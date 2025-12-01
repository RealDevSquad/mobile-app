import { StyleSheet, Platform } from "react-native";
import { ButtonStyles, Colors } from "../../styles/common.styles";

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
    ...ButtonStyles.base,
    borderRadius: 14,
  },
  approveButton: {
    ...ButtonStyles.primary,
    ...(Platform.OS === "ios" && {
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
    }),
  },
  rejectButton: ButtonStyles.secondary,
  approveButtonText: ButtonStyles.text,
  rejectButtonText: ButtonStyles.textSecondary,
  actionButtonPressed: ButtonStyles.pressed,
  actionButtonDisabled: {
    opacity: 0.5,
  },
});
