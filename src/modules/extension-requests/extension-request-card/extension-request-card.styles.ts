import { StyleSheet } from "react-native";
import { ButtonStyles, CardStyles, Colors } from "../../../styles/common.styles";

export default StyleSheet.create({
  card: {
    ...CardStyles.base,
    paddingBottom: 0,
  },
  cardHeader: {
    ...CardStyles.header,
    marginBottom: 4,
  },
  titleContainer: CardStyles.titleContainer,
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  meta: {
    fontSize: 14,
    color: Colors.textGray,
    marginBottom: 12,
  },
  datesContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: Colors.textGray,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  reasonToggle: {
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGray,
    alignItems: "center",
    justifyContent: "center",
  },
  reasonToggleContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  collapsibleContent: {
    paddingTop: 8,
  },
  reasonContainer: {
    paddingBottom: 4,
  },
  reasonLabel: {
    fontSize: 12,
    color: Colors.textGray,
    marginBottom: 4,
    fontWeight: "600",
  },
  reasonText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGray,
  },
  actionButton: ButtonStyles.base,
  approveButton: ButtonStyles.success,
  rejectButton: ButtonStyles.danger,
  actionButtonPressed: ButtonStyles.pressed,
  actionButtonDisabled: ButtonStyles.disabled,
  actionButtonText: ButtonStyles.text,
});
