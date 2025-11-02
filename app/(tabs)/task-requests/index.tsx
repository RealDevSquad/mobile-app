import { TaskRequestsApi } from '@/api/task-requests/task-requests.api';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { theme } from '@/constants/theme';
import { TaskRequestFilters } from '@/modules/task-request/TaskRequestFilters';
import { TaskRequestList } from '@/modules/task-request/TaskRequestList';
import { TaskRequestLoadMore } from '@/modules/task-request/TaskRequestLoadMore';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { MaterialTabBar, Tabs } from 'react-native-collapsible-tab-view';

const FILTER_OPTIONS = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
];

export default function TaskRequestsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [taskRequestsFilter, setTaskRequestsFilter] = useState('PENDING');

  const getApiStatusValue = (filterValue: string): string => {
    if (filterValue === 'REJECTED') {
      return 'DENIED';
    }
    return filterValue;
  };

  const apiStatusValue = getApiStatusValue(taskRequestsFilter);

  const {
    data,
    isLoading: loading,
    isError,
    error,
    refetch: refetchTasks,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: TaskRequestsApi.getTaskRequests.key({
      status: apiStatusValue,
    }),
    queryFn: ({ pageParam }) =>
      TaskRequestsApi.getTaskRequests.fn({
        status: apiStatusValue,
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

  const allTaskRequests =
    data?.pages.flatMap((page: any) => {
      if (!page || !page.taskRequests) {
        console.warn('Invalid page data received:', page);
        return [];
      }
      return page.taskRequests.filter((taskRequest: any) => {
        if (!taskRequest || !taskRequest.id) {
          console.warn('Invalid task request data received:', taskRequest);
          return false;
        }
        return true;
      });
    }) || [];

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchTasks();
    setRefreshing(false);
  }, [refetchTasks]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCardPress = useCallback(
    (id: string) => {
      router.push(`/task-requests/${id}`);
    },
    [router]
  );

  const handleFilterChange = useCallback((filter: string) => {
    setTaskRequestsFilter(filter);
  }, []);

  const handleRetry = useCallback(async () => {
    if (!isRetrying) {
      setIsRetrying(true);
      try {
        await refetchTasks();
      } catch (error) {
        console.error('Error retrying:', error);
      } finally {
        setIsRetrying(false);
      }
    }
  }, [isRetrying, refetchTasks]);

  const renderLoadMore = () => (
    <TaskRequestLoadMore isLoading={isFetchingNextPage} />
  );

  const renderEmpty = () => {
    const getSubtext = () => {
      if (taskRequestsFilter === 'PENDING') {
        return 'No pending requests at the moment';
      }
      if (taskRequestsFilter === 'REJECTED') {
        return 'No rejected requests found';
      }
      return `No ${taskRequestsFilter.toLowerCase()} requests found`;
    };

    return (
      <EmptyState title="No task requests found" subtitle={getSubtext()} />
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

  if (isError) {
    return (
      <ErrorState
        errorMessage={error?.message}
        defaultMessage="Failed to load task requests"
        onRetry={handleRetry}
        isRetrying={isRetrying}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Container renderTabBar={renderTabBar} tabBarHeight={50}>
        <Tabs.Tab name="Task Requests">
          <TaskRequestFilters
            selectedFilter={taskRequestsFilter}
            onFilterChange={handleFilterChange}
            filterOptions={FILTER_OPTIONS}
          />
          <TaskRequestList
            data={allTaskRequests}
            isLoading={loading}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onLoadMore={handleLoadMore}
            onCardPress={handleCardPress}
            isEmpty={!loading && allTaskRequests.length === 0}
            renderEmpty={renderEmpty}
            renderLoadMore={renderLoadMore}
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
