import { ExtensionRequestsApi } from '@/api/extension-requests/extension-requests.api';
import ExtensionRequestCard from '@/components/ExtensionRequestCard';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const ExtensionRequestsScreen: React.FC = () => {
  const queryClient = useQueryClient();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [extensionRequestsFilter, setExtensionRequestsFilter] =
    useState('PENDING');

  const filterOptions = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Denied', value: 'DENIED' },
  ];

  // Fetch extension requests with infinite scroll
  const {
    data,
    isLoading: loading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ExtensionRequestsApi.getExtensionRequests.key({
      status: extensionRequestsFilter,
    }),
    queryFn: ({ pageParam }) =>
      ExtensionRequestsApi.getExtensionRequests.fn({
        status: extensionRequestsFilter,
        next: pageParam,
      }),
    enabled: true,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.next) return undefined;
      // Extract cursor parameter from URL like "/extension-requests?cursor=RREtras9tsRueAFLrwml&order=desc&size=5&q=status%3AAPPROVED%2BPENDING"
      const urlParams = new URLSearchParams(lastPage.next.split('?')[1]);
      return urlParams.get('cursor') || undefined;
    },
    initialPageParam: undefined as string | undefined,
  });

  const allExtensionRequests = React.useMemo(() => {
    if (!data?.pages) return [];

    return data.pages.flatMap((page: any) => {
      if (!page || !page.allExtensionRequests) {
        console.warn('Invalid page data received:', page);
        return [];
      }
      return page.allExtensionRequests.filter((request: any) => {
        if (!request || !request.id) {
          console.warn('Invalid extension request data received:', request);
          return false;
        }
        return true;
      });
    });
  }, [data?.pages]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Approve extension request mutation
  const approveMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      ExtensionRequestsApi.updateExtensionRequestStatus.fn(id, {
        status: 'APPROVED',
        reason,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ExtensionRequestsApi.getExtensionRequests.key({
          status: extensionRequestsFilter,
        }),
      });
      Alert.alert('Success', 'Extension request approved successfully');
    },
    onError: (error) => {
      console.error('Error approving extension request:', error);
      Alert.alert('Error', 'Failed to approve extension request');
    },
  });

  // Reject extension request mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      ExtensionRequestsApi.updateExtensionRequestStatus.fn(id, {
        status: 'DENIED',
        reason,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ExtensionRequestsApi.getExtensionRequests.key({
          status: extensionRequestsFilter,
        }),
      });
      Alert.alert('Success', 'Extension request rejected successfully');
    },
    onError: (error) => {
      console.error('Error rejecting extension request:', error);
      Alert.alert('Error', 'Failed to reject extension request');
    },
  });

  const handleApprove = async (id: string) => {
    return approveMutation.mutateAsync({ id });
  };

  const handleReject = async (id: string) => {
    return rejectMutation.mutateAsync({ id });
  };

  const handleFilterChange = (filter: string) => {
    setExtensionRequestsFilter(filter);
    setShowFilterModal(false);
  };

  const renderExtensionRequest = ({ item }: { item: any }) => (
    <ExtensionRequestCard
      request={item}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  );

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#1D1283" />
          <Text style={styles.loadingText}>Loading more requests...</Text>
        </View>
      );
    }
    return null;
  };

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
                extensionRequestsFilter === option.value &&
                  styles.selectedFilterOption,
              ]}
              onPress={() => handleFilterChange(option.value)}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  extensionRequestsFilter === option.value &&
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

  if (loading && !data) {
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
          Error: {error?.message || 'Failed to load extension requests'}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={async () => {
            if (!isRetrying) {
              setIsRetrying(true);
              try {
                await refetch();
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
              filterOptions.find((opt) => opt.value === extensionRequestsFilter)
                ?.label
            }
          </Text>
        </TouchableOpacity>
      </View>

      {allExtensionRequests && allExtensionRequests.length > 0 ? (
        <FlatList
          data={allExtensionRequests || []}
          keyExtractor={(item) => item.id}
          renderItem={renderExtensionRequest}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No extension requests found</Text>
          <Text style={styles.emptySubtext}>
            Try changing the filter or check back later
          </Text>
        </View>
      )}

      {renderFilterModal()}
    </View>
  );
};

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
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
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
});

export default ExtensionRequestsScreen;
