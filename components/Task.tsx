import { TaskCard } from '@/components/task-card/TaskCard';
import { theme } from '@/constants/theme';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Task = React.memo(
  ({
    tasks,
    onEndReached,
    loading = false,
    onTaskPress,
    showArrow = true,
    refreshControl,
  }: {
    tasks: any[];
    onEndReached?: () => void;
    loading?: boolean;
    onTaskPress?: (task: any) => void;
    showArrow?: boolean;
    refreshControl?: React.ReactElement<
      React.ComponentProps<typeof RefreshControl>
    >;
  }) => {
    const renderItem = ({ item }: { item: any }) => {
      // Skip rendering if item is undefined or doesn't have required properties
      if (!item?.id) {
        return null;
      }

      return (
        <TouchableOpacity
          style={styles.card}
          onPress={() => onTaskPress?.(item)}
          activeOpacity={0.7}
        >
          <TaskCard task={item} />
        </TouchableOpacity>
      );
    };

    const renderFooter = () => {
      if (loading) {
        return (
          <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color="#0000ff" />
            <Text style={styles.loadingText}>Loading more tasks...</Text>
          </View>
        );
      }
      return null;
    };

    return tasks?.length > 0 ? (
      <FlatList
        data={tasks.filter((item) => item?.id)} // Filter out invalid items
        keyExtractor={(item, index) => item?.id || `task-${index}`} // Fallback to index if no id
        renderItem={renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
        refreshControl={refreshControl}
      />
    ) : (
      <Text style={styles.emptyView}>No tasks found...</Text>
    );
  }
);

Task.displayName = 'Task';

const styles = StyleSheet.create({
  card: {
    marginHorizontal: theme.spacing.sm,
    marginVertical: theme.spacing.xs,
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    ...theme.shadow.none,
  },
  // Inner text styles now handled by TaskCard
  emptyView: {
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  loadingText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
  },
});

export default Task;
