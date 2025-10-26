import Task from "@/components/Task";
import useCheckUserSession from "@/hooks/getUserToken";
import { useUserStore } from "@/store/store";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function MyTasksScreen() {
  const { selfTasks, fetchSelfTasks, loadingSelfTasks, error } = useUserStore();
  const { token } = useCheckUserSession();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      fetchSelfTasks(token);
    }
  }, [token, fetchSelfTasks]);

  const handleTaskPress = (task: any) => {
    router.push(`/my-tasks/${task.id}`);
  };

  if (!token) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (loadingSelfTasks && selfTasks.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Task
        tasks={selfTasks}
        onEndReached={() => {}}
        loading={loadingSelfTasks}
        onTaskPress={handleTaskPress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  subtitle: {
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    color: "#e74c3c",
    textAlign: "center",
  },
});
