import { TasksApi } from '@/api/tasks/tasks.api';
import { UsersApi } from '@/api/users/users.api';
import Header from '@/components/ProfileHeader';
import Task from '@/components/Task';
import { theme } from '@/constants/theme';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialTabBar, Tabs } from 'react-native-collapsible-tab-view';

export default function ProfileScreen() {
  const HEADER_HEIGHT = 250;

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
    data: tasks,
    isLoading: loadingTasks,
    refetch: refetchTasks,
  } = useQuery({
    queryKey: TasksApi.getSelfTasks.key,
    queryFn: () => TasksApi.getSelfTasks.fn(),
    enabled: true,
  });

  const loading = loadingUserData || loadingTasks;

  const handleRefresh = async () => {
    await Promise.all([refetchUserData(), refetchTasks()]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderTabBar = (props: any) => (
    <MaterialTabBar
      {...props}
      indicatorStyle={styles.tabIndicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
      activeColor={theme.colors.primary[600]}
      inactiveColor={theme.colors.text.secondary}
    />
  );

  return (
    <Tabs.Container
      renderHeader={() => <Header {...(userData || {})} />}
      headerHeight={HEADER_HEIGHT}
      renderTabBar={renderTabBar}
      tabBarHeight={50}
    >
      <Tabs.Tab name="Active Tasks">
        <Tabs.FlatList
          data={(tasks || []).filter(
            (task: any) => task.percentCompleted !== 100
          )}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Task tasks={[item]} />}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary[500]]}
              tintColor={theme.colors.primary[500]}
            />
          }
        />
      </Tabs.Tab>
      <Tabs.Tab name="Completed Tasks">
        <Tabs.FlatList
          data={(tasks || []).filter(
            (task: any) => task.percentCompleted === 100
          )}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Task tasks={[item]} />}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary[500]]}
              tintColor={theme.colors.primary[500]}
            />
          }
        />
      </Tabs.Tab>
    </Tabs.Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
    paddingHorizontal: theme.spacing.md,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    textTransform: 'none',
    marginHorizontal: theme.spacing.xs,
  },
  tabIndicator: {
    backgroundColor: theme.colors.primary[600],
    height: 3,
    borderRadius: 2,
  },
});
