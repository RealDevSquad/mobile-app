import { ExtensionRequestsApi } from '@/api/extension-requests/extension-requests.api';
import ExtensionRequestCard from '@/components/ExtensionRequestCard';
import { TaskCardSkeleton } from '@/components/SkeletonLoader';
import { theme } from '@/constants/theme';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialTabBar, Tabs } from 'react-native-collapsible-tab-view';

const ExtensionRequestsScreen: React.FC = () => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [extensionRequestsFilter, setExtensionRequestsFilter] =
    useState('PENDING');

  // Fetch extension requests with infinite scroll
  const {
    data,
    isLoading: loading,
    isError,
    error,
    refetch: refetchRequests,
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

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchRequests();
    setRefreshing(false);
  }, [refetchRequests]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Approve extension request mutation
  const approveMutation = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      ExtensionRequestsApi.updateExtensionRequestStatus.fn(id, {
        status: 'APPROVED',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ExtensionRequestsApi.getExtensionRequests.key({
          status: extensionRequestsFilter,
        }),
      });
      Alert.alert('Success', 'Extension request approved successfully');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to approve extension request');
    },
  });

  // Reject extension request mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      ExtensionRequestsApi.updateExtensionRequestStatus.fn(id, {
        status: 'DENIED',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ExtensionRequestsApi.getExtensionRequests.key({
          status: extensionRequestsFilter,
        }),
      });
      Alert.alert('Success', 'Extension request rejected successfully');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to reject extension request');
    },
  });

  const handleApprove = async (id: string): Promise<void> => {
    await approveMutation.mutateAsync({ id });
  };

  const handleReject = async (id: string): Promise<void> => {
    await rejectMutation.mutateAsync({ id });
  };

  const handleFilterChange = (filter: string) => {
    setExtensionRequestsFilter(filter);
  };

  const renderExtensionRequest = ({ item }: { item: any }) => (
    <ExtensionRequestCard
      request={item}
      onApprove={handleApprove}
      onReject={handleReject}
    />
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
      <Text style={styles.emptyText}>No extension requests found</Text>
      <Text style={styles.emptySubtext}>
        {extensionRequestsFilter === 'PENDING'
          ? 'No pending requests at the moment'
          : extensionRequestsFilter === 'DENIED'
            ? 'No rejected requests found'
            : `No ${extensionRequestsFilter.toLowerCase()} requests found`}
      </Text>
    </View>
  );

  const filterOptions = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'DENIED' },
  ];

  const getFilterColor = (value: string) => {
    switch (value) {
      case 'PENDING':
        return theme.colors.warning[500];
      case 'APPROVED':
        return theme.colors.success[500];
      case 'DENIED':
        return theme.colors.error[500];
      default:
        return theme.colors.primary[600];
    }
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
      <SafeAreaView style={styles.container}>
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
                  await refetchRequests();
                } catch {
                  // Error handled silently
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Container renderTabBar={renderTabBar} tabBarHeight={50}>
        <Tabs.Tab name="Extension Requests">
          <View style={styles.filterContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScrollContent}
            >
              {filterOptions.map((option) => {
                const isSelected = extensionRequestsFilter === option.value;
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
          {loading && allExtensionRequests.length === 0 ? (
            <View style={styles.skeletonContainer}>
              {Array.from({ length: 6 }).map((_, idx) => (
                <TaskCardSkeleton
                  key={`extension-request-skeleton-${idx + 1}`}
                />
              ))}
            </View>
          ) : (
            <Tabs.FlatList
              data={allExtensionRequests}
              renderItem={renderExtensionRequest}
              keyExtractor={(item) => item.id}
              contentContainerStyle={[
                styles.listContent,
                Platform.OS === 'android' && styles.listContentAndroid,
              ]}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={[theme.colors.primary[500]]}
                  tintColor={theme.colors.primary[500]}
                />
              }
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.1}
              ListFooterComponent={renderLoadMoreButton}
              ListEmptyComponent={loading ? null : renderEmpty}
              showsVerticalScrollIndicator={false}
            />
          )}
        </Tabs.Tab>
      </Tabs.Container>
    </SafeAreaView>
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
  skeletonContainer: {
    padding: theme.spacing.sm,
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
  listContent: {
    paddingBottom: theme.spacing.md,
  },
  listContentAndroid: {
    paddingTop: theme.spacing.sm,
  },
});

export default ExtensionRequestsScreen;
