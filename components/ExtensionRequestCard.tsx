import { ExtensionRequestDTO } from "@/types/extension-request.dto";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import moment from "moment";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ExtensionRequestCardProps {
  request: ExtensionRequestDTO;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

const ExtensionRequestCard: React.FC<ExtensionRequestCardProps> = ({
  request,
  onApprove,
  onReject,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const formatTimeAgo = (timestamp: number) => {
    const currentDate = moment();
    const endDate = moment.unix(timestamp);
    return endDate.from(currentDate);
  };

  const formatDate = (timestamp: number) => {
    return moment.unix(timestamp).format("MMM DD, YYYY");
  };

  const handleApprove = async () => {
    Alert.alert(
      "Approve Extension Request",
      "Are you sure you want to approve this extension request?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          style: "default",
          onPress: async () => {
            setIsApproving(true);
            try {
              await onApprove(request.id);
              Alert.alert(
                "Success",
                "Extension request approved successfully."
              );
            } catch (error) {
              Alert.alert("Error", "Failed to approve extension request.");
            } finally {
              setIsApproving(false);
            }
          },
        },
      ]
    );
  };

  const handleReject = async () => {
    Alert.alert(
      "Reject Extension Request",
      "Are you sure you want to reject this extension request?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            setIsRejecting(true);
            try {
              await onReject(request.id);
              Alert.alert(
                "Success",
                "Extension request rejected successfully."
              );
            } catch (error) {
              Alert.alert("Error", "Failed to reject extension request.");
            } finally {
              setIsRejecting(false);
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "#FFA500";
      case "APPROVED":
        return "#4CAF50";
      case "REJECTED":
      case "DENIED":
        return "#F44336";
      default:
        return "#666";
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setIsExpanded(!isExpanded)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{request.title}</Text>
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
          name="chevron-down"
          size={20}
          color="#666"
          style={[
            styles.arrowIcon,
            { transform: [{ rotate: isExpanded ? "180deg" : "0deg" }] },
          ]}
        />
      </View>

      <Text style={styles.text}>
        Assignee: <Text style={styles.assignee}>{request.assignee}</Text>
      </Text>

      <Text style={styles.text}>Request #{request.requestNumber}</Text>

      <Text style={styles.text}>
        Old End Date:{" "}
        <Text style={styles.date}>{formatDate(request.oldEndsOn)}</Text>
      </Text>

      <Text style={styles.text}>
        New End Date:{" "}
        <Text style={styles.date}>{formatDate(request.newEndsOn)}</Text>
      </Text>

      <Text style={styles.text}>
        Reason:{" "}
        <Text style={styles.reason}>
          {isExpanded ? request.reason : truncateText(request.reason, 100)}
        </Text>
      </Text>

      {isExpanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.text}>
            Task ID: <Text style={styles.taskId}>{request.taskId}</Text>
          </Text>

          <Text style={styles.text}>
            Submitted:{" "}
            <Text style={styles.timestamp}>
              {formatTimeAgo(request.timestamp)}
            </Text>
          </Text>

          {request.status === "PENDING" && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.approveButton,
                  (isApproving || isRejecting) && styles.disabledButton,
                ]}
                onPress={handleApprove}
                disabled={isApproving || isRejecting}
              >
                {isApproving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Approve</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.rejectButton,
                  (isApproving || isRejecting) && styles.disabledButton,
                ]}
                onPress={handleReject}
                disabled={isApproving || isRejecting}
              >
                {isRejecting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Reject</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
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
    fontSize: 18,
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
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "bold",
    color: "#333",
  },
  assignee: {
    color: "grey",
    fontWeight: "normal",
  },
  date: {
    color: "grey",
    fontWeight: "normal",
  },
  reason: {
    color: "grey",
    fontWeight: "normal",
    lineHeight: 20,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  taskId: {
    color: "grey",
    fontWeight: "normal",
    fontFamily: "monospace",
  },
  timestamp: {
    color: "grey",
    fontWeight: "normal",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  approveButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default ExtensionRequestCard;
