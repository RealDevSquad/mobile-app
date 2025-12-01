import { StyleSheet } from "react-native";
import {
  CardStyles,
  BadgeStyles,
  InfoRowStyles,
  ProgressStyles,
  AvatarStyles,
  Colors,
} from "../../../styles/common.styles";

export default StyleSheet.create({
  card: CardStyles.base,
  cardHeader: CardStyles.header,
  titleContainer: CardStyles.titleContainer,
  title: CardStyles.title,
  statusBadge: BadgeStyles.base,
  statusDot: BadgeStyles.statusDot,
  statusText: BadgeStyles.text,
  cardBody: CardStyles.body,
  infoRow: InfoRowStyles.container,
  infoLabel: InfoRowStyles.label,
  infoValue: InfoRowStyles.value,
  assigneeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  assigneeAvatar: {
    ...AvatarStyles.small,
    marginRight: 8,
  },
  assigneeAvatarText: AvatarStyles.text,
  assigneeName: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.textPrimary,
  },
  progressContainer: ProgressStyles.container,
  progressHeader: ProgressStyles.header,
  progressLabel: ProgressStyles.label,
  progressPercentage: ProgressStyles.percentage,
  progressBar: ProgressStyles.bar,
  progressFill: ProgressStyles.fill,
  cardFooter: CardStyles.footer,
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
    color: Colors.textGray,
    marginLeft: 4,
  },
  githubIcon: {
    marginLeft: 8,
  },
  overdueText: {
    color: Colors.error,
    fontWeight: "600",
  },
});
