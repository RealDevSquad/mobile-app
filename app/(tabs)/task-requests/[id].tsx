import { TaskRequestsApi } from '@/api/task-requests/task-requests.api';
import { UsersApi } from '@/api/users/users.api';
import { formatDate, formatDateTime } from '@/common/utils/dateUtils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return '#FFA500';
    case 'APPROVED':
      return '#4CAF50';
    case 'REJECTED':
      return '#F44336';
    default:
      return '#666';
  }
};

export default function TaskRequestDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const router = useRouter();

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
            updateTaskRequestMutation.mutate({
              taskRequestId: taskRequest.id,
              action: 'reject',
            });
          },
        },
      ]
    );
  };

  const formatDateFromTimestamp = (timestamp: number) => {
    const unixTimestamp =
      timestamp > 1000000000000 ? Math.floor(timestamp / 1000) : timestamp;
    return formatDate(unixTimestamp);
  };

  const formatDateTimeFromTimestamp = (timestamp: number) => {
    const unixTimestamp =
      timestamp > 1000000000000 ? Math.floor(timestamp / 1000) : timestamp;
    return formatDateTime(unixTimestamp);
  };

  const handleExternalLink = (url: string) => {
    Linking.openURL(url);
  };

  if (loading || userLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading task request...</Text>
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
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header */}
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

          {/* Request Info */}
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

          {/* Timeline */}
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

          {/* External Links */}
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

          {/* Additional Users */}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {taskRequest.status === 'PENDING' && (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.rejectButton,
              updateTaskRequestMutation.isPending && styles.disabledButton,
            ]}
            onPress={handleReject}
            disabled={updateTaskRequestMutation.isPending}
          >
            {updateTaskRequestMutation.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.actionButtonText}>Reject</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.approveButton,
              updateTaskRequestMutation.isPending && styles.disabledButton,
            ]}
            onPress={handleApprove}
            disabled={updateTaskRequestMutation.isPending}
          >
            {updateTaskRequestMutation.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#1D1283',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  linkButton: {
    backgroundColor: '#1D1283',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  userName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  userStatus: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
