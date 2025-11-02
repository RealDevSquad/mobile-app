import { TaskDTO } from '@/api/tasks/task.dto';
import { getRelativeFromNow } from '@/common/utils/dateUtils';
import { theme } from '@/constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type TaskCardProps = {
  task: TaskDTO;
};

function getStatusColor(status?: string): string {
  const normalized = (status || '').toUpperCase();
  switch (normalized) {
    case 'ASSIGNED':
      return theme.colors.info[500]; // Blue
    case 'IN_PROGRESS':
      return theme.colors.secondary[500]; // Orange
    case 'IN_REVIEW':
      return theme.colors.warning[500]; // Amber/Yellow
    case 'DONE':
    case 'COMPLETED':
      return theme.colors.success[500]; // Green
    case 'BLOCKED':
      return theme.colors.error[500]; // Red
    default:
      return theme.colors.text.secondary;
  }
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const estimated = getRelativeFromNow(task?.endsOn);
  const started = getRelativeFromNow(task?.startedOn);
  const statusColor = getStatusColor(task?.status);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {task?.title || 'Untitled Task'}
          </Text>
        </View>
        <View style={styles.rightColumn}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {task?.status || 'Unknown'}
          </Text>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        </View>
      </View>

      <View style={styles.contentRow}>
        <View style={styles.leftColumn}>
          <Text style={styles.label}>
            Due <Text style={styles.strong}>{estimated}</Text>
          </Text>
          <Text style={styles.subtle}>
            Started <Text style={styles.strong}>{started}</Text>
          </Text>
          <View style={styles.assignedRow}>
            <Text style={[styles.label, styles.assignedLabel]}>
              Assigned to
            </Text>

            <Text style={styles.assigneeName} numberOfLines={1}>
              {task?.assignee || 'Unassigned'}
            </Text>
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
    </View>
  );
};

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
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingLeft: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginBottom: 4,
    fontFamily: theme.typography.fontFamily.regular,
  },
  assignedLabel: {
    marginBottom: 0,
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
  assignedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assigneeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing.xs,
  },
  assigneeName: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.medium,
    maxWidth: 180,
    marginLeft: 4,
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
  arrowContainer: {
    alignSelf: 'flex-end',
    marginTop: theme.spacing.xs,
  },
});

export default TaskCard;
