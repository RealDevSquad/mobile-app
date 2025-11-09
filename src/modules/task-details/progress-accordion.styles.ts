import { StyleSheet } from "react-native";

export default StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  accordionContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  accordionItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  accordionItemLast: {
    borderBottomWidth: 0,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  accordionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E30464",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  userAvatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  userAvatarText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  accordionHeaderInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  updateDate: {
    fontSize: 11,
    fontWeight: "400",
    color: "#6B7280",
  },
  accordionContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 10,
  },
  progressField: {
    gap: 4,
  },
  progressFieldHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  progressFieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  progressFieldValue: {
    fontSize: 12,
    fontWeight: "400",
    color: "#1F2937",
    lineHeight: 18,
    paddingLeft: 18,
  },
  emptyContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  emptyText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
});
