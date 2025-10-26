import Task from "@/components/Task";
import useCheckUserSession from "@/hooks/getUserToken";
import { useUserStore } from "@/store/store";
import React, { useCallback, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function TasksScreen() {
  const { allTasks, fetchTasks, loadingTasks, error, hasMoreTasks, tasksNext } =
    useUserStore();
  const { token } = useCheckUserSession();
  const isLoadingMore = useRef(false);

  useEffect(() => {
    if (token) {
      fetchTasks(token);
    }
  }, [token, fetchTasks]);

  const handleLoadMore = useCallback(() => {
    console.log("handleLoadMore called", {
      hasMoreTasks,
      loadingTasks,
      tasksNext,
      isLoadingMore: isLoadingMore.current,
    });

    if (hasMoreTasks && !loadingTasks && !isLoadingMore.current && token) {
      isLoadingMore.current = true;
      console.log("Fetching more tasks with next:", tasksNext);
      fetchTasks(token, tasksNext).finally(() => {
        isLoadingMore.current = false;
      });
    }
  }, [hasMoreTasks, loadingTasks, tasksNext, token, fetchTasks]);

  if (!token) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (loadingTasks && allTasks.length === 0) {
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
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
      </View>
      <Task
        tasks={allTasks}
        onEndReached={handleLoadMore}
        loading={loadingTasks}
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
  },
});
