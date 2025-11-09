import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { TaskDTO } from "../../../api/tasks/task.dto";
import {
  formatDate,
  getAssigneeInitials,
  getDaysUntilDue,
  getPriorityColor,
  getPriorityLabel,
  isOverdue,
} from "./task-card.utils";
import { StatusBadge } from "./status-badge";
import styles from "./task-card.styles";

export { TaskCardSkeleton } from "./task-card-skeleton";

type TaskCardProps = {
  task: TaskDTO;
  onPress?: () => void;
};

export function TaskCard({ task, onPress }: TaskCardProps) {
  const priorityColor = getPriorityColor(task.priority);
  const daysUntilDue = getDaysUntilDue(task.endsOn);
  const overdue = isOverdue(task.endsOn);
  const hasGithubLink = task.github?.issue?.html_url;

  const handleGithubPress = () => {
    if (hasGithubLink) {
      WebBrowser.openBrowserAsync(task.github.issue.html_url);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {task.title}
          </Text>
        </View>
        <StatusBadge status={task.status} />
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Assignee:</Text>
          <View style={styles.assigneeContainer}>
            <View style={styles.assigneeAvatar}>
              <Text style={styles.assigneeAvatarText}>{getAssigneeInitials(task.assignee)}</Text>
            </View>
            <Text style={styles.assigneeName}>{task.assignee || "Unassigned"}</Text>
          </View>
        </View>

        {!!task.type && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type:</Text>
            <Text style={styles.infoValue}>{task.type}</Text>
          </View>
        )}

        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressPercentage}>{task.percentCompleted}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${task.percentCompleted}%` }]} />
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.footerLeft}>
          {!!task.priority && (
            <View style={[styles.priorityBadge, { backgroundColor: `${priorityColor}15` }]}>
              <Text style={[styles.priorityText, { color: priorityColor }]}>
                {getPriorityLabel(task.priority)}
              </Text>
            </View>
          )}
          {!!task.endsOn && (
            <View style={styles.dueDateContainer}>
              <FontAwesome5 name="calendar-alt" size={12} color={overdue ? "#EF4444" : "#6B7280"} />
              <Text
                style={[
                  styles.dueDateText,
                  overdue && styles.overdueText,
                  daysUntilDue <= 3 && !overdue && { color: "#F59E0B" },
                ]}
              >
                {formatDate(task.endsOn)}
              </Text>
            </View>
          )}
        </View>
        {!!hasGithubLink && (
          <Pressable onPress={handleGithubPress} style={styles.githubIcon}>
            <FontAwesome5 name="github" size={18} color="#1F2937" />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}
