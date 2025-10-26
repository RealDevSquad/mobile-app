import { DateActivities, LogEntry } from "@/types/logs.dto";
import { createActivitySummary, formatTimestamp } from "@/utils/calendarUtils";
import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ActivityDetailBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  activities: DateActivities | null;
}

const ActivityDetailBottomSheet: React.FC<ActivityDetailBottomSheetProps> = ({
  visible,
  onClose,
  activities,
}) => {
  if (!activities) return null;

  const renderLogEntry = (log: LogEntry) => {
    const summary = createActivitySummary(log);
    const getActivityColor = (type: string) => {
      switch (type) {
        case "task":
          return "#007AFF";
        case "taskRequests":
          return "#34C759";
        case "oooRequests":
          return "#FF9500";
        case "extensionRequests":
          return "#FF3B30";
        default:
          return "#8E8E93";
      }
    };

    return (
      <View key={`${log.type}-${log.timestamp}`} style={styles.logItem}>
        <View
          style={[
            styles.logHeader,
            { backgroundColor: getActivityColor(log.type) },
          ]}
        >
          <Text style={styles.logTitle}>{summary}</Text>
        </View>

        {log.taskTitle && (
          <View style={styles.taskInfo}>
            <Text style={styles.logDetail}>Task: {log.taskTitle}</Text>
            {log.taskId && (
              <Text style={styles.taskLink}>Task ID: {log.taskId}</Text>
            )}
          </View>
        )}

        {/* Type-specific details */}
        {log.type === "task" && (
          <>
            {log.status && (
              <Text style={styles.logDetail}>Status: {log.status}</Text>
            )}
            {log.percentCompleted !== undefined && (
              <Text style={styles.logDetail}>
                Progress: {log.percentCompleted}%
              </Text>
            )}
            {log.endsOn && (
              <Text style={styles.logDetail}>
                Ends On: {new Date(log.endsOn * 1000).toLocaleDateString()}
              </Text>
            )}
          </>
        )}

        {log.type === "taskRequests" && (
          <>
            {log.requestType && (
              <Text style={styles.logDetail}>Type: {log.requestType}</Text>
            )}
            {log.status && (
              <Text style={styles.logDetail}>Status: {log.status}</Text>
            )}
            {log.approvedTo && (
              <Text style={styles.logDetail}>
                Approved To: {log.approvedTo}
              </Text>
            )}
          </>
        )}

        {log.type === "extensionRequests" && (
          <>
            {log.status && (
              <Text style={styles.logDetail}>Status: {log.status}</Text>
            )}
            {log.newEndsOn && log.oldEndsOn && (
              <Text style={styles.logDetail}>
                Date: {new Date(log.oldEndsOn * 1000).toLocaleDateString()} →{" "}
                {new Date(log.newEndsOn * 1000).toLocaleDateString()}
              </Text>
            )}
            {log.newReason && log.oldReason && (
              <Text style={styles.logDetail}>
                Reason: {log.oldReason} → {log.newReason}
              </Text>
            )}
            {log.newTitle && log.oldTitle && (
              <Text style={styles.logDetail}>
                Title: {log.oldTitle} → {log.newTitle}
              </Text>
            )}
          </>
        )}

        {log.type === "oooRequests" && (
          <>
            {log.status && (
              <Text style={styles.logDetail}>Status: {log.status}</Text>
            )}
            {log.startDate && (
              <Text style={styles.logDetail}>
                Start: {new Date(log.startDate * 1000).toLocaleDateString()}
              </Text>
            )}
            {log.endDate && (
              <Text style={styles.logDetail}>
                End: {new Date(log.endDate * 1000).toLocaleDateString()}
              </Text>
            )}
            {log.reason && (
              <Text style={styles.logDetail}>Reason: {log.reason}</Text>
            )}
          </>
        )}

        <View style={styles.logDetails}>
          <Text style={styles.logTime}>{formatTimestamp(log.timestamp)}</Text>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Activities for{" "}
            {new Date(activities.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activities.activities.map((group) => (
            <View key={group.type} style={styles.activityGroup}>
              <View
                style={[styles.groupHeader, { backgroundColor: group.color }]}
              >
                <Text style={styles.groupTitle}>{group.label}</Text>
                <Text style={styles.groupCount}>({group.logs.length})</Text>
              </View>

              <View style={styles.groupContent}>
                {group.logs.map(renderLogEntry)}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    flex: 1,
    marginRight: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  activityGroup: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    overflow: "hidden",
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  groupCount: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  groupContent: {
    padding: 16,
  },
  logItem: {
    backgroundColor: "#F8F9FA",
    padding: 0,
    borderRadius: 6,
    marginBottom: 8,
    overflow: "hidden",
  },
  logHeader: {
    padding: 12,
    paddingBottom: 8,
  },
  logDetails: {
    padding: 12,
    paddingTop: 0,
  },
  taskInfo: {
    marginBottom: 8,
  },
  taskLink: {
    fontSize: 12,
    color: "#007AFF",
    fontStyle: "italic",
    marginTop: 2,
  },
  logTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  logDetail: {
    fontSize: 13,
    color: "#666666",
    marginBottom: 2,
  },
  logTime: {
    fontSize: 12,
    color: "#999999",
    marginTop: 4,
    fontStyle: "italic",
  },
});

export default ActivityDetailBottomSheet;
