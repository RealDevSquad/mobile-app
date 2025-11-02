import { theme } from '@/constants/theme';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type TaskRequestLoadMoreProps = {
  isLoading: boolean;
};

export const TaskRequestLoadMore: React.FC<TaskRequestLoadMoreProps> = ({
  isLoading,
}) => {
  if (!isLoading) {
    return null;
  }

  return (
    <View style={styles.loadingMoreContainer}>
      <ActivityIndicator size="small" color={theme.colors.primary[600]} />
      <Text style={styles.loadingMoreText}>Loading more...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
});
