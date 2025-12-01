import { useQueries, useQuery } from "@tanstack/react-query";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Pressable, ScrollView, Share, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TaskRequestsApi } from "../../api/task-requests/task-requests.api";
import { GitHubIssueResponse } from "../../api/task-requests/task-requests.types";
import { UsersApi } from "../../api/users/users.api";
import { formatTimestamp, getInitialsFromName } from "../../utils/common.utils";
import { StatusBadge } from "../task-requests/task-request-card/status-badge";
import { TaskRequestActions } from "./task-request-actions";
import { TaskRequestDetailsSkeleton } from "./task-request-details-skeleton";
import styles from "./task-request-details.styles";

type TaskRequestDetailsModuleProps = {
  taskRequestId: string;
};

const fetchGitHubIssue = async (url: string): Promise<GitHubIssueResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch GitHub issue");
  }
  return response.json();
};

export function TaskRequestDetailsModule({ taskRequestId }: TaskRequestDetailsModuleProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: TaskRequestsApi.getTaskRequestById.key(taskRequestId),
    queryFn: () => TaskRequestsApi.getTaskRequestById.fn(taskRequestId),
  });

  const requestorQueries = useQueries({
    queries:
      data?.requestors?.map((requestorId) => ({
        queryKey: UsersApi.getUserById.key(requestorId),
        queryFn: () => UsersApi.getUserById.fn(requestorId),
        enabled: !!data && !!requestorId,
      })) || [],
  });

  const { data: githubIssue } = useQuery({
    queryKey: ["githubIssue", data?.externalIssueUrl],
    queryFn: () => fetchGitHubIssue(data!.externalIssueUrl!),
    enabled: !!data?.externalIssueUrl,
  });

  if (isLoading) {
    return <TaskRequestDetailsSkeleton />;
  }

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load task request details</Text>
          <Text style={styles.errorSubtext}>Please try again later or check your connection</Text>
        </View>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Task request not found</Text>
        </View>
      </View>
    );
  }

  const taskRequest = data;
  const hasGithubLink = taskRequest.externalIssueHtmlUrl;

  const handleGithubPress = () => {
    if (hasGithubLink) {
      WebBrowser.openBrowserAsync(taskRequest.externalIssueHtmlUrl!);
    }
  };

  const handleShare = async () => {
    const shareUrl = `https://status.realdevsquad.com/taskRequests/${taskRequestId}`;
    try {
      await Share.share({
        message: `Check out this task request: ${taskRequest.taskTitle}\n${shareUrl}`,
        url: shareUrl,
        title: taskRequest.taskTitle,
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
            <Text style={styles.title} numberOfLines={2}>
              {taskRequest.taskTitle}
            </Text>
            <Pressable
              style={({ pressed }) => [styles.shareButton, pressed && { opacity: 0.7 }]}
              onPress={handleShare}
            >
              <FontAwesome5 name="share-alt" size={18} color="#6B7280" />
            </Pressable>
          </View>
        </View>

        <View style={styles.contentSection}>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailLabelContainer}>
                <FontAwesome5 name="clock" size={16} color="#6B7280" />
                <Text style={styles.detailLabel}>Status</Text>
              </View>
              <StatusBadge status={taskRequest.status} />
            </View>

            {taskRequest.requestType && (
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <FontAwesome5 name="layer-group" size={16} color="#6B7280" />
                  <Text style={styles.detailLabel}>Request Type</Text>
                </View>
                <View style={styles.typeTag}>
                  <Text style={styles.typeText}>{taskRequest.requestType}</Text>
                </View>
              </View>
            )}

            <View style={styles.detailRow}>
              <View style={styles.detailLabelContainer}>
                <FontAwesome5 name="calendar-alt" size={16} color="#6B7280" />
                <Text style={styles.detailLabel}>Created</Text>
              </View>
              <Text style={styles.detailValue}>{formatTimestamp(taskRequest.createdAt)}</Text>
            </View>

            {taskRequest.lastModifiedAt && (
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <FontAwesome5 name="history" size={16} color="#6B7280" />
                  <Text style={styles.detailLabel}>Last Modified</Text>
                </View>
                <Text style={styles.detailValue}>
                  {formatTimestamp(taskRequest.lastModifiedAt)}
                </Text>
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

          {githubIssue && (
            <View style={styles.githubIssueSection}>
              <Text style={styles.sectionTitle}>GitHub Issue Details</Text>
              <View style={styles.githubIssueCard}>
                <View style={styles.detailRow}>
                  <View style={styles.detailLabelContainer}>
                    <FontAwesome5 name="hashtag" size={16} color="#6B7280" />
                    <Text style={styles.detailLabel}>Issue Number</Text>
                  </View>
                  <Text style={styles.detailValue}>#{githubIssue.number}</Text>
                </View>
                <View style={styles.detailRow}>
                  <View style={styles.detailLabelContainer}>
                    <FontAwesome5 name="info-circle" size={16} color="#6B7280" />
                    <Text style={styles.detailLabel}>State</Text>
                  </View>
                  <Text
                    style={[
                      styles.detailValue,
                      githubIssue.state === "open" ? { color: "#10B981" } : { color: "#6B7280" },
                    ]}
                  >
                    {githubIssue.state.charAt(0).toUpperCase() + githubIssue.state.slice(1)}
                  </Text>
                </View>
                {githubIssue.assignee && (
                  <View style={styles.detailRow}>
                    <View style={styles.detailLabelContainer}>
                      <FontAwesome5 name="user" size={16} color="#6B7280" />
                      <Text style={styles.detailLabel}>Assignee</Text>
                    </View>
                    <Text style={styles.detailValue}>@{githubIssue.assignee.login}</Text>
                  </View>
                )}
                {githubIssue.labels && githubIssue.labels.length > 0 && (
                  <View style={styles.detailRow}>
                    <View style={styles.detailLabelContainer}>
                      <FontAwesome5 name="tags" size={16} color="#6B7280" />
                      <Text style={styles.detailLabel}>Labels</Text>
                    </View>
                    <View style={styles.labelsContainer}>
                      {githubIssue.labels.map((label, idx) => (
                        <View
                          key={idx}
                          style={[
                            styles.labelTag,
                            {
                              backgroundColor: `#${label.color}20`,
                              borderColor: `#${label.color}`,
                            },
                          ]}
                        >
                          <Text style={[styles.labelText, { color: `#${label.color}` }]}>
                            {label.name}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
                {githubIssue.body && (
                  <View style={styles.githubIssueBody}>
                    <Text style={styles.githubIssueBodyText} numberOfLines={5}>
                      {githubIssue.body.replace(/[#*`]/g, "").trim()}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Requestors Section */}
          {taskRequest.requestors && taskRequest.requestors.length > 0 && (
            <View style={styles.usersSection}>
              <Text style={styles.usersTitle}>Requestors ({taskRequest.requestors.length})</Text>
              {taskRequest.requestors.map((requestorId, index) => {
                const userQuery = requestorQueries[index];
                const userData = userQuery?.data?.user;
                const userDetails = taskRequest.users?.find((u) => u.userId === requestorId);

                if (userQuery?.isLoading) {
                  return (
                    <View key={requestorId} style={styles.userCard}>
                      <Text style={styles.loadingText}>Loading user details...</Text>
                    </View>
                  );
                }

                if (userQuery?.error || !userData) {
                  return (
                    <View key={requestorId} style={styles.userCard}>
                      <Text style={styles.errorText}>Failed to load user details</Text>
                    </View>
                  );
                }

                return (
                  <View key={requestorId} style={styles.userCard}>
                    <View style={styles.userHeader}>
                      <View style={styles.userAvatar}>
                        <Text style={styles.userAvatarText}>
                          {getInitialsFromName(
                            `${userData.first_name} ${userData.last_name}`.trim() ||
                              userData.username
                          )}
                        </Text>
                      </View>
                      <View style={styles.userInfo}>
                        <Text style={styles.userName}>
                          {userData.first_name} {userData.last_name}
                        </Text>
                        <Text style={styles.userUsername}>@{userData.username}</Text>
                      </View>
                    </View>
                    {userDetails && (
                      <>
                        <View style={styles.userDetails}>
                          <View style={styles.userDetailRow}>
                            <Text style={styles.userDetailLabel}>Proposed Start Date</Text>
                            <Text style={styles.userDetailValue}>
                              {formatTimestamp(userDetails.proposedStartDate)}
                            </Text>
                          </View>
                          <View style={styles.userDetailRow}>
                            <Text style={styles.userDetailLabel}>Proposed Deadline</Text>
                            <Text style={styles.userDetailValue}>
                              {formatTimestamp(userDetails.proposedDeadline)}
                            </Text>
                          </View>
                          {userDetails.status && (
                            <View style={styles.userDetailRow}>
                              <Text style={styles.userDetailLabel}>Status</Text>
                              <StatusBadge status={userDetails.status} />
                            </View>
                          )}
                        </View>
                        {userDetails.description && (
                          <View style={styles.userDescription}>
                            <Text style={styles.userDescriptionText}>
                              {userDetails.description}
                            </Text>
                          </View>
                        )}
                      </>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
      <TaskRequestActions taskRequest={taskRequest} />
    </View>
  );
}
