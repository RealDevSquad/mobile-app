import React from "react";
import { Text, View } from "react-native";
import { formatStatus, getStatusColor } from "./task-card.utils";
import styles from "./task-card.styles";

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
