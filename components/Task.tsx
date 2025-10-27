import { theme } from '@/constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import moment from 'moment';
import React, { useMemo } from 'react';
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
    const formatTimeAgo = useMemo(
      () => (timestamp: number) => {
        const currentDate = moment();
        const endDate = moment.unix(timestamp);
        return endDate.from(currentDate);
      },
      []
    );

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
          <View style={styles.cardContent}>
            <View style={styles.cardText}>
              <Text style={styles.title}>{item.title || 'Untitled Task'}</Text>
              <Text style={styles.text}>
                Assignee:{' '}
                <Text style={styles.assignee}>
                  {item.assignee || 'Unassigned'}
                </Text>
              </Text>
              <Text style={styles.text}>
                Progress:{' '}
                <Text style={styles.progress}>
                  {item.percentCompleted || 0}%
                </Text>
              </Text>
              <Text style={styles.text}>
                Ends On:{' '}
                <Text style={styles.endsOn}>
                  {item.endsOn ? formatTimeAgo(item.endsOn) : 'Not set'}
                </Text>
              </Text>
              <Text style={styles.text}>
                Started On:{' '}
                <Text style={styles.startedOn}>
                  {item.startedOn
                    ? formatTimeAgo(item.startedOn)
                    : 'Not started'}
                </Text>
              </Text>
              <Text style={[styles.text, styles.status]}>
                Status: {item.status || 'Unknown'}
              </Text>
            </View>
            {showArrow && (
              <FontAwesome
                name="chevron-right"
                size={16}
                color={theme.colors.text.secondary}
                style={styles.chevron}
              />
            )}
          </View>
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
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    margin: theme.spacing.sm,
    backgroundColor: theme.colors.background.primary,
    ...theme.shadow.md,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardText: {
    flex: 1,
  },
  chevron: {
    marginLeft: theme.spacing.sm,
    marginTop: 2,
  },
  title: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: theme.spacing.sm,
    color: theme.colors.primary[700],
  },
  text: {
    fontSize: theme.typography.fontSize.sm,
    marginBottom: 6,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.primary,
  },
  assignee: {
    color: theme.colors.text.secondary,
  },
  progress: {
    color: theme.colors.success[500],
    fontFamily: theme.typography.fontFamily.medium,
  },
  endsOn: {
    color: theme.colors.text.secondary,
  },
  startedOn: {
    color: theme.colors.text.secondary,
  },
  status: {
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.info[500],
  },
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
