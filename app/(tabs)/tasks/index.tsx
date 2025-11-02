import { TasksApi } from '@/api/tasks/tasks.api';
import { TaskCardSkeleton } from '@/components/SkeletonLoader';
import { TaskCard } from '@/components/task-card/TaskCard';
import UserSearchModal from '@/components/UserSearchModal';
import { theme } from '@/constants/theme';
import { useSearchModal } from '@/store/uiStore';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialTabBar, Tabs } from 'react-native-collapsible-tab-view';

export default function TasksScreen() {
  const router = useRouter();
  const {
    isOpen: showSearchModal,

    close: closeSearchModal,
  } = useSearchModal();
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);

  const {
    data,
    isLoading: loadingTasks,
    isError,
    error,
    refetch: refetchTasks,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: TasksApi.getTasks.key({
      assignee: selectedAssignee || undefined,
    }),
    queryFn: ({ pageParam }) =>
      TasksApi.getTasks.fn({
        assignee: selectedAssignee || undefined,
        next: pageParam,
      }),
    enabled: true,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.next) return undefined;
      const urlParams = new URLSearchParams(lastPage.next.split('?')[1]);
      return urlParams.get('next') || undefined;
    },
    initialPageParam: undefined as string | undefined,
  });

  const {
    data: selfTasksData,
    isLoading: loadingSelfTasks,
    isError: isSelfTasksError,
    error: selfTasksError,
    refetch: refetchSelfTasks,
  } = useQuery({
    queryKey: TasksApi.getSelfTasks.key,
    queryFn: () => TasksApi.getSelfTasks.fn(),
    enabled: true,
  });

  const allTasks =
    data?.pages.flatMap((page: any) => {
      if (!page || !page.tasks) {
        console.warn('Invalid page data received:', page);
        return [];
      }
      return page.tasks.filter((task: any) => {
        if (!task || !task.id) {
          console.warn('Invalid task data received:', task);
          return false;
        }
        return true;
      });
    }) || [];

  const myTasks = useMemo(() => {
    const raw = selfTasksData || [];
    return raw.filter((task: any) => task && task.id);
  }, [selfTasksData]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleUserSelect = useCallback((username: string) => {
    setSelectedAssignee(username);
  }, []);

  const handleClearFilter = useCallback(() => {
    setSelectedAssignee(null);
  }, []);

  const handleTaskPress = useCallback(
    (task: any) => {
      if (task?.id) router.push(`/my-tasks/${task.id}`);
    },
    [router]
  );

  const handleRefreshTasks = useCallback(async () => {
    await refetchTasks();
  }, [refetchTasks]);

  const handleRefreshMyTasks = useCallback(async () => {
    await refetchSelfTasks();
  }, [refetchSelfTasks]);

  if (isError || isSelfTasksError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Error:{' '}
            {error?.message ||
              selfTasksError?.message ||
              'Failed to load tasks'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderHeader = () => (
    <View>
      <View style={styles.header}></View>

      {selectedAssignee && (
        <View style={styles.filterContainer}>
          <Text style={styles.filterText}>
            Showing tasks for:{' '}
            <Text style={styles.filterUser}>{selectedAssignee}</Text>
          </Text>
          <TouchableOpacity
            onPress={handleClearFilter}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderFooter = (loading: boolean) => {
    if (loading) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={theme.colors.primary[500]} />
          <Text style={styles.loadingText}>Loading more tasks...</Text>
        </View>
      );
    }
    return null;
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

  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Container
        renderHeader={renderHeader}
        renderTabBar={renderTabBar}
        tabBarHeight={50}
      >
        <Tabs.Tab name="Tasks">
          {loadingTasks && allTasks.length === 0 ? (
            <View style={styles.skeletonContainer}>
              {Array.from({ length: 6 }).map((_, idx) => (
                <TaskCardSkeleton key={`task-skeleton-${idx + 1}`} />
              ))}
            </View>
          ) : (
            <Tabs.FlatList
              data={allTasks}
              keyExtractor={(item) => item?.id || `task-${Math.random()}`}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleTaskPress(item)}
                  activeOpacity={0.7}
                >
                  <TaskCard task={item} />
                </TouchableOpacity>
              )}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.1}
              ListFooterComponent={() => renderFooter(isFetchingNextPage)}
              ListEmptyComponent={
                loadingTasks ? null : (
                  <Text style={styles.emptyView}>No tasks found...</Text>
                )
              }
              refreshControl={
                <RefreshControl
                  refreshing={loadingTasks}
                  onRefresh={handleRefreshTasks}
                  colors={[theme.colors.primary[500]]}
                  tintColor={theme.colors.primary[500]}
                />
              }
            />
          )}
        </Tabs.Tab>
        <Tabs.Tab name="My Tasks">
          {loadingSelfTasks && myTasks.length === 0 ? (
            <View style={styles.skeletonContainer}>
              {Array.from({ length: 6 }).map((_, idx) => (
                <TaskCardSkeleton key={`my-task-skeleton-${idx + 1}`} />
              ))}
            </View>
          ) : (
            <Tabs.FlatList
              data={myTasks}
              keyExtractor={(item) => item?.id || `my-task-${Math.random()}`}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleTaskPress(item)}
                  activeOpacity={0.7}
                >
                  <TaskCard task={item} />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                loadingSelfTasks ? null : (
                  <Text style={styles.emptyView}>No tasks found...</Text>
                )
              }
              refreshControl={
                <RefreshControl
                  refreshing={loadingSelfTasks}
                  onRefresh={handleRefreshMyTasks}
                  colors={[theme.colors.primary[500]]}
                  tintColor={theme.colors.primary[500]}
                />
              }
            />
          )}
        </Tabs.Tab>
      </Tabs.Container>

      <UserSearchModal
        visible={showSearchModal}
        onClose={closeSearchModal}
        onUserSelect={handleUserSelect}
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
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  actionsRow: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#BBDEFB',
  },
  filterText: {
    fontSize: 14,
    color: '#1976D2',
    flex: 1,
  },
  filterUser: {
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
  },
  skeletonContainer: {
    padding: theme.spacing.sm,
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  loadingText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
  },
  emptyView: {
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
  listContent: {
    paddingTop: theme.spacing.sm,
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
