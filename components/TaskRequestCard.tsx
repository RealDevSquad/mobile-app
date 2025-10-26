import { theme } from "@/constants/theme";
import { TaskRequestDTO } from "@/types/task-request.dto";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import moment from "moment";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TaskRequestCardProps {
  request: TaskRequestDTO;
  onPress: (id: string) => void;
}

const TaskRequestCard: React.FC<TaskRequestCardProps> = ({
  request,
  onPress,
}) => {
  const formatTimeAgo = (timestamp: number) => {
    const currentDate = moment();
    const requestDate = moment(timestamp);
    return requestDate.from(currentDate);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return theme.colors.warning[500];
      case "APPROVED":
        return theme.colors.success[500];
      case "REJECTED":
        return theme.colors.error[500];
      default:
        return theme.colors.gray[500];
    }
  };

  const getRequestorName = () => {
    if (request.users && request.users.length > 0) {
      const user = request.users[0];
      if (user.first_name && user.last_name) {
        return `${user.first_name} ${user.last_name}`;
      }
      return user.username || "Unknown User";
    }
    return "Unknown User";
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(request.id)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>
            {truncateText(request.taskTitle, 60)}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(request.status) },
            ]}
          >
            <Text style={styles.statusText}>{request.status}</Text>
          </View>
        </View>
        <FontAwesome
          name="chevron-right"
          size={16}
          color="#666"
          style={styles.arrowIcon}
        />
      </View>

      <Text style={styles.text}>
        Requested by: <Text style={styles.requestor}>{getRequestorName()}</Text>
      </Text>

      <Text style={styles.text}>
        Type: <Text style={styles.type}>{request.requestType}</Text>
      </Text>

      <Text style={styles.text}>
        Submitted:{" "}
        <Text style={styles.timestamp}>{formatTimeAgo(request.createdAt)}</Text>
      </Text>

      {request.usersCount > 1 && (
        <Text style={styles.text}>
          +{request.usersCount - 1} more user{request.usersCount > 2 ? "s" : ""}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    margin: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    ...theme.shadow.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
    paddingVertical: 4,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary[700],
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  arrowIcon: {
    marginLeft: theme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radius.xl,
    minWidth: 80,
    alignItems: "center",
  },
  statusText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.bold,
  },
  text: {
    fontSize: theme.typography.fontSize.sm,
    marginBottom: 4,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  requestor: {
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.regular,
  },
  type: {
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.regular,
  },
  timestamp: {
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.regular,
  },
});

export default TaskRequestCard;
