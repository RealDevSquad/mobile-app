import { TaskCardSkeleton } from '@/components/SkeletonLoader';
import { TaskCard } from '@/components/task-card/TaskCard';
import { theme } from '@/constants/theme';
import React from 'react';
import {
  Platform,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Tabs } from 'react-native-collapsible-tab-view';

type TaskListProps = {
  data: any[];
  isLoading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onTaskPress: (task: any) => void;
  isEmpty: boolean;
  renderEmpty: () => React.ReactElement | null;
  renderLoadMore: () => React.ReactElement | null;
};

export const TaskList: React.FC<TaskListProps> = ({
  data,
  isLoading,
  refreshing,
  onRefresh,
  onLoadMore,
  onTaskPress,
  isEmpty,
  renderEmpty,
  renderLoadMore,
}) => {
  const renderTask = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => onTaskPress(item)} activeOpacity={0.7}>
      <TaskCard task={item} />
    </TouchableOpacity>
  );

  if (isLoading && data.length === 0) {
    return (
      <View style={styles.skeletonContainer}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <TaskCardSkeleton key={`task-skeleton-${idx + 1}`} />
        ))}
      </View>
    );
  }

  return (
    <Tabs.FlatList
      data={data}
      renderItem={renderTask}
      keyExtractor={(item) => item?.id || `task-${Math.random()}`}
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
    marginTop: theme.spacing['2xl'],
  },
  listContent: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  listContentAndroid: {
    paddingTop: theme.spacing['4xl'],
  },
});
