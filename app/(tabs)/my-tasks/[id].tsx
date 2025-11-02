import { ExtensionRequestsApi } from '@/api/extension-requests/extension-requests.api';
import { TasksApi } from '@/api/tasks/tasks.api';
import { theme } from '@/constants/theme';

import {
  formatDate,
  formatDateTime,
  formatTimeAgo as formatTimeAgoUtil,
} from '@/common/utils/dateUtils';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialTabBar, Tabs } from 'react-native-collapsible-tab-view';

import AddProgressModal from '@/components/Modal/AddProgressModal';
import ExtensionRequestDetailsModal from '@/components/Modal/ExtensionRequestDetailsModal';
import ExtensionRequestModal from '@/components/Modal/ExtensionRequestModal';
import UpdateTaskStatusModal from '@/components/Modal/UpdateTaskStatusModal';
import { TaskDetailsSkeleton } from '@/components/SkeletonLoader';

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { user: currentUser } = useCurrentUser();

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
    enabled: !!id,
  });

  const { data: progressUpdatesData, isLoading: progressLoading } = useQuery({
    queryKey: TasksApi.getTaskProgress.key(id || ''),
    queryFn: () => TasksApi.getTaskProgress.fn(id!),
    enabled: !!id,
  });

  const { data: extensionRequestsData, isLoading: extensionRequestsLoading } =
    useQuery({
      queryKey: ExtensionRequestsApi.getSelfExtensionRequests.key({
        taskId: id || '',
      }),
      queryFn: () =>
        ExtensionRequestsApi.getSelfExtensionRequests.fn({ taskId: id! }),
      enabled: !!id,
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
  }
  // Don't treat progress error as critical - just show empty state

  const formatTimeAgo = (timestamp: number) => {
    // If timestamp is in milliseconds, convert to unix seconds
    const unixTimestamp =
      timestamp > 1000000000000 ? Math.floor(timestamp / 1000) : timestamp;
    return formatTimeAgoUtil(unixTimestamp);
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

  const truncateText = (text: string, maxLength: number = 60): string => {
    if (!text || text.trim().length === 0) return '';
    if (text.length <= maxLength) return text.trim();
    return text.trim().substring(0, maxLength).trim() + '...';
  };

  const getProgressUpdateTitle = (update: any): string => {
    if (update.completed && update.completed.trim()) {
      return truncateText(update.completed, 60);
    }
    if (update.planned && update.planned.trim()) {
      return truncateText(update.planned, 60);
    }
    if (update.blockers && update.blockers.trim()) {
      return truncateText(update.blockers, 60);
    }
    return 'Progress Update';
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
      return null;
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
              <Text style={styles.progressCardTitleText} numberOfLines={2}>
                {getProgressUpdateTitle(update)}
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
                size={14}
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
                      size={12}
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
                      size={12}
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
                      size={12}
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
      <SafeAreaView style={styles.container}>
        <Tabs.Container renderTabBar={renderTabBar} tabBarHeight={50}>
          <Tabs.Tab name="Task Details">
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

  const isOwner = task.assigneeId === currentUser?.id;

  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Container renderTabBar={renderTabBar} tabBarHeight={50}>
        <Tabs.Tab name="Task Details">
          <Tabs.ScrollView
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
                  {isOwner && (
                    <TouchableOpacity
                      style={styles.updateStatusButton}
                      onPress={() => setShowUpdateStatusModal(true)}
                    >
                      <Text style={styles.updateStatusButtonText}>
                        Update Task
                      </Text>
                    </TouchableOpacity>
                  )}
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
                  <Text style={styles.value}>
                    {formatDateTime(task.createdAt)}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Last Updated:</Text>
                  <Text style={styles.value}>
                    {formatDateTime(task.updatedAt)}
                  </Text>
                </View>
              </View>

              <View style={styles.section}>
                <View style={styles.timelineHeader}>
                  <Text style={styles.sectionTitle}>Timeline</Text>
                  {isOwner && (
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
                  )}
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
                  {isOwner && (
                    <TouchableOpacity
                      style={styles.addProgressButton}
                      onPress={() => setShowAddProgressModal(true)}
                    >
                      <Text style={styles.addProgressButtonText}>
                        Add Progress
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {renderProgressContent()}
              </View>
            </View>
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>

      {showExtensionModal && (
        <ExtensionRequestModal
          visible={showExtensionModal}
          onClose={() => setShowExtensionModal(false)}
          onSubmit={handleExtensionRequestSubmit}
          taskId={id || ''}
          oldEndsOn={task.endsOn}
          assignee={task.assignee}
        />
      )}

      <ExtensionRequestDetailsModal
        visible={showExtensionDetailsModal}
        onClose={() => setShowExtensionDetailsModal(false)}
        extensionDetails={pendingExtensionDetails || null}
      />

      <UpdateTaskStatusModal
        visible={showUpdateStatusModal}
        onClose={() => setShowUpdateStatusModal(false)}
        onSubmit={handleUpdateStatusSubmit}
        taskId={id || ''}
        currentStatus={task.status}
        currentProgress={task.percentCompleted}
      />

      <AddProgressModal
        visible={showAddProgressModal}
        onClose={() => setShowAddProgressModal(false)}
        onSubmit={handleAddProgressSubmit}
        taskId={id || ''}
      />
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
    backgroundColor: theme.colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
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
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    marginTop: 16,
    borderBottomColor: theme.colors.border.primary,
  },
  title: {
    fontSize: theme.typography.fontSize.base,
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
    fontWeight: theme.typography.fontWeight.semibold,
  },
  section: {
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,

    marginBottom: theme.spacing.sm,
    ...theme.shadow.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  taskDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
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
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  value: {
    fontSize: theme.typography.fontSize.xs,
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
    fontSize: theme.typography.fontSize.xs,
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
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  dependencyItem: {
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  dependencyText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  addProgressButton: {
    backgroundColor: theme.colors.primary[600],
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
  },
  addProgressButtonText: {
    fontSize: theme.typography.fontSize.xs,
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
    padding: theme.spacing.sm,
    ...theme.shadow.md,
  },
  progressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  progressCardTitle: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  progressCardTitleText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
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
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.background.tertiary,
    marginRight: theme.spacing.xs,
  },
  progressCardChevron: {
    marginLeft: theme.spacing.xs,
  },
  progressCardContent: {
    paddingVertical: theme.spacing.sm,
  },
  progressDetailItem: {
    marginBottom: theme.spacing.sm,
  },
  progressDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  progressDetailLabel: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.xs,
  },
  progressDetailText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  noProgressText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    paddingVertical: theme.spacing.lg,
    fontStyle: 'italic',
  },
  extensionRequestButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
  },
  extensionRequestButtonText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  extensionRequestButtonDisabled: {
    backgroundColor: '#CC5529', // Darker orange for disabled state
    opacity: 0.7,
  },
  updateStatusButton: {
    backgroundColor: theme.colors.primary[600],
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
  },
  updateStatusButtonText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
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
