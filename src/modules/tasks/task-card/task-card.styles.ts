import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#F5F3FF",
    elevation: 3,
  },
  cardHeader: {
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
    color: "#1F2937",
    lineHeight: 22,
    marginBottom: 8,
  },
  statusBadge: {
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
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardBody: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    marginRight: 8,
    minWidth: 70,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: "400",
    color: "#1F2937",
    flex: 1,
  },
  assigneeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  assigneeAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  assigneeAvatarText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#6B7280",
  },
  assigneeName: {
    fontSize: 12,
    fontWeight: "400",
    color: "#1F2937",
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: "600",
    color: "#E30464",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#F5F3FF",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#E30464",
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F5F3FF",
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "600",
  },
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dueDateText: {
    fontSize: 11,
    fontWeight: "400",
    color: "#6B7280",
    marginLeft: 4,
  },
  githubIcon: {
    marginLeft: 8,
  },
  overdueText: {
    color: "#EF4444",
    fontWeight: "600",
  },
});
