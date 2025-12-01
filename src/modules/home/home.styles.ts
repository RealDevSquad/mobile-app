import { StyleSheet } from "react-native";
import { AvatarStyles, Colors } from "../../styles/common.styles";

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: Colors.backgroundWhite,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageContainer: {
    marginLeft: 16,
  },
  notificationButton: {
    position: "relative",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.borderLight,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -2,
    backgroundColor: Colors.error,
    borderRadius: 9999,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: Colors.textWhite,
    fontSize: 12,
    fontWeight: "600",
  },
  profileImage: AvatarStyles.medium,
  profileImagePlaceholder: {
    ...AvatarStyles.medium,
    backgroundColor: Colors.borderGray,
  },
  profileImagePlaceholderText: {
    color: Colors.textGray,
    fontSize: 16,
    fontWeight: "600",
  },
});
