import ExtensionRequestCard from '@/components/ExtensionRequestCard';
import { TaskCardSkeleton } from '@/components/SkeletonLoader';
import { theme } from '@/constants/theme';
import React from 'react';
import { Platform, RefreshControl, StyleSheet, View } from 'react-native';
import { Tabs } from 'react-native-collapsible-tab-view';

type ExtensionRequestListProps = {
  data: any[];
  isLoading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  isEmpty: boolean;
  renderEmpty: () => React.ReactElement;
  renderLoadMore: () => React.ReactElement | null;
  renderFilter?: () => React.ReactElement | null;
};

export const ExtensionRequestList: React.FC<ExtensionRequestListProps> = ({
  data,
  isLoading,
  refreshing,
  onRefresh,
  onLoadMore,
  onApprove,
  onReject,
  isEmpty,
  renderEmpty,
  renderLoadMore,
  renderFilter,
}) => {
  const renderExtensionRequest = ({ item }: { item: any }) => (
    <ExtensionRequestCard
      request={item}
      onApprove={onApprove}
      onReject={onReject}
    />
  );

  if (isLoading && data.length === 0) {
    return (
      <View style={styles.skeletonContainer}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <TaskCardSkeleton key={`extension-request-skeleton-${idx + 1}`} />
        ))}
      </View>
    );
  }

  return (
    <Tabs.FlatList
      data={data}
      renderItem={renderExtensionRequest}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[
        styles.listContent,
        Platform.OS === 'android' && styles.listContentAndroid,
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary[500]]}
          tintColor={theme.colors.primary[500]}
        />
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.1}
      ListHeaderComponent={renderFilter ? renderFilter() : null}
      ListFooterComponent={renderLoadMore}
      ListEmptyComponent={isEmpty ? renderEmpty() : null}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    padding: theme.spacing.sm,
  },
  listContent: {
    paddingBottom: theme.spacing.md,
  },
  listContentAndroid: {
    paddingTop: theme.spacing.sm,
  },
});
