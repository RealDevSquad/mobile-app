import { TasksApi } from "@/api/tasks/tasks.api";
import { UsersApi } from "@/api/users/users.api";
import Header from "@/components/ProfileHeader";
import Task from "@/components/Task";
import useCheckUserSession from "@/hooks/getUserToken";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";

export default function ProfileScreen() {
  const HEADER_HEIGHT = 250;
  const { token } = useCheckUserSession();

  const { data: userData, isLoading: loadingUserData } = useQuery({
    queryKey: UsersApi.getUserDetails.key,
    queryFn: () => UsersApi.getUserDetails.fn(token || undefined),
    enabled: !!token,
  });

  const { data: tasks, isLoading: loadingTasks } = useQuery({
    queryKey: TasksApi.getSelfTasks.key,
    queryFn: () => TasksApi.getSelfTasks.fn(token || undefined),
    enabled: !!token,
  });

  const loading = loadingUserData || loadingTasks;

  if (!token || loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Tabs.Container
      renderHeader={() => <Header {...(userData || {})} />}
      headerHeight={HEADER_HEIGHT}
    >
      <Tabs.Tab name="Active Tasks">
        <Tabs.FlatList
          data={(tasks || []).filter(
            (task: any) => task.percentCompleted !== 100
          )}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Task tasks={[item]} />}
        />
      </Tabs.Tab>
      <Tabs.Tab name="Completed Tasks">
        <Tabs.FlatList
          data={(tasks || []).filter(
            (task: any) => task.percentCompleted === 100
          )}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Task tasks={[item]} />}
        />
      </Tabs.Tab>
    </Tabs.Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
