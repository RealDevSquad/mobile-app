import { UsersApi } from '@/api/users/users.api';
import { removeLocalStorageItem } from '@/common/utils/common';
import ExpandedUserInfo from '@/components/ExpandedUserInfo';
import Header from '@/components/ProfileHeader';
import { TOKEN_KEY } from '@/constants/constants';
import { theme } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { reloadAppAsync } from 'expo';
import { router } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary[600]} />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Failed to load user data</Text>
      </SafeAreaView>
    );
  }

  const headerProps = {
    first_name: userData.first_name || '',
    last_name: userData.last_name || '',
    username: userData.username || '',
    designation: userData.designation || '',
    company: userData.company || '',
    picture: userData.picture || { url: '' },
    github_id: userData.github_id || '',
    twitter_id: userData.twitter_id || '',
    linkedin_id: userData.linkedin_id || '',
    // Note: location field may not be in UserData DTO, but will be displayed if available
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Header {...headerProps} />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loadingUserData}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary[500]]}
            tintColor={theme.colors.primary[500]}
          />
        }
      >
        <ExpandedUserInfo userData={userData} />
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            accessibilityRole="button"
            accessibilityLabel="Logout"
            testID="logout-button"
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  headerContainer: {
    backgroundColor: theme.colors.background.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  logoutContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  logoutButton: {
    width: '100%',
    backgroundColor: theme.colors.error[500],
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.md,
  },
  logoutButtonText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.bold,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  errorText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.error[500],
    textAlign: 'center',
  },
});
