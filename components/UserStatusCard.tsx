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
        return "#4CAF50"; // Green
      case "OOO":
        return "#FF9800"; // Orange
      default:
        return "#9E9E9E"; // Gray
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
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
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
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 100,
    alignItems: "center",
  },
  applyButton: {
    backgroundColor: "#FF6B35",
  },
  cancelButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  messageContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  messageText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  dateContainer: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: 12,
    color: "#888888",
    fontWeight: "500",
  },
});

export default UserStatusCard;
