import { TasksApi } from '@/api/tasks/tasks.api';
import { TaskCardSkeleton } from '@/components/SkeletonLoader';
import Task from '@/components/Task';
import UserSearchModal from '@/components/UserSearchModal';
import { theme } from '@/constants/theme';
import { useSearchModal } from '@/store/uiStore';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import React, { useCallback, useMemo, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Segment = 'all' | 'mine';

export default function TasksScreen() {
  const [segment, setSegment] = useState<Segment>('all');
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

  const {
    data: selfTasksData,
    isLoading: loadingSelfTasks,
    isError: isSelfTasksError,
    error: selfTasksError,
  } = useQuery({
    queryKey: TasksApi.getSelfTasks.key,
    queryFn: () => TasksApi.getSelfTasks.fn(),
    enabled: segment === 'mine',
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

  const handleRefresh = useCallback(async () => {
    if (segment === 'all') {
      await refetchTasks();
    }
  }, [refetchTasks, segment]);

  if (segment === 'all' && loadingTasks && allTasks.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Tasks</Text>
        </View>
        <View style={styles.skeletonContainer}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <TaskCardSkeleton key={`task-skeleton-${idx + 1}`} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  if (
    (segment === 'all' && isError) ||
    (segment === 'mine' && isSelfTasksError)
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Error:{' '}
            {segment === 'all'
              ? error?.message || 'Failed to load tasks'
              : selfTasksError?.message || 'Failed to load my tasks'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}></View>

      {/* Segmented control */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            segment === 'all' && styles.segmentActive,
          ]}
          onPress={() => setSegment('all')}
        >
          <Text
            style={[
              styles.segmentText,
              segment === 'all' && styles.segmentTextActive,
            ]}
          >
            Tasks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            segment === 'mine' && styles.segmentActive,
          ]}
          onPress={() => setSegment('mine')}
        >
          <Text
            style={[
              styles.segmentText,
              segment === 'mine' && styles.segmentTextActive,
            ]}
          >
            My Tasks
          </Text>
        </TouchableOpacity>
      </View>

      {segment === 'all' && (
        <>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={openSearchModal}
            >
              <Text style={styles.searchButtonText}>
                {selectedAssignee || 'Filter by User'}
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
        </>
      )}

      {segment === 'all' ? (
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
      ) : (
        <Task
          tasks={myTasks}
          onEndReached={() => {}}
          loading={loadingSelfTasks}
          showArrow={false}
        />
      )}

      {segment === 'all' && (
        <UserSearchModal
          visible={showSearchModal}
          onClose={closeSearchModal}
          onUserSelect={handleUserSelect}
        />
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
    backgroundColor: '#FFFFFF',
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
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  segmentButton: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: theme.colors.primary[500],
  },
  segmentText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: '#FFFFFF',
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
