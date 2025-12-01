import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { TaskRequestDTO } from "../../../api/task-requests/task-request.dto";
import { formatDateShort } from "../../../utils/common.utils";
import { StatusBadge } from "./status-badge";
import styles from "./task-request-card.styles";

export { TaskRequestCardSkeleton } from "./task-request-card-skeleton";

type TaskRequestCardProps = {
  taskRequest: TaskRequestDTO;
  onPress?: () => void;
};

export function TaskRequestCard({ taskRequest, onPress }: TaskRequestCardProps) {
  const hasGithubLink = taskRequest.externalIssueHtmlUrl;

  const handleGithubPress = () => {
    if (hasGithubLink) {
      WebBrowser.openBrowserAsync(taskRequest.externalIssueHtmlUrl!);
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
            {taskRequest.taskTitle}
          </Text>
        </View>
        <StatusBadge status={taskRequest.status} />
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Requestors:</Text>
          <Text style={styles.infoValue}>
            {taskRequest.usersCount} {taskRequest.usersCount === 1 ? "user" : "users"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Created:</Text>
          <Text style={styles.infoValue}>{formatDateShort(taskRequest.createdAt)}</Text>
        </View>

        {!!taskRequest.requestType && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type:</Text>
            <Text style={styles.infoValue}>{taskRequest.requestType}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.footerLeft}>
          <View style={styles.dateContainer}>
            <FontAwesome5 name="calendar-alt" size={12} color="#6B7280" />
            <Text style={styles.dateText}>{formatDateShort(taskRequest.createdAt)}</Text>
          </View>
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
