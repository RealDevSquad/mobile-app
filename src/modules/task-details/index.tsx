import { useQuery } from "@tanstack/react-query";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Pressable, ScrollView, Share, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TasksApi } from "../../api/tasks/tasks.api";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { getInitialsFromName } from "../../utils/common.utils";
import {
  getDaysUntilDue,
  getPriorityColor,
  getPriorityLabel,
  isOverdue,
} from "../tasks/task-card/task-card.utils";
import { StatusBadge } from "../tasks/task-card/status-badge";
import { ProgressAccordion } from "./progress-accordion";
import { TaskActions } from "./task-actions";
import { TaskDetailsSkeleton } from "./task-details-skeleton";
import styles from "./task-details.styles";

type TaskDetailsModuleProps = {
  taskId: string;
};

export function TaskDetailsModule({ taskId }: TaskDetailsModuleProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();

  const { data, isLoading, error } = useQuery({
    queryKey: TasksApi.getTaskDetails.key(taskId),
    queryFn: () => TasksApi.getTaskDetails.fn(taskId),
  });

  const { data: progressData } = useQuery({
    queryKey: TasksApi.getTaskProgress.key(taskId),
    queryFn: () => TasksApi.getTaskProgress.fn(taskId),
    enabled: !!taskId,
  });

  if (isLoading) {
    return <TaskDetailsSkeleton />;
  }

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load task details</Text>
          <Text style={styles.errorSubtext}>Please try again later or check your connection</Text>
        </View>
      </View>
    );
  }

  if (!data?.taskData) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Task not found</Text>
        </View>
      </View>
    );
  }

  const task = data.taskData;
  const priorityColor = getPriorityColor(task.priority);
  const daysUntilDue = getDaysUntilDue(task.endsOn);
  const overdue = isOverdue(task.endsOn);
  const hasGithubLink = task.github?.issue?.html_url;
  const hasDependencies = task.dependsOn && task.dependsOn.length > 0;
  const isAssignee = task.assignee === currentUser?.username;

  const handleGithubPress = () => {
    if (hasGithubLink) {
      WebBrowser.openBrowserAsync(task.github.issue.html_url);
    }
  };

  const handleShare = async () => {
    const shareUrl = `https://status.realdevsquad.com/tasks/${taskId}`;
    try {
      await Share.share({
        message: `Check out this task: ${task.title}\n${shareUrl}`,
        url: shareUrl,
        title: task.title,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, flex: 1 }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <View style={styles.headerContent}>
            <Pressable
              style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
              onPress={() => router.back()}
            >
              <FontAwesome5 name="arrow-left" size={18} color="#6B7280" />
            </Pressable>
            <Text style={styles.title}>{task.title}</Text>
            <Pressable
              style={({ pressed }) => [styles.shareButton, pressed && { opacity: 0.7 }]}
              onPress={handleShare}
            >
              <FontAwesome5 name="share-alt" size={18} color="#6B7280" />
            </Pressable>
          </View>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressPercentage}>{task.percentCompleted}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${task.percentCompleted}%` }]} />
          </View>
        </View>

        <View style={styles.contentSection}>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailLabelContainer}>
                <FontAwesome5 name="clock" size={16} color="#6B7280" />
                <Text style={styles.detailLabel}>Status</Text>
              </View>
              <StatusBadge status={task.status} />
            </View>

            {task.endsOn ? (
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <FontAwesome5 name="calendar-alt" size={16} color="#6B7280" />
                  <Text style={styles.detailLabel}>Due date</Text>
                </View>
                <Text
                  style={[
                    styles.detailValue,
                    overdue && { color: "#EF4444" },
                    daysUntilDue <= 3 && !overdue && { color: "#F59E0B" },
                  ]}
                >
                  {new Date(task.endsOn * 1000).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>
            ) : null}

            <View style={styles.detailRow}>
              <View style={styles.detailLabelContainer}>
                <FontAwesome5 name="user-friends" size={16} color="#6B7280" />
                <Text style={styles.detailLabel}>Assignee</Text>
              </View>
              <View style={styles.assigneeContainer}>
                <View style={styles.assigneeAvatar}>
                  <Text style={styles.assigneeAvatarText}>
                    {getInitialsFromName(task.assignee || "Unassigned")}
                  </Text>
                </View>
                <Text style={styles.assigneeName}>{task.assignee || "Unassigned"}</Text>
              </View>
            </View>

            {!!task.priority && (
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <FontAwesome5 name="tag" size={16} color="#6B7280" />
                  <Text style={styles.detailLabel}>Priority</Text>
                </View>
                <View
                  style={[
                    styles.priorityTag,
                    {
                      backgroundColor: `${priorityColor}15`,
                      borderColor: priorityColor,
                    },
                  ]}
                >
                  <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
                  <Text style={[styles.priorityText, { color: priorityColor }]}>
                    {getPriorityLabel(task.priority)}
                  </Text>
                </View>
              </View>
            )}

            {!!task.type && (
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <FontAwesome5 name="layer-group" size={16} color="#6B7280" />
                  <Text style={styles.detailLabel}>Type</Text>
                </View>
                <View style={styles.typeTag}>
                  <Text style={styles.typeText}>{task.type}</Text>
                </View>
              </View>
            )}
          </View>

          {hasGithubLink ? (
            <View style={styles.githubSection}>
              <Pressable
                style={({ pressed }) => [styles.githubButton, pressed && { opacity: 0.8 }]}
                onPress={handleGithubPress}
              >
                <FontAwesome5 name="github" size={14} color="#FFFFFF" />
                <Text style={styles.githubButtonText}>View on GitHub</Text>
              </Pressable>
            </View>
          ) : null}

          <ProgressAccordion progressUpdates={progressData?.data || []} />

          {hasDependencies && (
            <View style={styles.dependenciesSection}>
              <Text style={styles.dependenciesTitle}>Dependencies</Text>
              {task.dependsOn.map((depId) => (
                <View key={depId} style={styles.dependencyItem}>
                  <Text style={styles.dependencyText}>Task ID: {depId}</Text>
                </View>
              ))}
            </View>
          )}

          {!hasDependencies && (
            <View style={styles.dependenciesSection}>
              <Text style={styles.dependenciesTitle}>Dependencies</Text>
              <Text style={styles.emptyDependencies}>No dependencies</Text>
            </View>
          )}
        </View>
      </ScrollView>
      {isAssignee && <TaskActions taskId={taskId} task={task} />}
    </View>
  );
}
