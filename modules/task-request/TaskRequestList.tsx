import { TaskRequestCardSkeleton } from '@/components/SkeletonLoader';
import TaskRequestCard from '@/components/TaskRequestCard';
import { theme } from '@/constants/theme';
import React from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

type TaskRequestListProps = {
  data: any[];
  isLoading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onCardPress: (id: string) => void;
  isEmpty: boolean;
  renderEmpty: () => React.ReactElement;
  renderLoadMore: () => React.ReactElement | null;
  renderFilter?: () => React.ReactElement | null;
};

export const TaskRequestList: React.FC<TaskRequestListProps> = ({
  data,
  isLoading,
  refreshing,
  onRefresh,
  onLoadMore,
  onCardPress,
  isEmpty,
  renderEmpty,
  renderLoadMore,
  renderFilter,
}) => {
  const renderTaskRequest = ({ item }: { item: any }) => (
    <TaskRequestCard request={item} onPress={onCardPress} />
  );

  if (isLoading && data.length === 0) {
    return (
      <View style={styles.skeletonContainer}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <TaskRequestCardSkeleton key={`task-request-skeleton-${idx + 1}`} />
        ))}
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderTaskRequest}
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
    paddingTop: theme.spacing.md,
  },
  listContent: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  listContentAndroid: {
    paddingTop: theme.spacing.md,
  },
});
