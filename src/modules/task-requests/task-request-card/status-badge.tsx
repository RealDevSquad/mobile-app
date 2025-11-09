import React from "react";
import { Text, View } from "react-native";
import styles from "./task-request-card.styles";

const getStatusColor = (status: string): string => {
  const statusUpper = status.toUpperCase();
  switch (statusUpper) {
    case "APPROVED":
      return "#10B981";
    case "REJECTED":
    case "DENIED":
      return "#EF4444";
    case "PENDING":
      return "#F59E0B";
    default:
      return "#6B7280";
  }
};

const formatStatus = (status: string): string => {
  if (status.toUpperCase() === "DENIED") {
    return "Rejected";
  }
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusColor = getStatusColor(status);
  const formattedStatus = formatStatus(status);

  return (
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: `${statusColor}15`, borderColor: statusColor },
      ]}
    >
      <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      <Text style={[styles.statusText, { color: statusColor }]}>{formattedStatus}</Text>
    </View>
  );
}
