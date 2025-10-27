import { TasksApi } from '@/api/tasks/tasks.api';
import { TaskCardSkeleton } from '@/components/SkeletonLoader';
import Task from '@/components/Task';
import UserSearchModal from '@/components/UserSearchModal';
import { theme } from '@/constants/theme';
import { useSearchModal } from '@/store/uiStore';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TasksScreen() {
  const {
    isOpen: showSearchModal,
    open: openSearchModal,
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

  const handleRefresh = useCallback(async () => {
    await refetchTasks();
  }, [refetchTasks]);

  if (loadingTasks && allTasks.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Tasks</Text>
        </View>
        <View style={styles.skeletonContainer}>
          <TaskCardSkeleton />
          <TaskCardSkeleton />
          <TaskCardSkeleton />
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Error: {error?.message || 'Failed to load tasks'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <TouchableOpacity style={styles.searchButton} onPress={openSearchModal}>
          <Text style={styles.searchButtonText}>
            {selectedAssignee
              ? `Filter: ${selectedAssignee}`
              : 'Filter by User'}
          </Text>
        </TouchableOpacity>
      </View>

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

      <Task
        tasks={allTasks}
        onEndReached={handleLoadMore}
        loading={isFetchingNextPage}
        showArrow={false}
        refreshControl={
          <RefreshControl
            refreshing={loadingTasks}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary[500]]}
            tintColor={theme.colors.primary[500]}
          />
        }
      />

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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
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
});
