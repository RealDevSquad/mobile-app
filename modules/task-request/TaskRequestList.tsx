import TaskRequestCard from '@/components/TaskRequestCard';
import { TaskRequestCardSkeleton } from '@/components/SkeletonLoader';
import { theme } from '@/constants/theme';
import React from 'react';
import { Platform, RefreshControl, StyleSheet, View } from 'react-native';
import { Tabs } from 'react-native-collapsible-tab-view';

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
    <Tabs.FlatList
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
    paddingTop: theme.spacing.md,
  },
  listContentAndroid: {
    paddingTop: theme.spacing.sm,
  },
});
