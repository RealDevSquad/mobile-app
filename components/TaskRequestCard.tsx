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
        return "#FFA500";
      case "APPROVED":
        return "#4CAF50";
      case "REJECTED":
        return "#F44336";
      default:
        return "#666";
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
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 16,
    margin: 12,
    backgroundColor: "white",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 4,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1D1283",
    flex: 1,
    marginRight: 8,
  },
  arrowIcon: {
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    alignItems: "center",
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: "bold",
    color: "#333",
  },
  requestor: {
    color: "grey",
    fontWeight: "normal",
  },
  type: {
    color: "grey",
    fontWeight: "normal",
  },
  timestamp: {
    color: "grey",
    fontWeight: "normal",
  },
});

export default TaskRequestCard;
