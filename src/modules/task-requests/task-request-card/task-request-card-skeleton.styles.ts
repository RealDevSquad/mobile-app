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
    shadowColor: "#E30464",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
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
  titleLine: {
    height: 18,
    width: "85%",
    marginBottom: 6,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
  },
  titleLineShort: {
    height: 18,
    width: "60%",
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
  },
  statusBadge: {
    width: 80,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },
  cardBody: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  labelLine: {
    height: 14,
    width: 70,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
    marginRight: 8,
  },
  valueLine: {
    height: 14,
    width: 100,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
    flex: 1,
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
  dateContainer: {
    width: 100,
    height: 16,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
  },
  skeletonLine: {
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
  },
});
