import { Dimensions, StyleSheet } from "react-native";

const screenWidth = Dimensions.get("window").width;
const MEMBERS_PER_ROW = 3;
const cardWidth = (screenWidth - 60) / MEMBERS_PER_ROW;

export default StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    gap: 10,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    justifyContent: "center",
    gap: 10,
  },
  memberCard: {
    alignItems: "center",
    width: cardWidth,
  },
  avatarContainer: {
    marginBottom: 8,
  },
  avatar: {
    width: cardWidth - 20,
    height: cardWidth - 20,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    borderWidth: 2,
    borderColor: "#F5F3FF",
    shadowColor: "#E30464",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarPlaceholder: {
    width: cardWidth - 20,
    height: cardWidth - 20,
    borderRadius: 12,
    backgroundColor: "#E30464",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#F5F3FF",
    shadowColor: "#E30464",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarPlaceholderText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  memberName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 2,
    width: "100%",
  },
  memberOccupation: {
    fontSize: 10,
    fontWeight: "400",
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 6,
    width: "100%",
  },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  socialIcon: {
    marginHorizontal: 2,
  },
  skeletonCard: {
    alignItems: "center",
    width: cardWidth,
  },
  skeletonAvatar: {
    width: cardWidth - 20,
    height: cardWidth - 20,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    marginBottom: 8,
  },
  skeletonName: {
    width: cardWidth - 30,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
    marginBottom: 4,
  },
});
