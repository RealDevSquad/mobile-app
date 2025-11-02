import ExpandedUserInfo from '@/components/ExpandedUserInfo';
import Header from '@/components/ProfileHeader';
import { theme } from '@/constants/theme';
import { UserData } from '@/api/users/user.dto';
import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { ProfileLogoutButton } from './ProfileLogoutButton';

type ProfileContentProps = {
  userData: UserData;
  isRefreshing: boolean;
  onRefresh: () => void;
  onLogout: () => void;
};

export const ProfileContent: React.FC<ProfileContentProps> = ({
  userData,
  isRefreshing,
  onRefresh,
  onLogout,
}) => {
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
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <Header {...headerProps} />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary[500]]}
            tintColor={theme.colors.primary[500]}
          />
        }
      >
        <ExpandedUserInfo userData={userData} />
        <View style={styles.logoutContainer}>
          <ProfileLogoutButton onPress={onLogout} />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
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
});
