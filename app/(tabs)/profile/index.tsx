import { UsersApi } from '@/api/users/users.api';
import { removeLocalStorageItem } from '@/common/utils/common';
import { ErrorState } from '@/components/ErrorState';
import { TOKEN_KEY } from '@/constants/constants';
import { theme } from '@/constants/theme';
import { ProfileContent } from '@/modules/profile/ProfileContent';
import { ProfileLoadingState } from '@/modules/profile/ProfileLoadingState';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { reloadAppAsync } from 'expo';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  const {
    data: userData,
    isLoading: loadingUserData,
    refetch: refetchUserData,
  } = useQuery({
    queryKey: UsersApi.getUserDetails.key,
    queryFn: () => UsersApi.getUserDetails.fn(),
    enabled: true,
  });

  const handleRefresh = async () => {
    await refetchUserData();
  };

  const handleLogout = async () => {
    try {
      useAuthStore.getState().logout();
      await removeLocalStorageItem(TOKEN_KEY);
      router.replace('/');
      reloadAppAsync();
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  if (loadingUserData) {
    return <ProfileLoadingState />;
  }

  if (!userData) {
    return (
      <ErrorState
        defaultMessage="Failed to load user data"
        wrapInSafeArea={true}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ProfileContent
        userData={userData}
        isRefreshing={loadingUserData}
        onRefresh={handleRefresh}
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
});
