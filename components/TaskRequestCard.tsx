import { TaskRequestDTO } from '@/api/task-requests/task-request.dto';
import { formatTimeAgo, getRelativeFromNow } from '@/common/utils/dateUtils';
import { theme } from '@/constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TaskRequestCardProps = {
  request: TaskRequestDTO;
  onPress: (id: string) => void;
};

function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return theme.colors.warning[500];
    case 'APPROVED':
      return theme.colors.success[500];
    case 'REJECTED':
    case 'DENIED':
      return theme.colors.error[500];
    default:
      return theme.colors.text.secondary;
  }
}

const TaskRequestCard: React.FC<TaskRequestCardProps> = React.memo(
  ({ request, onPress }) => {
    const getRequestorName = () => {
      if (request.users && request.users.length > 0) {
        const user = request.users[0];
        if (user.first_name && user.last_name) {
          return `${user.first_name} ${user.last_name}`;
        }
        return user.username || 'Unknown User';
      }
      return 'Unknown User';
    };

    const convertToSeconds = (timestamp: number): number => {
      // If timestamp is in milliseconds (greater than year 2286 in seconds)
      return timestamp > 1000000000000
        ? Math.floor(timestamp / 1000)
        : timestamp;
    };

    const getProposedDates = () => {
      if (request.users && request.users.length > 0) {
        const user = request.users[0];
        const startDate = user.proposedStartDate
          ? getRelativeFromNow(convertToSeconds(user.proposedStartDate))
          : null;
        const deadline = user.proposedDeadline
          ? getRelativeFromNow(convertToSeconds(user.proposedDeadline))
          : null;
        return { startDate, deadline };
      }
      return { startDate: null, deadline: null };
    };

    const formatCreatedAt = () => {
      const timestamp = convertToSeconds(request.createdAt);
      return formatTimeAgo(timestamp);
    };

    const { startDate, deadline } = getProposedDates();
    const statusColor = getStatusColor(request.status);
    const requestorName = getRequestorName();

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress(request.id)}
        activeOpacity={0.7}
      >
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {request.taskTitle || 'Untitled Request'}
            </Text>
          </View>
          <View style={styles.rightColumn}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {request.status === 'DENIED' ? 'REJECTED' : request.status}
            </Text>
            <View
              style={[styles.statusDot, { backgroundColor: statusColor }]}
            />
          </View>
        </View>

        <View style={styles.contentRow}>
          <View style={styles.leftColumn}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>
                Requested by <Text style={styles.strong}>{requestorName}</Text>
              </Text>
            </View>

            {startDate && (
              <Text style={styles.subtle}>
                Start <Text style={styles.strong}>{startDate}</Text>
              </Text>
            )}

            {deadline && (
              <Text style={styles.subtle}>
                Deadline <Text style={styles.strong}>{deadline}</Text>
              </Text>
            )}

            <View style={styles.metaRow}>
              <Text style={styles.subtle}>
                Submitted <Text style={styles.strong}>{formatCreatedAt()}</Text>
              </Text>
              {request.usersCount > 1 && (
                <Text style={styles.userCount}>
                  +{request.usersCount - 1} more
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.arrowContainer}>
          <FontAwesome
            name="chevron-right"
            size={14}
            color={theme.colors.text.secondary}
          />
        </View>
      </TouchableOpacity>
    );
  }
);

TaskRequestCard.displayName = 'TaskRequestCard';

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.sm,
    marginVertical: theme.spacing.xs,
    backgroundColor: theme.colors.background.primary,
    ...theme.shadow.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  titleContainer: {
    width: '60%',
    paddingRight: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingLeft: theme.spacing.md,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.medium,
    marginRight: theme.spacing.xs,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 2,
  },
  label: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginBottom: 4,
    fontFamily: theme.typography.fontFamily.regular,
  },
  strong: {
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  subtle: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginBottom: 4,
    fontFamily: theme.typography.fontFamily.regular,
  },
  infoRow: {
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  userCount: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary[600],
    fontFamily: theme.typography.fontFamily.medium,
    marginLeft: theme.spacing.xs,
  },
  arrowContainer: {
    alignSelf: 'flex-end',
    marginTop: theme.spacing.xs,
  },
});

export default TaskRequestCard;
