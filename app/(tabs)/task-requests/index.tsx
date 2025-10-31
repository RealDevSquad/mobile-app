import { TaskRequestsApi } from '@/api/task-requests/task-requests.api';
import TaskRequestCard from '@/components/TaskRequestCard';
import { theme } from '@/constants/theme';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TaskRequestsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [taskRequestsFilter, setTaskRequestsFilter] = useState('PENDING');

  // Map filter value to API value (REJECTED -> DENIED)
  const getApiStatusValue = (filterValue: string): string => {
    if (filterValue === 'REJECTED') {
      return 'DENIED';
    }
    return filterValue;
  };

  const apiStatusValue = getApiStatusValue(taskRequestsFilter);

  // Fetch task requests with infinite scroll
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

  const handleCardPress = (id: string) => {
    router.push(`/task-requests/${id}`);
  };

  const handleFilterChange = (filter: string) => {
    setTaskRequestsFilter(filter);
  };

  const renderTaskRequest = ({ item }: { item: any }) => (
    <TaskRequestCard request={item} onPress={handleCardPress} />
  );

  const renderLoadMoreButton = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.loadingMoreContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary[600]} />
          <Text style={styles.loadingMoreText}>Loading more...</Text>
        </View>
      );
    }
    return null;
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No task requests found</Text>
      <Text style={styles.emptySubtext}>
        {taskRequestsFilter === 'PENDING'
          ? 'No pending requests at the moment'
          : `No ${taskRequestsFilter.toLowerCase()} requests found`}
      </Text>
    </View>
  );

  const filterOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  const getFilterColor = (value: string) => {
    switch (value) {
      case 'PENDING':
        return theme.colors.warning[500];
      case 'APPROVED':
        return theme.colors.success[500];
      case 'REJECTED':
        return theme.colors.error[500];
      default:
        return theme.colors.primary[600];
    }
  };

  if (loading && allTaskRequests.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary[600]} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error: {error?.message || 'Failed to load task requests'}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={async () => {
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
          }}
          disabled={isRetrying}
        >
          {isRetrying ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.retryButtonText}>Retry</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {filterOptions.map((option) => {
            const isSelected = taskRequestsFilter === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.filterChip,
                  isSelected && [
                    styles.filterChipSelected,
                    { backgroundColor: getFilterColor(option.value) },
                  ],
                ]}
                onPress={() => handleFilterChange(option.value)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={allTaskRequests}
        renderItem={renderTaskRequest}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderLoadMoreButton}
        ListEmptyComponent={loading ? null : renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
  errorContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  filterContainer: {
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
    paddingVertical: theme.spacing.sm,
  },
  filterScrollContent: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    marginRight: theme.spacing.sm,
  },
  filterChipSelected: {
    borderColor: 'transparent',
  },
  filterChipText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
  },
  filterChipTextSelected: {
    color: theme.colors.text.inverted,
    fontFamily: theme.typography.fontFamily.bold,
  },
  loadMoreButton: {
    backgroundColor: theme.colors.primary[600],
    margin: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  loadMoreText: {
    color: theme.colors.text.inverted,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.base,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  errorText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.error[600],
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  retryButton: {
    backgroundColor: theme.colors.primary[600],
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    alignSelf: 'center',
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButtonText: {
    color: theme.colors.text.inverted,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.base,
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  loadingMoreText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
});
