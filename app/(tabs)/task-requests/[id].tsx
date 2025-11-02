import { TaskRequestsApi } from '@/api/task-requests/task-requests.api';
import { UsersApi } from '@/api/users/users.api';
import { formatDate, formatDateTime } from '@/common/utils/dateUtils';
import { TaskDetailsSkeleton } from '@/components/SkeletonLoader';
import { theme } from '@/constants/theme';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialTabBar, Tabs } from 'react-native-collapsible-tab-view';

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

export default function TaskRequestDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [pendingAction, setPendingAction] = React.useState<
    'approve' | 'reject' | null
  >(null);

  const {
    data: taskRequest,
    isLoading: loading,
    isError,
    error,
  } = useQuery({
    queryKey: TaskRequestsApi.getTaskRequestById.key(id || ''),
    queryFn: () => TaskRequestsApi.getTaskRequestById.fn(id!),
    enabled: !!id,
  });

  const { data: primaryUserDetails, isLoading: userLoading } = useQuery({
    queryKey: UsersApi.getUserById.key(taskRequest?.users?.[0]?.userId || ''),
    queryFn: () => UsersApi.getUserById.fn(taskRequest!.users[0].userId),
    enabled: !!taskRequest?.users?.[0]?.userId,
  });

  const updateTaskRequestMutation = useMutation({
    mutationFn: ({
      taskRequestId,
      userId,
      action,
    }: {
      taskRequestId: string;
      userId?: string;
      action: 'approve' | 'reject';
    }) => {
      return TaskRequestsApi.updateTaskRequestStatus.fn({
        taskRequestId,
        userId,
        action,
      });
    },
    onSuccess: (data, variables) => {
      setPendingAction(null);
      queryClient.invalidateQueries({
        queryKey: TaskRequestsApi.getTaskRequestById.key(id || ''),
      });
      queryClient.invalidateQueries({
        queryKey: TaskRequestsApi.getTaskRequests.key({ status: 'PENDING' }),
      });

      const actionText =
        variables.action === 'approve' ? 'approved' : 'rejected';
      Alert.alert('Success', `Task request ${actionText} successfully`);
      router.back();
    },
    onError: (error: any, variables) => {
      setPendingAction(null);
      const actionText = variables.action === 'approve' ? 'approve' : 'reject';
      Alert.alert('Error', `Failed to ${actionText} task request`);
    },
  });

  const handleApprove = () => {
    if (!taskRequest) return;

    const userId =
      taskRequest.users?.[0]?.userId || taskRequest.requestors?.[0] || '';

    if (!userId) {
      Alert.alert('Error', 'Unable to identify the user for this request');
      return;
    }

    Alert.alert(
      'Approve Task Request',
      'Are you sure you want to approve this task request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => {
            setPendingAction('approve');
            updateTaskRequestMutation.mutate({
              taskRequestId: taskRequest.id,
              userId,
              action: 'approve',
            });
          },
        },
      ]
    );
  };

  const handleReject = () => {
    if (!taskRequest) return;

    Alert.alert(
      'Reject Task Request',
      'Are you sure you want to reject this task request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            setPendingAction('reject');
            updateTaskRequestMutation.mutate({
              taskRequestId: taskRequest.id,
              action: 'reject',
            });
          },
        },
      ]
    );
  };

  const formatDateFromTimestamp = (timestamp?: number) => {
    if (!timestamp || timestamp <= 0 || Number.isNaN(timestamp)) {
      return 'Not set';
    }
    const unixTimestamp =
      timestamp > 1000000000000 ? Math.floor(timestamp / 1000) : timestamp;
    return formatDate(unixTimestamp);
  };

  const formatDateTimeFromTimestamp = (timestamp?: number) => {
    if (!timestamp || timestamp <= 0 || Number.isNaN(timestamp)) {
      return 'Not set';
    }
    const unixTimestamp =
      timestamp > 1000000000000 ? Math.floor(timestamp / 1000) : timestamp;
    return formatDateTime(unixTimestamp);
  };

  const handleExternalLink = (url: string) => {
    Linking.openURL(url);
  };

  const renderTabBar = (props: any) => (
    <MaterialTabBar
      {...props}
      indicatorStyle={styles.tabIndicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
      activeColor={theme.colors.primary[600]}
      inactiveColor={theme.colors.text.secondary}
    />
  );

  if (loading || userLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Tabs.Container renderTabBar={renderTabBar} tabBarHeight={50}>
          <Tabs.Tab name="Task Request">
            <Tabs.ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              <TaskDetailsSkeleton />
            </Tabs.ScrollView>
          </Tabs.Tab>
        </Tabs.Container>
      </SafeAreaView>
    );
  }

  if (isError || !taskRequest) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error?.message || 'Task request not found'}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            queryClient.invalidateQueries({
              queryKey: TaskRequestsApi.getTaskRequestById.key(id || ''),
            });
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Container renderTabBar={renderTabBar} tabBarHeight={50}>
        <Tabs.Tab name="Task Request">
          <Tabs.ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.title}>{taskRequest.taskTitle}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(taskRequest.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{taskRequest.status}</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Request Details</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Requested by:</Text>
                  <Text style={styles.value}>
                    {primaryUserDetails?.user.username}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Request Type:</Text>
                  <Text style={styles.value}>{taskRequest.requestType}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Created:</Text>
                  <Text style={styles.value}>
                    {formatDateTimeFromTimestamp(taskRequest.createdAt)}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Last Modified:</Text>
                  <Text style={styles.value}>
                    {formatDateTimeFromTimestamp(taskRequest.lastModifiedAt)}
                  </Text>
                </View>
              </View>

              {taskRequest.users[0]?.proposedStartDate &&
                taskRequest.users[0]?.proposedDeadline && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Proposed Timeline</Text>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Start Date:</Text>
                      <Text style={styles.value}>
                        {formatDateFromTimestamp(
                          taskRequest.users[0].proposedStartDate
                        )}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Deadline:</Text>
                      <Text style={styles.value}>
                        {formatDateFromTimestamp(
                          taskRequest.users[0].proposedDeadline
                        )}
                      </Text>
                    </View>
                  </View>
                )}

              {taskRequest.externalIssueUrl && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>External Links</Text>
                  <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() =>
                      handleExternalLink(taskRequest.externalIssueUrl!)
                    }
                  >
                    <Text style={styles.linkText}>View GitHub Issue</Text>
                  </TouchableOpacity>
                  {taskRequest.externalIssueHtmlUrl && (
                    <TouchableOpacity
                      style={styles.linkButton}
                      onPress={() =>
                        handleExternalLink(taskRequest.externalIssueHtmlUrl!)
                      }
                    >
                      <Text style={styles.linkText}>View on GitHub</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>

      {taskRequest.status === 'PENDING' && (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.rejectButton,
              (updateTaskRequestMutation.isPending ||
                pendingAction === 'reject') &&
                styles.disabledButton,
            ]}
            onPress={handleReject}
            disabled={
              updateTaskRequestMutation.isPending || pendingAction === 'reject'
            }
          >
            {pendingAction === 'reject' &&
            updateTaskRequestMutation.isPending ? (
              <ActivityIndicator
                color={theme.colors.text.inverted}
                size="small"
              />
            ) : (
              <Text style={styles.actionButtonText}>Reject</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.approveButton,
              (updateTaskRequestMutation.isPending ||
                pendingAction === 'approve') &&
                styles.disabledButton,
            ]}
            onPress={handleApprove}
            disabled={
              updateTaskRequestMutation.isPending || pendingAction === 'approve'
            }
          >
            {pendingAction === 'approve' &&
            updateTaskRequestMutation.isPending ? (
              <ActivityIndicator
                color={theme.colors.text.inverted}
                size="small"
              />
            ) : (
              <Text style={styles.actionButtonText}>Approve</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.error[600],
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    fontFamily: theme.typography.fontFamily.regular,
  },
  retryButton: {
    backgroundColor: theme.colors.primary[600],
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
  },
  retryButtonText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.bold,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
  },
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
  section: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadow.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  value: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
    flex: 2,
    textAlign: 'right',
  },
  description: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.primary,
    lineHeight:
      theme.typography.lineHeight.normal * theme.typography.fontSize.xs,
  },
  linkButton: {
    backgroundColor: theme.colors.primary[600],
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs + 12,
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.sm,
  },
  linkText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.bold,
    textAlign: 'center',
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  userName: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  userStatus: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.regular,
    textTransform: 'uppercase',
  },
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
  tabBar: {
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
    paddingHorizontal: theme.spacing.md,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    textTransform: 'none',
    marginHorizontal: theme.spacing.xs,
  },
  tabIndicator: {
    backgroundColor: theme.colors.primary[600],
    height: 3,
    borderRadius: 2,
  },
});
