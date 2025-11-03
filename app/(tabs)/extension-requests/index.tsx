import { ExtensionRequestsApi } from '@/api/extension-requests/extension-requests.api';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { ExtensionRequestFilters } from '@/modules/extension-request/ExtensionRequestFilters';
import { ExtensionRequestList } from '@/modules/extension-request/ExtensionRequestList';
import { ExtensionRequestLoadMore } from '@/modules/extension-request/ExtensionRequestLoadMore';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';

const ExtensionRequestsScreen: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const [refreshing, setRefreshing] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [extensionRequestsFilter, setExtensionRequestsFilter] =
    useState('PENDING');

  const isSuperUser = user?.roles?.super_user === true;

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

  const handleRetry = useCallback(async () => {
    if (!isRetrying) {
      setIsRetrying(true);
      try {
        await refetchRequests();
      } catch {
      } finally {
        setIsRetrying(false);
      }
    }
  }, [isRetrying, refetchRequests]);

  const renderLoadMoreButton = () => (
    <ExtensionRequestLoadMore isLoading={isFetchingNextPage} />
  );

  const renderEmpty = () => {
    const getSubtext = () => {
      if (extensionRequestsFilter === 'PENDING') {
        return 'No pending requests at the moment';
      }
      if (extensionRequestsFilter === 'DENIED') {
        return 'No rejected requests found';
      }
      return `No ${extensionRequestsFilter.toLowerCase()} requests found`;
    };

    return (
      <EmptyState title="No extension requests found" subtitle={getSubtext()} />
    );
  };

  if (isError) {
    return (
      <ErrorState
        errorMessage={error?.message}
        defaultMessage="Failed to load extension requests"
        onRetry={handleRetry}
        isRetrying={isRetrying}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ExtensionRequestList
        data={allExtensionRequests}
        isLoading={loading}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onLoadMore={handleLoadMore}
        onApprove={handleApprove}
        onReject={handleReject}
        isEmpty={!loading && allExtensionRequests.length === 0}
        renderEmpty={renderEmpty}
        renderLoadMore={renderLoadMoreButton}
        isSuperUser={isSuperUser}
        renderFilter={() => (
          <ExtensionRequestFilters
            selectedFilter={extensionRequestsFilter}
            onFilterChange={handleFilterChange}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default ExtensionRequestsScreen;
