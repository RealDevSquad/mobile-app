import { theme } from '@/constants/theme';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type TaskRequestActionsProps = {
  status: string;
  pendingAction: 'approve' | 'reject' | null;
  isPending: boolean;
  onApprove: () => void;
  onReject: () => void;
  isSuperUser?: boolean;
};

export const TaskRequestActions: React.FC<TaskRequestActionsProps> = ({
  status,
  pendingAction,
  isPending,
  onApprove,
  onReject,
  isSuperUser = false,
}) => {
  if (status !== 'PENDING' || !isSuperUser) {
    return null;
  }

  return (
    <View style={styles.actionContainer}>
      <TouchableOpacity
        style={[
          styles.actionButton,
          styles.rejectButton,
          (isPending || pendingAction === 'reject') && styles.disabledButton,
        ]}
        onPress={onReject}
        disabled={isPending || pendingAction === 'reject'}
      >
        {pendingAction === 'reject' && isPending ? (
          <ActivityIndicator color={theme.colors.text.inverted} size="small" />
        ) : (
          <Text style={styles.actionButtonText}>Reject</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.actionButton,
          styles.approveButton,
          (isPending || pendingAction === 'approve') && styles.disabledButton,
        ]}
        onPress={onApprove}
        disabled={isPending || pendingAction === 'approve'}
      >
        {pendingAction === 'approve' && isPending ? (
          <ActivityIndicator color={theme.colors.text.inverted} size="small" />
        ) : (
          <Text style={styles.actionButtonText}>Approve</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: 'row',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveButton: {
    backgroundColor: theme.colors.success[500],
  },
  rejectButton: {
    backgroundColor: theme.colors.error[500],
  },
  actionButtonText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.bold,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
