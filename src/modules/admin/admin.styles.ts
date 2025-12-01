import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 20,
  },
  errorText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
  },
  errorSubtext: {
    fontSize: 16,
    color: "#6B7280",
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
    color: "#1F2937",
    paddingVertical: 20,
    textAlign: "center",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: "#6B7280",
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
    color: "#1F2937",
    marginBottom: 4,
    lineHeight: 22,
  },
  actionDescription: {
    fontSize: 12,
    color: "#6B7280",
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
