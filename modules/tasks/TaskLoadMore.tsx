import { theme } from '@/constants/theme';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type TaskLoadMoreProps = {
  isLoading: boolean;
};

export const TaskLoadMore: React.FC<TaskLoadMoreProps> = ({ isLoading }) => {
  if (!isLoading) {
    return null;
  }

  return (
    <View style={styles.footerLoader}>
      <ActivityIndicator size="small" color={theme.colors.primary[500]} />
      <Text style={styles.loadingText}>Loading more tasks...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
