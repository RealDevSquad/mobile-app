import { StyleSheet, Platform } from "react-native";
import {
  ContainerStyles,
  HeaderStyles,
  TabStyles,
  CardStyles,
  BadgeStyles,
  Colors,
} from "../../styles/common.styles";

const styles = StyleSheet.create({
  container: ContainerStyles.white,
  header: HeaderStyles.container,
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  placeholder: {
    width: 36,
  },
  tabsContainer: TabStyles.container,
  tab: TabStyles.tab,
  tabText: TabStyles.text,
  activeTabText: TabStyles.activeText,
  activeIndicator: TabStyles.indicator,
  contentContainer: ContainerStyles.base,
  centerContainer: ContainerStyles.center,
  loadingText: {
    fontSize: 16,
    color: Colors.textGray,
    marginTop: 12,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.error,
    marginTop: 12,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginTop: 12,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textGray,
    textAlign: "center",
    marginTop: 4,
  },
  listContainer: {
    paddingTop: 12,
    paddingBottom: 20,
  },
  requestCard: {
    ...CardStyles.base,
    ...(Platform.OS === "ios" && {
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    }),
  },
  requestHeader: {
    ...CardStyles.header,
    marginBottom: 8,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  statusBadge: BadgeStyles.base,
  statusDot: BadgeStyles.statusDot,
  statusText: BadgeStyles.text,
  requestMeta: {
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
  reasonContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGray,
  },
  reasonLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textGray,
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
});

export default styles;
