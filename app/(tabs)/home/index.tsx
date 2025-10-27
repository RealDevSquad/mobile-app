import { UsersApi } from "@/api/users/users.api";
import Avatar from "@/components/Avatar";
import OOOModal from "@/components/Modal/OOOModal";
import MyTasksCard from "@/components/MyTasksCard";
import QuickActionCard from "@/components/QuickActionCard";
import {
  ProfileHeaderSkeleton,
  TaskCardSkeleton,
} from "@/components/SkeletonLoader";
import UserStatusCard from "@/components/UserStatusCard";
import { theme } from "@/constants/theme";
import useCheckUserSession from "@/hooks/getUserToken";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  const { token } = useCheckUserSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOOOModalVisible, setIsOOOModalVisible] = useState(false);

  const {
    data: userData,
    isLoading: loadingUserData,
    refetch: refetchUserData,
  } = useQuery({
    queryKey: UsersApi.getUserDetails.key,
    queryFn: () => UsersApi.getUserDetails.fn(token || undefined),
    enabled: !!token,
  });

  const {
    data: userStatus,
    isLoading: loadingUserStatus,
    refetch: refetchUserStatus,
  } = useQuery({
    queryKey: UsersApi.getUserStatus.key,
    queryFn: () => UsersApi.getUserStatus.fn(token || undefined),
    enabled: !!token,
  });

  const loading = loadingUserData || loadingUserStatus;

  const handleRefresh = async () => {
    await Promise.all([refetchUserData(), refetchUserStatus()]);
  };

  const submitOOOMutation = useMutation({
    mutationFn: (oooData: {
      fromDate: string;
      toDate: string;
      description: string;
    }) => UsersApi.submitOOOForm.fn(oooData, token || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UsersApi.getUserStatus.key });
      setIsOOOModalVisible(false);
      Alert.alert("Success", "OOO request submitted successfully");
    },
    onError: () => {
      Alert.alert("Error", "Failed to submit OOO request");
    },
  });

  const cancelOOOMutation = useMutation({
    mutationFn: () => UsersApi.cancelOOO.fn(token || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UsersApi.getUserStatus.key });
      Alert.alert("Success", "OOO status cancelled successfully");
    },
    onError: () => {
      Alert.alert("Error", "Failed to cancel OOO status");
    },
  });

  if (!token) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <ProfileHeaderSkeleton />
          </View>
          <View style={styles.cardsContainer}>
            <TaskCardSkeleton />
            <TaskCardSkeleton />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const getUserDisplayName = (): string => {
    if (userData?.first_name) {
      return userData.first_name;
    }
    if (userData?.username) {
      return userData.username;
    }
    return "User";
  };

  const handleApplyOOO = () => {
    setIsOOOModalVisible(true);
  };

  const handleCancelOOO = () => {
    cancelOOOMutation.mutate();
  };

  const handleOOOSubmit = (fromDate: Date, toDate: Date, reason: string) => {
    const fromDateStr = fromDate.toISOString().split("T")[0];
    const toDateStr = toDate.toISOString().split("T")[0];

    submitOOOMutation.mutate({
      fromDate: fromDateStr,
      toDate: toDateStr,
      description: reason,
    });
  };

  const handleCloseOOOModal = () => {
    setIsOOOModalVisible(false);
  };

  const handleMyTasksPress = () => {
    router.push("/my-tasks");
  };

  const handleExtensionRequestsPress = () => {
    router.push("/extension-requests");
  };

  const handleTaskRequestsPress = () => {
    router.push("/task-requests");
  };

  const handleTasksPress = () => {
    router.push("/tasks");
  };

  const handleCalendarPress = () => {
    router.push("/calendar");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary[500]]}
            tintColor={theme.colors.primary[500]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.usernameText}>
              Hello {getUserDisplayName()}!
            </Text>
            <Text style={styles.welcomeText}>Welcome to RDS</Text>
          </View>
          {userData?.picture?.url && (
            <Avatar uri={userData.picture.url} size={40} />
          )}
        </View>

        {/* User Status Card */}
        <View style={styles.userStatusContainer}>
          <UserStatusCard
            userStatus={userStatus || null}
            onApplyOOO={handleApplyOOO}
            onCancelOOO={handleCancelOOO}
            isLoading={
              submitOOOMutation.isPending || cancelOOOMutation.isPending
            }
          />
        </View>

        {/* My Tasks Card */}
        <View>
          <MyTasksCard onPress={handleMyTasksPress} />
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.quickActionsContainer}>
          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <QuickActionCard
                icon="file-text-o"
                label="Extension Requests"
                onPress={handleExtensionRequestsPress}
              />
            </View>
            <View style={styles.gridItem}>
              <QuickActionCard
                icon="tasks"
                label="Task Requests"
                onPress={handleTaskRequestsPress}
              />
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <QuickActionCard
                icon="check-square-o"
                label="Tasks"
                onPress={handleTasksPress}
              />
            </View>
            <View style={styles.gridItem}>
              <QuickActionCard
                icon="calendar"
                label="Calendar"
                onPress={handleCalendarPress}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* OOO Modal */}
      <OOOModal
        isVisible={isOOOModalVisible}
        onSubmit={handleOOOSubmit}
        onClose={handleCloseOOOModal}
        isLoading={submitOOOMutation.isPending}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface.secondary,
  },
  headerTextContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  usernameText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  welcomeText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  logo: {
    width: 40,
    height: 40,
  },
  greetingSection: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing["2xl"],
    backgroundColor: theme.colors.background.primary,
    marginBottom: theme.spacing.md,
  },
  greeting: {
    fontSize: theme.typography.fontSize["2xl"],
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
  },
  quickActionsContainer: {
    paddingHorizontal: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  gridItem: {
    flex: 1,
    marginHorizontal: theme.spacing.sm,
  },
  userStatusContainer: {
    marginTop: theme.spacing.md,
  },
  cardsContainer: {
    paddingHorizontal: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
});
