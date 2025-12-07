import { StyleSheet } from "react-native";
import { Colors } from "../../styles/common.styles";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  headerRight: {
    marginLeft: "auto",
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.error,
    borderRadius: 6,
  },
  clearButtonText: {
    color: Colors.textWhite,
    fontSize: 14,
    fontWeight: "500",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textGray,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 12,
    gap: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textGray,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textGray,
  },
  apiCard: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  apiCardError: {
    borderColor: "#FCA5A5",
    borderWidth: 1,
  },
  apiCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  apiCardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  apiCardHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  methodBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  methodText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.textWhite,
  },
  pathText: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.textPrimary,
    flex: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  timestampText: {
    fontSize: 11,
    color: Colors.textGray,
  },
  apiCardContent: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    padding: 12,
    gap: 16,
  },
  section: {
    gap: 6,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textGray,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  copyButton: {
    padding: 6,
    borderRadius: 4,
    backgroundColor: "#F3F4F6",
  },
  errorTitle: {
    color: Colors.error,
  },
  codeBlock: {
    backgroundColor: "#1F2937",
    borderRadius: 8,
    padding: 12,
  },
  codeBlockError: {
    backgroundColor: "#7F1D1D",
    borderRadius: 8,
    padding: 12,
  },
  codeText: {
    fontSize: 11,
    fontFamily: "monospace",
    color: "#E5E7EB",
    lineHeight: 16,
  },
  // All Logs tab styles
  logCard: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  logCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  levelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  levelText: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.textWhite,
  },
  sourceText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textGray,
    flex: 1,
  },
  logMessage: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  logDataBlock: {
    marginTop: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
    padding: 8,
  },
  logDataText: {
    fontSize: 10,
    fontFamily: "monospace",
    color: Colors.textGray,
    lineHeight: 14,
  },
});
