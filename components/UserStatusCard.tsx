import { theme } from "@/constants/theme";
import { UserStatus } from "@/types/user.dto";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface UserStatusCardProps {
  userStatus: UserStatus | null;
  onApplyOOO: () => void;
  onCancelOOO: () => void;
  isLoading?: boolean;
}

const UserStatusCard: React.FC<UserStatusCardProps> = ({
  userStatus,
  onApplyOOO,
  onCancelOOO,
  isLoading = false,
}) => {
  const getStatusColor = (state: string): string => {
    switch (state?.toUpperCase()) {
      case "ACTIVE":
        return theme.colors.success[500]; // Green
      case "OOO":
        return theme.colors.warning[500]; // Orange
      default:
        return theme.colors.gray[500]; // Gray
    }
  };

  const getStatusText = (state: string): string => {
    switch (state?.toUpperCase()) {
      case "ACTIVE":
        return "Active";
      case "OOO":
        return "Out of Office";
      default:
        return state || "Unknown";
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const isOOO = userStatus?.data?.currentStatus?.state?.toUpperCase() === "OOO";
  const currentStatus = userStatus?.data?.currentStatus;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(currentStatus?.state || "") },
            ]}
          />
          <Text style={styles.statusText}>
            {getStatusText(currentStatus?.state || "")}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.actionButton,
            isOOO ? styles.cancelButton : styles.applyButton,
          ]}
          onPress={isOOO ? onCancelOOO : onApplyOOO}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Loading..." : isOOO ? "Cancel OOO" : "Apply for OOO"}
          </Text>
        </TouchableOpacity>
      </View>

      {currentStatus?.message && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{currentStatus.message}</Text>
        </View>
      )}

      {isOOO && currentStatus && (
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            From: {formatDate(currentStatus.from)}
          </Text>
          <Text style={styles.dateText}>
            Until: {formatDate(currentStatus.until)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.primary,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    ...theme.shadow.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  statusText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.primary,
  },
  actionButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
    minWidth: 100,
    alignItems: "center",
  },
  applyButton: {
    backgroundColor: theme.colors.primary[500],
  },
  cancelButton: {
    backgroundColor: theme.colors.error[500],
  },
  buttonText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
  messageContainer: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radius.sm,
  },
  messageText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    fontFamily: theme.typography.fontFamily.regular,
  },
  dateContainer: {
    marginTop: theme.spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    fontFamily: theme.typography.fontFamily.medium,
  },
});

export default UserStatusCard;
