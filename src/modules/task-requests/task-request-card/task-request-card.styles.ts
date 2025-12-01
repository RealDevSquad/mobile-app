import { StyleSheet } from "react-native";
import { CardStyles, BadgeStyles, InfoRowStyles, Colors } from "../../../styles/common.styles";

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
  cardFooter: CardStyles.footer,
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 11,
    fontWeight: "400",
    color: Colors.textGray,
    marginLeft: 4,
  },
  githubIcon: {
    marginLeft: 8,
  },
});
