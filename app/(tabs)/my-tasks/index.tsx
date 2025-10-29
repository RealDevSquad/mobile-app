import { TasksApi } from '@/api/tasks/tasks.api';
import { TaskCardSkeleton } from '@/components/SkeletonLoader';
import Task from '@/components/Task';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function MyTasksScreen() {
  const router = useRouter();

  const {
    data: selfTasksData,
    isLoading: loadingSelfTasks,
    isError,
    error,
  } = useQuery({
    queryKey: TasksApi.getSelfTasks.key,
    queryFn: () => TasksApi.getSelfTasks.fn(),
    enabled: true,
  });

  const selfTasks = (selfTasksData || []).filter((task) => {
    if (!task || !task.id) {
      console.warn('Invalid self task data received:', task);
      return false;
    }
    return true;
  });

  const handleTaskPress = (task: any) => {
    router.push(`/my-tasks/${task.id}`);
  };

  if (loadingSelfTasks && selfTasks.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ padding: 12 }}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <TaskCardSkeleton key={`mytask-skeleton-${idx + 1}`} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Error: {error?.message || 'Failed to load tasks'}
          </Text>
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
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#e74c3c',
    textAlign: 'center',
  },
});
