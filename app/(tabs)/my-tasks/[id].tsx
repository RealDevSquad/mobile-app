import { ExtensionRequestsApi } from '@/api/extension-requests/extension-requests.api';
import { TasksApi } from '@/api/tasks/tasks.api';
import { theme } from '@/constants/theme';
import useCheckUserSession from '@/hooks/getUserToken';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import moment from 'moment';
import React, { lazy, Suspense, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const AddProgressModal = lazy(
  () => import('@/components/Modal/AddProgressModal')
);
const ExtensionRequestDetailsModal = lazy(
  () => import('@/components/Modal/ExtensionRequestDetailsModal')
);
const ExtensionRequestModal = lazy(
  () => import('@/components/Modal/ExtensionRequestModal')
);
const UpdateTaskStatusModal = lazy(
  () => import('@/components/Modal/UpdateTaskStatusModal')
);

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useCheckUserSession();
  const queryClient = useQueryClient();
  const [expandedUpdate, setExpandedUpdate] = useState<string | null>(null);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [showExtensionDetailsModal, setShowExtensionDetailsModal] =
    useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [showAddProgressModal, setShowAddProgressModal] = useState(false);

  const {
    data: taskDetails,
    isLoading: loading,
    isError: taskError,
    error: taskErrorDetails,
  } = useQuery({
    queryKey: TasksApi.getTaskDetails.key(id || ''),
    queryFn: () => TasksApi.getTaskDetails.fn(id!),
    enabled: !!token && !!id,
  });

  const {
    data: progressUpdatesData,
    isLoading: progressLoading,
    isError: progressError,
    error: progressErrorDetails,
  } = useQuery({
    queryKey: TasksApi.getTaskProgress.key(id || ''),
    queryFn: () => TasksApi.getTaskProgress.fn(id!),
    enabled: !!token && !!id,
  });

  const { data: extensionRequestsData, isLoading: extensionRequestsLoading } =
    useQuery({
      queryKey: ExtensionRequestsApi.getSelfExtensionRequests.key({
        taskId: id || '',
      }),
      queryFn: () =>
        ExtensionRequestsApi.getSelfExtensionRequests.fn(
          { taskId: id! },
          token || undefined
        ),
      enabled: !!token && !!id,
    });

  const progressUpdates = progressUpdatesData?.data || [];
  const extensionRequests = extensionRequestsData?.allExtensionRequests || [];
  const hasPendingExtension = extensionRequests.some(
    (request) => request.status === 'PENDING'
  );
  const pendingExtensionDetails = extensionRequests.find(
    (request) => request.status === 'PENDING'
  );

  let error: string | null = null;
  if (taskError) {
    error = taskErrorDetails?.message || null;
  } else if (progressError) {
    error = progressErrorDetails?.message || null;
  }

  const formatDate = (timestamp: number) => {
    return moment.unix(timestamp).format('MMM DD, YYYY');
  };

  const formatDateTime = (timestamp: number) => {
    return moment.unix(timestamp).format('MMM DD, YYYY [at] h:mm A');
  };

  const formatTimeAgo = (timestamp: number) => {
    return moment(timestamp).fromNow();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ASSIGNED':
        return theme.colors.warning[500];
      case 'IN_PROGRESS':
        return theme.colors.info[500];
      case 'VERIFIED':
        return theme.colors.success[500];
      case 'COMPLETED':
        return theme.colors.success[500];
      case 'BLOCKED':
        return theme.colors.error[500];
      default:
        return theme.colors.gray[500];
    }
  };

  const handleExternalLink = (url: string) => {
    Linking.openURL(url);
  };

  const toggleExpanded = (updateId: string) => {
    setExpandedUpdate(expandedUpdate === updateId ? null : updateId);
  };

  const handleExtensionRequestSubmit = () => {
    setShowExtensionModal(false);

    queryClient.invalidateQueries({
      queryKey: ExtensionRequestsApi.getSelfExtensionRequests.key({
        taskId: id || '',
      }),
    });
  };

  const handleExtensionRequestClick = () => {
    if (hasPendingExtension && pendingExtensionDetails) {
      setShowExtensionDetailsModal(true);
    } else {
      setShowExtensionModal(true);
    }
  };

  const handleUpdateStatusSubmit = () => {
    setShowUpdateStatusModal(false);
  };

  const handleAddProgressSubmit = () => {
    setShowAddProgressModal(false);
  };

  const renderProgressContent = () => {
    if (progressLoading) {
      return (
        <View style={styles.progressLoading}>
          <ActivityIndicator size="small" color={theme.colors.text.secondary} />
          <Text style={styles.progressLoadingText}>Loading updates...</Text>
        </View>
      );
    }

    if (progressUpdates.length === 0) {
      return (
        <Text style={styles.noProgressText}>No progress updates available</Text>
      );
    }

    return progressUpdates.map((update, index) => {
      const isExpanded = expandedUpdate === update.id;

      return (
        <View key={update.id} style={styles.progressCard}>
          <TouchableOpacity
            style={styles.progressCardHeader}
            onPress={() => toggleExpanded(update.id)}
            activeOpacity={0.7}
          >
            <View style={styles.progressCardTitle}>
              <Text style={styles.progressCardTitleText}>
                Progress Update {progressUpdates.length - index}
              </Text>
              <Text style={styles.progressCardSubtitle}>
                {formatTimeAgo(update.createdAt)} • {update.userData.first_name}{' '}
                {update.userData.last_name}
              </Text>
            </View>
            <View style={styles.progressCardActions}>
              <Image
                source={{ uri: update.userData.picture.url }}
                style={styles.progressCardAvatar}
                placeholder="blurhash"
                contentFit="cover"
              />
              <FontAwesome
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={theme.colors.text.secondary}
                style={styles.progressCardChevron}
              />
            </View>
          </TouchableOpacity>

          {isExpanded && (
            <View style={styles.progressCardContent}>
              {update.completed && (
                <View style={styles.progressDetailItem}>
                  <View style={styles.progressDetailHeader}>
                    <FontAwesome
                      name="check-circle"
                      size={14}
                      color={theme.colors.success[500]}
                    />
                    <Text style={styles.progressDetailLabel}>Completed</Text>
                  </View>
                  <Text style={styles.progressDetailText}>
                    {update.completed}
                  </Text>
                </View>
              )}

              {update.planned && (
                <View style={styles.progressDetailItem}>
                  <View style={styles.progressDetailHeader}>
                    <FontAwesome
                      name="calendar"
                      size={14}
                      color={theme.colors.info[500]}
                    />
                    <Text style={styles.progressDetailLabel}>Planned</Text>
                  </View>
                  <Text style={styles.progressDetailText}>
                    {update.planned}
                  </Text>
                </View>
              )}

              {update.blockers && (
                <View style={styles.progressDetailItem}>
                  <View style={styles.progressDetailHeader}>
                    <FontAwesome
                      name="exclamation-triangle"
                      size={14}
                      color={theme.colors.warning[500]}
                    />
                    <Text style={styles.progressDetailLabel}>Blockers</Text>
                  </View>
                  <Text style={styles.progressDetailText}>
                    {update.blockers}
                  </Text>
                </View>
              )}

              {!update.completed && !update.planned && !update.blockers && (
                <View style={styles.progressDetailItem}>
                  <Text style={styles.progressDetailText}>
                    No specific details provided
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      );
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary[600]} />
        <Text style={styles.loadingText}>Loading task details...</Text>
      </SafeAreaView>
    );
  }

  if (error || !taskDetails) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || 'Task details not found'}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            queryClient.invalidateQueries({
              queryKey: TasksApi.getTaskDetails.key(id || ''),
            });
            queryClient.invalidateQueries({
              queryKey: TasksApi.getTaskProgress.key(id || ''),
            });
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const task = taskDetails.taskData;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{task.title}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(task.status) },
              ]}
            >
              <Text style={styles.statusText}>{task.status}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.taskDetailsHeader}>
              <Text style={styles.sectionTitle}>Task Details</Text>
              <TouchableOpacity
                style={styles.updateStatusButton}
                onPress={() => setShowUpdateStatusModal(true)}
              >
                <Text style={styles.updateStatusButtonText}>Update Task</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Assignee:</Text>
              <Text style={styles.value}>{task.assignee}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Type:</Text>
              <Text style={styles.value}>{task.type}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Priority:</Text>
              <Text style={styles.value}>{task.priority}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Created:</Text>
              <Text style={styles.value}>{formatDateTime(task.createdAt)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Last Updated:</Text>
              <Text style={styles.value}>{formatDateTime(task.updatedAt)}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.timelineHeader}>
              <Text style={styles.sectionTitle}>Timeline</Text>
              <TouchableOpacity
                style={[
                  styles.extensionRequestButton,
                  extensionRequestsLoading &&
                    styles.extensionRequestButtonDisabled,
                ]}
                onPress={handleExtensionRequestClick}
                disabled={extensionRequestsLoading}
              >
                {extensionRequestsLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.text.inverted}
                  />
                ) : (
                  <Text style={styles.extensionRequestButtonText}>
                    {hasPendingExtension ? 'ER Pending' : 'Raise an ER'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Started On:</Text>
              <Text style={styles.value}>{formatDate(task.startedOn)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Deadline:</Text>
              <Text style={styles.value}>{formatDate(task.endsOn)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Progress:</Text>
              <Text style={[styles.value, styles.progressText]}>
                {task.percentCompleted}%
              </Text>
            </View>
          </View>

          {task.github?.issue?.url && (
            <View style={styles.section}>
              <View style={styles.githubLinkRow}>
                <Text style={styles.githubLinkLabel}>GitHub Link</Text>
                <TouchableOpacity
                  style={styles.githubLinkButton}
                  onPress={() => handleExternalLink(task.github.issue.url)}
                >
                  <Text style={styles.githubLinkButtonText}>Open</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {task.dependsOn && task.dependsOn.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Dependencies ({task.dependsOn.length})
              </Text>
              {task.dependsOn.map((dependency) => (
                <View key={dependency} style={styles.dependencyItem}>
                  <Text style={styles.dependencyText}>{dependency}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <View style={styles.progressHeader}>
              <Text style={styles.sectionTitle}>Progress Updates</Text>
              <TouchableOpacity
                style={styles.addProgressButton}
                onPress={() => setShowAddProgressModal(true)}
              >
                <Text style={styles.addProgressButtonText}>Add Progress</Text>
              </TouchableOpacity>
            </View>

            {renderProgressContent()}
          </View>
        </View>
      </ScrollView>

      {showExtensionModal && (
        <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
          <ExtensionRequestModal
            visible={showExtensionModal}
            onClose={() => setShowExtensionModal(false)}
            onSubmit={handleExtensionRequestSubmit}
            taskId={id || ''}
            oldEndsOn={task.endsOn}
            assignee={task.assignee}
            token={token || ''}
          />
        </Suspense>
      )}

      <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
        <ExtensionRequestDetailsModal
          visible={showExtensionDetailsModal}
          onClose={() => setShowExtensionDetailsModal(false)}
          extensionDetails={pendingExtensionDetails || null}
        />
      </Suspense>

      <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
        <UpdateTaskStatusModal
          visible={showUpdateStatusModal}
          onClose={() => setShowUpdateStatusModal(false)}
          onSubmit={handleUpdateStatusSubmit}
          taskId={id || ''}
          currentStatus={task.status}
          currentProgress={task.percentCompleted}
          token={token || ''}
        />
      </Suspense>

      <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
        <AddProgressModal
          visible={showAddProgressModal}
          onClose={() => setShowAddProgressModal(false)}
          onSubmit={handleAddProgressSubmit}
          taskId={id || ''}
          token={token || ''}
        />
      </Suspense>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  errorText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.error[500],
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    backgroundColor: theme.colors.primary[600],
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
  },
  retryButtonText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
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
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.lg,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  section: {
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadow.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  taskDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  value: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    flex: 2,
    textAlign: 'right',
  },
  progressText: {
    color: theme.colors.success[500],
    fontWeight: theme.typography.fontWeight.semibold,
  },
  githubLinkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  githubLinkLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  githubLinkButton: {
    backgroundColor: theme.colors.primary[600],
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    minWidth: 60,
    alignItems: 'center',
  },
  githubLinkButtonText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  dependencyItem: {
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  dependencyText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  addProgressButton: {
    backgroundColor: theme.colors.primary[600],
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
  },
  addProgressButtonText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.inverted,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  progressLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
  },
  progressLoadingText: {
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  progressCard: {
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadow.md,
  },
  progressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  progressCardTitle: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  progressCardTitleText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  progressCardSubtitle: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  progressCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCardAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background.tertiary,
    marginRight: theme.spacing.xs,
  },
  progressCardChevron: {
    marginLeft: theme.spacing.xs,
  },
  progressCardContent: {
    padding: theme.spacing.md,
  },
  progressDetailItem: {
    marginBottom: theme.spacing.md,
  },
  progressDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  progressDetailLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.xs,
  },
  progressDetailText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight:
      theme.typography.lineHeight.normal * theme.typography.fontSize.sm,
  },
  noProgressText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    paddingVertical: theme.spacing.lg,
    fontStyle: 'italic',
  },
  extensionRequestButton: {
    backgroundColor: '#FF6B35', // Orange color
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
  },
  extensionRequestButtonText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  extensionRequestButtonDisabled: {
    backgroundColor: '#CC5529', // Darker orange for disabled state
    opacity: 0.7,
  },
  updateStatusButton: {
    backgroundColor: theme.colors.primary[600],
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
  },
  updateStatusButtonText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
