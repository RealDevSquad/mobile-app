import { TaskRequestsApi } from '@/api/task-requests/task-requests.api';
import TaskRequestCard from '@/components/TaskRequestCard';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TaskRequestsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [taskRequestsFilter, setTaskRequestsFilter] = useState('PENDING');

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
      status: taskRequestsFilter,
    }),
    queryFn: ({ pageParam }) =>
      TaskRequestsApi.getTaskRequests.fn({
        status: taskRequestsFilter,
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
    setShowFilterModal(false);
  };

  const renderTaskRequest = ({ item }: { item: any }) => (
    <TaskRequestCard request={item} onPress={handleCardPress} />
  );

  const renderLoadMoreButton = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.loadingMoreContainer}>
          <ActivityIndicator size="small" color="#1D1283" />
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

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filter by Status</Text>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.filterOption,
                taskRequestsFilter === option.value &&
                  styles.selectedFilterOption,
              ]}
              onPress={() => handleFilterChange(option.value)}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  taskRequestsFilter === option.value &&
                    styles.selectedFilterOptionText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowFilterModal(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading && allTaskRequests.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.filterButtonText}>
            Filter:{' '}
            {
              filterOptions.find((opt) => opt.value === taskRequestsFilter)
                ?.label
            }
          </Text>
        </TouchableOpacity>
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

      {renderFilterModal()}
    </View>
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
  errorContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    backgroundColor: '#1D1283',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  loadMoreButton: {
    backgroundColor: '#1D1283',
    margin: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  loadMoreText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#1D1283',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'center',
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedFilterOption: {
    backgroundColor: '#1D1283',
    borderColor: '#1D1283',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedFilterOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#666',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadingMoreText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
});
