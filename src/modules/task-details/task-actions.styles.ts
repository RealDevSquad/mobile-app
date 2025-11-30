import { StyleSheet, Platform } from "react-native";

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

  // 🔹 Primary pink button
  actionButtonPrimary: {
    flex: 1,
    minWidth: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E30464",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#E30464",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },

  // 🔸 Secondary button (white border)
  actionButtonSecondary: {
    flex: 1,
    minWidth: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E30464",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  // 🩶 Tertiary subtle pink button
  actionButtonTertiary: {
    flex: 1,
    minWidth: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(227, 4, 100, 0.08)",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  actionButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  actionButtonDisabled: {
    opacity: 0.5,
  },

  // 🩷 Text styles
  actionButtonTextPrimary: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  actionButtonTextSecondary: {
    fontSize: 13,
    fontWeight: "600",
    color: "#E30464",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  actionButtonTextTertiary: {
    fontSize: 13,
    fontWeight: "600",
    color: "#A91C56",
    textAlign: "center",
    letterSpacing: 0.3,
  },
});
