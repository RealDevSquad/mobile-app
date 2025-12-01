import { StyleSheet, Platform } from "react-native";
import { ContainerStyles, CardStyles, Colors } from "../../styles/common.styles";

const styles = StyleSheet.create({
  container: ContainerStyles.base,
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    ...ContainerStyles.loading,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textGray,
    fontWeight: "500",
  },
  errorContainer: {
    ...ContainerStyles.error,
    gap: 16,
  },
  errorText: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
    textAlign: "center",
  },
  errorSubtext: {
    fontSize: 16,
    color: Colors.textGray,
    textAlign: "center",
    marginTop: 8,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
    paddingVertical: 20,
    textAlign: "center",
  },
  section: {
    ...CardStyles.base,
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 20,
    ...(Platform.OS === "ios" && {
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    }),
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: Colors.textGray,
    lineHeight: 24,
  },
  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  actionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    width: "47%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    position: "relative",
    overflow: "hidden",
    minHeight: 160,
    justifyContent: "space-between",
  },
  actionCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  taskRequestCard: {},
  extensionRequestCard: {},
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
    lineHeight: 22,
  },
  actionDescription: {
    fontSize: 12,
    color: Colors.textGray,
    lineHeight: 16,
  },
  actionArrow: {
    position: "absolute",
    top: 20,
    right: 20,
    opacity: 0.3,
  },
});

export default styles;
