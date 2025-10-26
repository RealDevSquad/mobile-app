import Avatar from "@/components/Avatar";
import OOOModal from "@/components/Modal/OOOModal";
import QuickActionCard from "@/components/QuickActionCard";
import UserStatusCard from "@/components/UserStatusCard";
import { theme } from "@/constants/theme";
import useCheckUserSession from "@/hooks/getUserToken";
import { useUserStore } from "@/store/store";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  const {
    userData,
    userStatus,
    fetchUsers,
    fetchUserStatus,
    submitOOOForm,
    cancelOOO,
    loading,
  } = useUserStore();
  const { token } = useCheckUserSession();
  const router = useRouter();
  const [isOOOModalVisible, setIsOOOModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (token) {
      fetchUsers(token);
      fetchUserStatus(token);
    }
  }, [token, fetchUsers, fetchUserStatus]);

  if (!token || loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  const handleNavigation = (route: string) => {
    router.push(`/${route}`);
  };

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

  const handleCancelOOO = async () => {
    if (!token) return;

    setIsSubmitting(true);
    try {
      await cancelOOO(token);
      await fetchUserStatus(token);
      Alert.alert("Success", "OOO status cancelled successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to cancel OOO status");
      console.error("Error cancelling OOO:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOOOSubmit = async (
    fromDate: Date,
    toDate: Date,
    reason: string
  ) => {
    if (!token) return;

    setIsSubmitting(true);
    try {
      const fromDateStr = fromDate.toISOString().split("T")[0];
      const toDateStr = toDate.toISOString().split("T")[0];

      await submitOOOForm(
        {
          fromDate: fromDateStr,
          toDate: toDateStr,
          description: reason,
        },
        token
      );

      await fetchUserStatus(token);
      setIsOOOModalVisible(false);
      Alert.alert("Success", "OOO request submitted successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to submit OOO request");
      console.error("Error submitting OOO:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseOOOModal = () => {
    setIsOOOModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
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
            userStatus={userStatus}
            onApplyOOO={handleApplyOOO}
            onCancelOOO={handleCancelOOO}
            isLoading={isSubmitting}
          />
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.quickActionsContainer}>
          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <QuickActionCard
                icon="file-text-o"
                label="Extension Requests"
                onPress={() => handleNavigation("extension-requests")}
              />
            </View>
            <View style={styles.gridItem}>
              <QuickActionCard
                icon="tasks"
                label="Task Requests"
                onPress={() => handleNavigation("task-requests")}
              />
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <QuickActionCard
                icon="check-square-o"
                label="Tasks"
                onPress={() => handleNavigation("tasks")}
              />
            </View>
            <View style={styles.gridItem}>
              <QuickActionCard
                icon="calendar"
                label="Calendar"
                onPress={() => handleNavigation("calendar")}
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
        isLoading={isSubmitting}
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
    fontSize: theme.typography.fontSize.base,
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
});
