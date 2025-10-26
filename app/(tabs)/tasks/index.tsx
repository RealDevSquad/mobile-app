import Task from "@/components/Task";
import UserSearchModal from "@/components/UserSearchModal";
import useCheckUserSession from "@/hooks/getUserToken";
import { useUserStore } from "@/store/store";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TasksScreen() {
  const {
    allTasks,
    fetchTasks,
    loadingTasks,
    error,
    hasMoreTasks,
    tasksNext,
    selectedAssignee,
    setSelectedAssignee,
    clearSearchResults,
  } = useUserStore();
  const { token } = useCheckUserSession();
  const isLoadingMore = useRef(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    if (token) {
      fetchTasks(token, undefined, selectedAssignee ?? undefined);
    }
  }, [token, fetchTasks, selectedAssignee]);

  const handleLoadMore = useCallback(() => {
    if (hasMoreTasks && !loadingTasks && !isLoadingMore.current && token) {
      isLoadingMore.current = true;
      fetchTasks(token, tasksNext, selectedAssignee ?? undefined).finally(
        () => {
          isLoadingMore.current = false;
        }
      );
    }
  }, [
    hasMoreTasks,
    loadingTasks,
    tasksNext,
    token,
    fetchTasks,
    selectedAssignee,
  ]);

  const handleUserSelect = (username: string) => {
    setSelectedAssignee(username);
  };

  const handleClearFilter = () => {
    setSelectedAssignee(null);
    clearSearchResults();
  };

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
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => setShowSearchModal(true)}
        >
          <Text style={styles.searchButtonText}>
            {selectedAssignee
              ? `Filter: ${selectedAssignee}`
              : "Filter by User"}
          </Text>
        </TouchableOpacity>
      </View>

      {selectedAssignee && (
        <View style={styles.filterContainer}>
          <Text style={styles.filterText}>
            Showing tasks for:{" "}
            <Text style={styles.filterUser}>{selectedAssignee}</Text>
          </Text>
          <TouchableOpacity
            onPress={handleClearFilter}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      <Task
        tasks={allTasks}
        onEndReached={handleLoadMore}
        loading={loadingTasks}
      />

      <UserSearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onUserSelect={handleUserSelect}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    flex: 1,
  },
  searchButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#BBDEFB",
  },
  filterText: {
    fontSize: 14,
    color: "#1976D2",
    flex: 1,
  },
  filterUser: {
    fontWeight: "bold",
  },
  clearButton: {
    backgroundColor: "#FF5722",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
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
