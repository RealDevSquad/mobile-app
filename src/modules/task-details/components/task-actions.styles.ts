import { StyleSheet, Platform } from "react-native";
import { ButtonStyles, Colors } from "../../../styles/common.styles";

export default StyleSheet.create({
  actionsContainer: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    rowGap: 10,
    columnGap: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
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
  actionButtonPrimary: {
    flex: 1,
    minWidth: 100,
    ...ButtonStyles.base,
    borderRadius: 14,
    ...ButtonStyles.primary,
    ...(Platform.OS === "ios" && {
      shadowColor: Colors.primary,
      shadowOpacity: 0.25,
      shadowRadius: 6,
    }),
  },
  actionButtonSecondary: {
    flex: 1,
    minWidth: 100,
    ...ButtonStyles.base,
    borderRadius: 14,
    ...ButtonStyles.secondary,
  },
  actionButtonTertiary: {
    flex: 1,
    minWidth: 100,
    ...ButtonStyles.base,
    borderRadius: 14,
    ...ButtonStyles.tertiary,
  },
  actionButtonPressed: ButtonStyles.pressed,
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonTextPrimary: {
    ...ButtonStyles.text,
    fontSize: 13,
    textAlign: "center",
  },
  actionButtonTextSecondary: {
    ...ButtonStyles.textSecondary,
    fontSize: 13,
    textAlign: "center",
  },
  actionButtonTextTertiary: {
    ...ButtonStyles.textTertiary,
    fontSize: 13,
    textAlign: "center",
  },
});
