import { theme } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type TaskRequestDetailsHeaderProps = {
  title: string;
  status: string;
};

const getStatusColor = (status: string) => {
  switch (status) {
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
};

export const TaskRequestDetailsHeader: React.FC<
  TaskRequestDetailsHeaderProps
> = ({ title, status }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(status) },
        ]}
      >
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  title: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
    minWidth: 70,
    alignItems: 'center',
  },
  statusText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.bold,
  },
});
