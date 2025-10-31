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

  const staticStyle: ViewStyle = {
    width: width as ViewStyle['width'],
    height: height as ViewStyle['height'],
    borderRadius,
  };

  if (children) {
    return (
      <View style={staticStyle}>
        <Animated.View style={[styles.container, { opacity }, style]}>
          {children}
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={staticStyle}>
      <Animated.View
        style={[
          styles.skeleton,
          {
            width: '100%',
            height: '100%',
            opacity,
          },
          style,
        ]}
      />
    </View>
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

export const HomeHeaderSkeleton: React.FC = () => (
  <View style={styles.homeHeader}>
    <View style={styles.headerTextContainer}>
      <SkeletonLoader height={22} width={180} style={styles.usernameSkeleton} />
      <SkeletonLoader height={16} width={140} style={styles.welcomeSkeleton} />
    </View>
    <SkeletonLoader
      width={40}
      height={40}
      borderRadius={20}
      style={styles.headerAvatarSkeleton}
    />
  </View>
);

export const UserStatusCardSkeleton: React.FC = () => (
  <View style={styles.userStatusCard}>
    <SkeletonLoader height={80} width="100%" borderRadius={theme.radius.md} />
  </View>
);

export const PromoImageSkeleton: React.FC = () => (
  <View style={styles.promoImageContainer}>
    <SkeletonLoader
      height={130}
      width="100%"
      borderRadius={16}
      style={styles.promoImageSkeleton}
    />
  </View>
);

export const QuickActionCardSkeleton: React.FC = () => (
  <View style={styles.quickActionCard}>
    <SkeletonLoader height={120} width="100%" borderRadius={theme.radius.md} />
  </View>
);

export const CreateNewTaskCardSkeleton: React.FC = () => (
  <View style={styles.createNewTaskCard}>
    <SkeletonLoader height={70} width="100%" borderRadius={theme.radius.md} />
  </View>
);

export const HomeScreenSkeleton: React.FC = () => (
  <View style={styles.homeScreenSkeletonContainer}>
    <HomeHeaderSkeleton />
    <View style={styles.homeSkeletonContent}>
      <UserStatusCardSkeleton />
      <PromoImageSkeleton />
      <View style={styles.quickActionsGrid}>
        <View style={styles.gridRow}>
          <View style={styles.gridItem}>
            <QuickActionCardSkeleton />
          </View>
          <View style={styles.gridItem}>
            <QuickActionCardSkeleton />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={styles.gridItem}>
            <QuickActionCardSkeleton />
          </View>
        </View>
        <CreateNewTaskCardSkeleton />
      </View>
    </View>
  </View>
);

// Task Details Skeleton
export const TaskDetailsSkeleton: React.FC = () => (
  <View style={styles.taskDetailsContainer}>
    {/* Header with title and status */}
    <View style={styles.taskDetailsHeader}>
      <SkeletonLoader
        height={18}
        width="70%"
        style={styles.taskTitleSkeleton}
      />
      <SkeletonLoader height={24} width={80} borderRadius={theme.radius.lg} />
    </View>

    {/* Task Details Section */}
    <View style={styles.taskDetailsSection}>
      <View style={styles.taskDetailsSectionHeader}>
        <SkeletonLoader height={16} width="40%" />
        <SkeletonLoader height={24} width={90} borderRadius={theme.radius.sm} />
      </View>
      <View style={styles.taskDetailsInfoRow}>
        <SkeletonLoader height={14} width="25%" />
        <SkeletonLoader height={14} width="60%" />
      </View>
      <View style={styles.taskDetailsInfoRow}>
        <SkeletonLoader height={14} width="20%" />
        <SkeletonLoader height={14} width="55%" />
      </View>
      <View style={styles.taskDetailsInfoRow}>
        <SkeletonLoader height={14} width="30%" />
        <SkeletonLoader height={14} width="50%" />
      </View>
      <View style={styles.taskDetailsInfoRow}>
        <SkeletonLoader height={14} width="35%" />
        <SkeletonLoader height={14} width="65%" />
      </View>
      <View style={styles.taskDetailsInfoRow}>
        <SkeletonLoader height={14} width="45%" />
        <SkeletonLoader height={14} width="60%" />
      </View>
    </View>

    {/* Timeline Section */}
    <View style={styles.taskDetailsSection}>
      <View style={styles.taskDetailsSectionHeader}>
        <SkeletonLoader height={16} width="30%" />
        <SkeletonLoader
          height={24}
          width={100}
          borderRadius={theme.radius.sm}
        />
      </View>
      <View style={styles.taskDetailsInfoRow}>
        <SkeletonLoader height={14} width="35%" />
        <SkeletonLoader height={14} width="50%" />
      </View>
      <View style={styles.taskDetailsInfoRow}>
        <SkeletonLoader height={14} width="30%" />
        <SkeletonLoader height={14} width="55%" />
      </View>
      <View style={styles.taskDetailsInfoRow}>
        <SkeletonLoader height={14} width="35%" />
        <SkeletonLoader height={14} width="20%" />
      </View>
    </View>

    {/* GitHub Link Section */}
    <View style={styles.taskDetailsSection}>
      <View style={styles.taskDetailsInfoRow}>
        <SkeletonLoader height={14} width="40%" />
        <SkeletonLoader height={28} width={60} borderRadius={theme.radius.sm} />
      </View>
    </View>

    {/* Dependencies Section */}
    <View style={styles.taskDetailsSection}>
      <SkeletonLoader
        height={16}
        width="50%"
        style={styles.taskDetailsSectionTitle}
      />
      <View style={styles.taskDetailsDependencyItem}>
        <SkeletonLoader height={14} width="100%" />
      </View>
      <View style={styles.taskDetailsDependencyItem}>
        <SkeletonLoader height={14} width="85%" />
      </View>
    </View>

    {/* Progress Updates Section */}
    <View style={styles.taskDetailsSection}>
      <View style={styles.taskDetailsSectionHeader}>
        <SkeletonLoader height={16} width="45%" />
        <SkeletonLoader
          height={24}
          width={110}
          borderRadius={theme.radius.sm}
        />
      </View>
      {/* Progress Card Skeletons */}
      <View style={styles.taskDetailsProgressCard}>
        <View style={styles.taskDetailsProgressCardHeader}>
          <View style={styles.taskDetailsProgressCardTitle}>
            <SkeletonLoader height={14} width="40%" />
            <SkeletonLoader
              height={12}
              width="60%"
              style={styles.taskDetailsProgressCardSubtitle}
            />
          </View>
          <View style={styles.taskDetailsProgressCardActions}>
            <SkeletonLoader width={24} height={24} borderRadius={12} />
            <View style={styles.taskDetailsProgressCardChevron} />
          </View>
        </View>
      </View>
      <View style={styles.taskDetailsProgressCard}>
        <View style={styles.taskDetailsProgressCardHeader}>
          <View style={styles.taskDetailsProgressCardTitle}>
            <SkeletonLoader height={14} width="45%" />
            <SkeletonLoader
              height={12}
              width="55%"
              style={styles.taskDetailsProgressCardSubtitle}
            />
          </View>
          <View style={styles.taskDetailsProgressCardActions}>
            <SkeletonLoader width={24} height={24} borderRadius={12} />
            <View style={styles.taskDetailsProgressCardChevron} />
          </View>
        </View>
      </View>
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
  homeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  headerTextContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  usernameSkeleton: {
    marginBottom: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  welcomeSkeleton: {
    marginLeft: theme.spacing.sm,
  },
  headerAvatarSkeleton: {},
  userStatusCard: {
    backgroundColor: theme.colors.background.primary,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderRadius: theme.radius.md,
    padding: 0,
    ...theme.shadow.md,
    overflow: 'hidden',
  },
  promoImageContainer: {
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.radius.lg,
    marginVertical: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadow.sm,
  },
  promoImageSkeleton: {},
  quickActionCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.radius.md,
    padding: 0,
    ...theme.shadow.md,
    overflow: 'hidden',
  },
  createNewTaskCard: {
    backgroundColor: theme.colors.background.primary,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.md,
    padding: 0,
    ...theme.shadow.md,
    overflow: 'hidden',
  },
  homeScreenSkeletonContainer: {
    backgroundColor: theme.colors.surface.secondary,
  },
  homeSkeletonContent: {},
  quickActionsGrid: {
    paddingHorizontal: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  gridItem: {
    flex: 1,
    marginHorizontal: theme.spacing.sm,
  },
  taskDetailsContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
  },
  taskDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  taskTitleSkeleton: {
    marginBottom: 0,
  },
  taskDetailsSection: {
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadow.sm,
  },
  taskDetailsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  taskDetailsSectionTitle: {
    marginBottom: theme.spacing.sm,
  },
  taskDetailsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  taskDetailsDependencyItem: {
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
    marginBottom: theme.spacing.xs,
  },
  taskDetailsProgressCard: {
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    ...theme.shadow.md,
  },
  taskDetailsProgressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  taskDetailsProgressCardTitle: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  taskDetailsProgressCardSubtitle: {
    marginTop: 2,
  },
  taskDetailsProgressCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDetailsProgressCardChevron: {
    width: 14,
    height: 14,
    marginLeft: theme.spacing.xs,
    backgroundColor: theme.colors.gray[200],
    borderRadius: 2,
  },
});

export default SkeletonLoader;
