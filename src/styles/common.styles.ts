import { StyleSheet, Platform } from "react-native";

// ==================== COLOR CONSTANTS ====================
export const Colors = {
  // Primary
  primary: "#E30464",
  primaryDark: "#A91C56",
  primaryLight: "rgba(227, 4, 100, 0.08)",

  // Backgrounds
  background: "#F9FAFB",
  backgroundWhite: "#FFFFFF",
  backgroundGray: "#F3F4F6",

  // Text
  textPrimary: "#1F2937",
  textSecondary: "#111827",
  textTertiary: "#374151",
  textGray: "#6B7280",
  textLight: "#9CA3AF",
  textWhite: "#FFFFFF",

  // Borders
  borderLight: "#F5F3FF",
  borderGray: "#E5E7EB",
  borderDark: "#D1D5DB",

  // Status
  success: "#10B981",
  error: "#EF4444",
  errorDark: "#DC2626",
  warning: "#F59E0B",

  // Overlay
  overlay: "rgba(0, 0, 0, 0.5)",

  // Neutral
  neutral: "#6B7280",

  // Dark
  dark: "#111827",
};

// ==================== TYPOGRAPHY ====================
export const Typography = StyleSheet.create({
  // Headings
  h1: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  h3: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  h4: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
  },

  // Body
  bodyLarge: {
    fontSize: 16,
    fontWeight: "400",
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.textPrimary,
  },

  // Labels
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textTertiary,
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textGray,
  },

  // Captions
  caption: {
    fontSize: 11,
    fontWeight: "400",
    color: Colors.textGray,
  },
});

// ==================== BASE CARD STYLES ====================
export const CardStyles = StyleSheet.create({
  base: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    elevation: 3,
    ...(Platform.OS === "ios" && {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 8,
  },
  body: {
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
});

// ==================== BUTTON STYLES ====================
export const ButtonStyles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  primary: {
    backgroundColor: Colors.primary,
    ...(Platform.OS === "ios" && {
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
    }),
    elevation: 3,
  },
  secondary: {
    backgroundColor: Colors.backgroundWhite,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  tertiary: {
    backgroundColor: Colors.primaryLight,
  },
  success: {
    backgroundColor: Colors.success,
  },
  danger: {
    backgroundColor: Colors.error,
  },
  cancel: {
    backgroundColor: Colors.backgroundGray,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textWhite,
    letterSpacing: 0.3,
  },
  textSecondary: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
    letterSpacing: 0.3,
  },
  textTertiary: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primaryDark,
    letterSpacing: 0.3,
  },
  textCancel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textGray,
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});

// ==================== MODAL STYLES ====================
export const ModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 12,
    padding: 20,
    width: "85%",
    maxWidth: 400,
    ...(Platform.OS === "ios" && {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    }),
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.textGray,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
});

// ==================== BADGE STYLES ====================
export const BadgeStyles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});

// ==================== INFO ROW STYLES ====================
export const InfoRowStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textGray,
    marginRight: 8,
    minWidth: 70,
  },
  value: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.textPrimary,
    flex: 1,
  },
});

// ==================== CONTAINER STYLES ====================
export const ContainerStyles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  white: {
    flex: 1,
    backgroundColor: Colors.backgroundWhite,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  error: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

// ==================== HEADER STYLES ====================
export const HeaderStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGray,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundGray,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textSecondary,
    lineHeight: 28,
    flex: 1,
  },
});

// ==================== TAB STYLES ====================
export const TabStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textGray,
  },
  activeText: {
    color: Colors.primary,
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
});

// ==================== INPUT STYLES ====================
export const InputStyles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderColor: Colors.borderGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textSecondary,
    backgroundColor: Colors.backgroundWhite,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  error: {
    borderColor: Colors.errorDark,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textTertiary,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: Colors.errorDark,
    marginTop: 4,
  },
});

// ==================== PROGRESS BAR STYLES ====================
export const ProgressStyles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textGray,
  },
  percentage: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
  },
  bar: {
    height: 6,
    backgroundColor: Colors.borderLight,
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
});

// ==================== AVATAR STYLES ====================
export const AvatarStyles = StyleSheet.create({
  small: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.borderGray,
    justifyContent: "center",
    alignItems: "center",
  },
  medium: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  large: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.borderGray,
    borderWidth: 4,
    borderColor: Colors.backgroundWhite,
    ...(Platform.OS === "ios" && {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    }),
    elevation: 6,
  },
  text: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.textGray,
  },
  textMedium: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textWhite,
  },
  textLarge: {
    fontSize: 42,
    fontWeight: "700",
    color: Colors.textWhite,
  },
});

// ==================== UTILITY FUNCTIONS ====================
export const createShadow = (elevation: number = 3) => {
  if (Platform.OS === "android") {
    return { elevation };
  }
  return {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: elevation },
    shadowOpacity: 0.1,
    shadowRadius: elevation * 2,
  };
};

export const combineStyles = (...styles: any[]) => {
  return StyleSheet.flatten(styles);
};
