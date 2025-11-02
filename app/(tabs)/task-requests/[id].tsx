import { TaskRequestsApi } from '@/api/task-requests/task-requests.api';
import { UsersApi } from '@/api/users/users.api';
import { ErrorState } from '@/components/ErrorState';
import { theme } from '@/constants/theme';
import { TaskRequestActions } from '@/modules/task-request-details/TaskRequestActions';
import { TaskRequestDetailsContent } from '@/modules/task-request-details/TaskRequestDetailsContent';
import { TaskRequestLoadingState } from '@/modules/task-request-details/TaskRequestLoadingState';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import { MaterialTabBar, Tabs } from 'react-native-collapsible-tab-view';

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
    return <TaskRequestLoadingState />;
  }

  if (isError || !taskRequest) {
    const handleRetry = () => {
      queryClient.invalidateQueries({
        queryKey: TaskRequestsApi.getTaskRequestById.key(id || ''),
      });
    };

    return (
      <ErrorState
        errorMessage={error?.message}
        defaultMessage="Task request not found"
        onRetry={handleRetry}
        wrapInSafeArea={false}
      />
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
            <TaskRequestDetailsContent
              taskRequest={taskRequest}
              primaryUserDetails={primaryUserDetails}
            />
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>

      <TaskRequestActions
        status={taskRequest.status}
        pendingAction={pendingAction}
        isPending={updateTaskRequestMutation.isPending}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
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
