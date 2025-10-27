import { theme } from '@/constants/theme';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  children,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  if (children) {
    return (
      <Animated.View style={[styles.container, { opacity }, style]}>
        {children}
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

// Task Card Skeleton
export const TaskCardSkeleton: React.FC = () => (
  <View style={styles.taskCard}>
    <SkeletonLoader height={16} width="80%" style={styles.titleSkeleton} />
    <SkeletonLoader height={14} width="60%" style={styles.textSkeleton} />
    <SkeletonLoader height={14} width="40%" style={styles.textSkeleton} />
    <SkeletonLoader height={14} width="50%" style={styles.textSkeleton} />
  </View>
);

// Profile Header Skeleton
export const ProfileHeaderSkeleton: React.FC = () => (
  <View style={styles.profileHeader}>
    <SkeletonLoader
      width={80}
      height={80}
      borderRadius={40}
      style={styles.avatarSkeleton}
    />
    <SkeletonLoader height={20} width="60%" style={styles.nameSkeleton} />
    <SkeletonLoader
      height={16}
      width="40%"
      style={styles.designationSkeleton}
    />
  </View>
);

// Card Skeleton
export const CardSkeleton: React.FC = () => (
  <View style={styles.card}>
    <SkeletonLoader height={18} width="70%" style={styles.titleSkeleton} />
    <SkeletonLoader height={14} width="90%" style={styles.textSkeleton} />
    <SkeletonLoader height={14} width="60%" style={styles.textSkeleton} />
  </View>
);

// List Item Skeleton
export const ListItemSkeleton: React.FC = () => (
  <View style={styles.listItem}>
    <SkeletonLoader
      width={40}
      height={40}
      borderRadius={20}
      style={styles.avatarSkeleton}
    />
    <View style={styles.listItemContent}>
      <SkeletonLoader height={16} width="70%" style={styles.titleSkeleton} />
      <SkeletonLoader height={14} width="50%" style={styles.textSkeleton} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.gray[200],
  },
  skeleton: {
    backgroundColor: theme.colors.gray[200],
  },
  taskCard: {
    backgroundColor: theme.colors.background.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    margin: theme.spacing.sm,
    ...theme.shadow.sm,
  },
  titleSkeleton: {
    marginBottom: theme.spacing.sm,
  },
  textSkeleton: {
    marginBottom: theme.spacing.xs,
  },
  profileHeader: {
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
  },
  avatarSkeleton: {
    marginBottom: theme.spacing.md,
  },
  nameSkeleton: {
    marginBottom: theme.spacing.sm,
  },
  designationSkeleton: {
    marginBottom: theme.spacing.xs,
  },
  card: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    margin: theme.spacing.sm,
    ...theme.shadow.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  listItemContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
});

export default SkeletonLoader;
