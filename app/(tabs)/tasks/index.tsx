import { TasksApi } from '@/api/tasks/tasks.api';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { theme } from '@/constants/theme';
import { TaskList } from '@/modules/tasks/TaskList';
import { TaskLoadMore } from '@/modules/tasks/TaskLoadMore';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { MaterialTabBar, Tabs } from 'react-native-collapsible-tab-view';

export default function TasksScreen() {
  const router = useRouter();
  const [refreshingTasks, setRefreshingTasks] = useState(false);
  const [refreshingMyTasks, setRefreshingMyTasks] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

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
    queryKey: TasksApi.getTasks.key(),
    queryFn: ({ pageParam }) =>
      TasksApi.getTasks.fn({
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

  const handleTaskPress = useCallback(
    (task: any) => {
      if (task?.id) router.push(`/my-tasks/${task.id}`);
    },
    [router]
  );

  const handleRefreshTasks = useCallback(async () => {
    setRefreshingTasks(true);
    await refetchTasks();
    setRefreshingTasks(false);
  }, [refetchTasks]);

  const handleRefreshMyTasks = useCallback(async () => {
    setRefreshingMyTasks(true);
    await refetchSelfTasks();
    setRefreshingMyTasks(false);
  }, [refetchSelfTasks]);

  const handleRetry = useCallback(async () => {
    if (!isRetrying) {
      setIsRetrying(true);
      try {
        await Promise.all([refetchTasks(), refetchSelfTasks()]);
      } catch {
      } finally {
        setIsRetrying(false);
      }
    }
  }, [isRetrying, refetchTasks, refetchSelfTasks]);

  const renderLoadMore = () => <TaskLoadMore isLoading={isFetchingNextPage} />;

  const renderTasksEmpty = () => <EmptyState title="No tasks found..." />;

  const renderMyTasksEmpty = () => (
    <EmptyState title="No tasks assigned to you yet" />
  );

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

  if (isError || isSelfTasksError) {
    return (
      <ErrorState
        errorMessage={error?.message || selfTasksError?.message}
        defaultMessage="Failed to load tasks"
        onRetry={handleRetry}
        isRetrying={isRetrying}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Container renderTabBar={renderTabBar} tabBarHeight={50}>
        <Tabs.Tab name="Tasks">
          <TaskList
            data={allTasks}
            isLoading={loadingTasks}
            refreshing={refreshingTasks}
            onRefresh={handleRefreshTasks}
            onLoadMore={handleLoadMore}
            onTaskPress={handleTaskPress}
            isEmpty={!loadingTasks && allTasks.length === 0}
            renderEmpty={renderTasksEmpty}
            renderLoadMore={renderLoadMore}
          />
        </Tabs.Tab>
        <Tabs.Tab name="My Tasks">
          <TaskList
            data={myTasks}
            isLoading={loadingSelfTasks}
            refreshing={refreshingMyTasks}
            onRefresh={handleRefreshMyTasks}
            onLoadMore={() => {}}
            onTaskPress={handleTaskPress}
            isEmpty={!loadingSelfTasks && myTasks.length === 0}
            renderEmpty={renderMyTasksEmpty}
            renderLoadMore={() => null}
          />
        </Tabs.Tab>
      </Tabs.Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
