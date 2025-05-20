import Header from "@/components/ProfileHeader";
import Task from "@/components/Task";
import useCheckUserSession from "@/hooks/getUserToken";
import { useUserStore } from "@/store/store";
import { useNetInfo } from "@react-native-community/netinfo";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";

export default function ProfileScreen() {
  const { userData, loading, tasks, fetchUsers, fetchActiveTask } =
    useUserStore();
  const HEADER_HEIGHT = 250;
  const { token } = useCheckUserSession(); // Get token
  const { type, isConnected } = useNetInfo();

  useEffect(() => {
    if (token) {
      // Only call fetchUsers and fetchActiveTask when token is available
      fetchUsers(token);
      fetchActiveTask(token);
    }
  }, [token, fetchUsers, fetchActiveTask]);

  if (!token || loading) {
    // Show loading indicator while token or store is loading
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Tabs.Container
      renderHeader={() => <Header {...userData} />}
      headerHeight={HEADER_HEIGHT}
    >
      <Tabs.Tab name="Active Tasks">
        <Tabs.FlatList
          data={tasks.filter((task) => task.percentCompleted !== 100)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Task tasks={[item]} />}
        />
      </Tabs.Tab>
      <Tabs.Tab name="Completed Tasks">
        <Tabs.FlatList
          data={tasks.filter((task) => task.percentCompleted === 100)}
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
