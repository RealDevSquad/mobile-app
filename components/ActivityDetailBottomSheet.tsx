import { theme } from '@/constants/theme';
import { DateActivities, LogEntry } from '@/types/logs.dto';
import { createActivitySummary, formatTimestamp } from '@/utils/calendarUtils';
import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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
        case 'task':
          return '#007AFF';
        case 'taskRequests':
          return '#34C759';
        case 'oooRequests':
          return '#FF9500';
        case 'extensionRequests':
          return '#FF3B30';
        default:
          return '#8E8E93';
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
        {log.type === 'task' && (
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

        {log.type === 'taskRequests' && (
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

        {log.type === 'extensionRequests' && (
          <>
            {log.status && (
              <Text style={styles.logDetail}>Status: {log.status}</Text>
            )}
            {log.newEndsOn && log.oldEndsOn && (
              <Text style={styles.logDetail}>
                Date: {new Date(log.oldEndsOn * 1000).toLocaleDateString()} →{' '}
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

        {log.type === 'oooRequests' && (
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
            Activities for{' '}
            {new Date(activities.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
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
    backgroundColor: theme.colors.surface.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: theme.spacing.md,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.secondary,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  activityGroup: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  groupTitle: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.inverted,
  },
  groupCount: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.inverted,
  },
  groupContent: {
    padding: theme.spacing.md,
  },
  logItem: {
    backgroundColor: theme.colors.surface.secondary,
    padding: 0,
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
  },
  logHeader: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  logDetails: {
    padding: theme.spacing.md,
    paddingTop: 0,
  },
  taskInfo: {
    marginBottom: theme.spacing.sm,
  },
  taskLink: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.info[500],
    fontStyle: 'italic',
    marginTop: 2,
  },
  logTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  logDetail: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  logTime: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.tertiary,
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default ActivityDetailBottomSheet;
