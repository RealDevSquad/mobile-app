import { UsersApi } from '@/api/users/users.api';
import Avatar from '@/components/Avatar';
import InfoCarousel from '@/components/InfoCarousel';
import OOOModal from '@/components/Modal/OOOModal';
import { HomeScreenSkeleton } from '@/components/SkeletonLoader';
import UserStatusCard from '@/components/UserStatusCard';
import { theme } from '@/constants/theme';
import { useOOOModal } from '@/store/uiStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import {
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const infoCards = [
  {
    title: 'What is RDS',
    description:
      'Real Dev Squad is a community-driven platform that helps developers grow their skills through real-world projects.',
    url: 'https://www.realdevsquad.com/',
  },
  {
    title: 'Stride by RDS',
    description:
      'Task Management Made Effortless. The task manager that adapts to how you work. Perfect for solo or team projects.',
    url: 'https://todo.realdevsquad.com/',
  },
  {
    title: 'URL Shortener by RDS',
    description:
      'A simple and powerful URL shortening service built by the RDS community. Create short links and track URLs easily.',
    url: 'https://tiny.realdevsquad.com/',
  },
];

export default function HomeScreen() {
  const queryClient = useQueryClient();
  const {
    isOpen: isOOOModalVisible,
    open: openOOOModal,
    close: closeOOOModal,
  } = useOOOModal();

  const {
    data: userData,
    isLoading: loadingUserData,
    refetch: refetchUserData,
  } = useQuery({
    queryKey: UsersApi.getUserDetails.key,
    queryFn: () => UsersApi.getUserDetails.fn(),
    enabled: true,
  });

  const {
    data: userStatus,
    isLoading: loadingUserStatus,
    refetch: refetchUserStatus,
  } = useQuery({
    queryKey: UsersApi.getUserStatus.key,
    queryFn: () => UsersApi.getUserStatus.fn(),
    enabled: true,
  });

  const loading = loadingUserData || loadingUserStatus;

  const handleRefresh = async () => {
    await Promise.all([refetchUserData(), refetchUserStatus()]);
  };

  const submitOOOMutation = useMutation({
    mutationFn: (oooData: {
      fromDate: string;
      toDate: string;
      description: string;
    }) => UsersApi.submitOOOForm.fn(oooData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UsersApi.getUserStatus.key });
      closeOOOModal();
      Alert.alert('Success', 'OOO request submitted successfully');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to submit OOO request');
    },
  });

  const cancelOOOMutation = useMutation({
    mutationFn: () => UsersApi.cancelOOO.fn(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UsersApi.getUserStatus.key });
      Alert.alert('Success', 'OOO status cancelled successfully');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to cancel OOO status');
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <HomeScreenSkeleton />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const getUserDisplayName = (): string => {
    if (userData?.first_name) {
      return userData.first_name;
    }
    if (userData?.username) {
      return userData.username;
    }
    return 'User';
  };

  const handleApplyOOO = () => {
    openOOOModal();
  };

  const handleCancelOOO = () => {
    cancelOOOMutation.mutate();
  };

  const handleOOOSubmit = (fromDate: Date, toDate: Date, reason: string) => {
    const fromDateStr = fromDate.toISOString().split('T')[0];
    const toDateStr = toDate.toISOString().split('T')[0];

    submitOOOMutation.mutate({
      fromDate: fromDateStr,
      toDate: toDateStr,
      description: reason,
    });
  };

  const handleCloseOOOModal = () => {
    closeOOOModal();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary[500]]}
            tintColor={theme.colors.primary[500]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.usernameText}>
              Hello {getUserDisplayName()}!
            </Text>
            <Text style={styles.welcomeText}>Welcome to RDS</Text>
          </View>
          {userData?.picture?.url && (
            <Avatar uri={userData.picture.url} size={40} />
          )}
        </View>

        {/* User Status Card */}
        <View style={styles.userStatusContainer}>
          <UserStatusCard
            userStatus={userStatus || null}
            onApplyOOO={handleApplyOOO}
            onCancelOOO={handleCancelOOO}
            isLoading={
              submitOOOMutation.isPending || cancelOOOMutation.isPending
            }
          />
        </View>

        <View style={styles.carouselContainer}>
          <InfoCarousel cards={infoCards} />
        </View>
      </ScrollView>

      {/* OOO Modal */}
      <OOOModal
        isVisible={isOOOModalVisible}
        onSubmit={handleOOOSubmit}
        onClose={handleCloseOOOModal}
        isLoading={submitOOOMutation.isPending}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface.secondary,
  },
  headerTextContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  usernameText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  welcomeText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    paddingTop: 20,
    borderBottomColor: theme.colors.border.primary,
  },
  userStatusContainer: {
    marginTop: theme.spacing.sm,
  },
  carouselContainer: {
    marginVertical: theme.spacing.sm,
  },
});
