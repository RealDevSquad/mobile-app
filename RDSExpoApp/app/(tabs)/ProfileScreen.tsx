import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useUserStore } from "@/store/store";
import { Tabs } from "react-native-collapsible-tab-view";
import ActiveScreen from "@/components/ActiveTask";
import Header from "@/components/ProfileHeader";

export default function ProfileScreen() {
  const { userData, loading, tasks, fetchUsers, fetchActiveTask } =
    useUserStore();
  const HEADER_HEIGHT = 250;

  useEffect(() => {
    fetchUsers();
    fetchActiveTask();
  }, [fetchUsers, fetchActiveTask]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading users...</Text>
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
          data={tasks.filter((task) => task.status !== "COMPLETED")}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ActiveScreen tasks={[item]} />}
        />
      </Tabs.Tab>
      <Tabs.Tab name="Completed Tasks">
        <Tabs.FlatList
          data={tasks.filter((task) => task.status === "COMPLETED")}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ActiveScreen tasks={[item]} />}
        />
      </Tabs.Tab>
    </Tabs.Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
