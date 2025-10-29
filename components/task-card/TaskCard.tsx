import { TaskDTO } from '@/api/tasks/task.dto';
import { theme } from '@/constants/theme';
import moment from 'moment';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface TaskCardProps {
  task: TaskDTO;
}

function getRelativeFromNow(timestamp?: number): string {
  if (!timestamp) return 'Not set';
  const date = moment.unix(timestamp);
  return date.from(moment());
}

function getStatusColor(status?: string): string {
  const normalized = (status || '').toLowerCase();
  if (normalized === 'done' || normalized === 'completed')
    return theme.colors.success[500];
  if (normalized === 'in progress' || normalized === 'ongoing')
    return theme.colors.secondary[400];
  if (normalized === 'blocked') return theme.colors.error[500];
  return theme.colors.text.secondary;
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
          <Text style={styles.statusText}>{task?.status || 'Unknown'}</Text>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        </View>
      </View>

      <View style={styles.rows}>
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
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  rows: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  titleContainer: {
    width: '50%',
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
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: 6,
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
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
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
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.medium,
    maxWidth: 180,
    marginLeft: 6,
  },
  statusText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.medium,
    marginRight: theme.spacing.sm,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 2,
  },
});

export default TaskCard;
