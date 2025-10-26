import Avatar from "@/components/Avatar";
import OOOModal from "@/components/Modal/OOOModal";
import QuickActionCard from "@/components/QuickActionCard";
import UserStatusCard from "@/components/UserStatusCard";
import useCheckUserSession from "@/hooks/getUserToken";
import { useUserStore } from "@/store/store";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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
      await fetchUserStatus(token); // Refresh status
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

      await fetchUserStatus(token); // Refresh status
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
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../assets/images/rdsLogo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>RDS</Text>
          </View>
          {userData?.picture?.url && (
            <Avatar uri={userData.picture.url} size={40} />
          )}
        </View>

        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>
            Ready to make today awesome, {getUserDisplayName()}?
          </Text>
        </View>

        {/* User Status Card */}
        <UserStatusCard
          userStatus={userStatus}
          onApplyOOO={handleApplyOOO}
          onCancelOOO={handleCancelOOO}
          isLoading={isSubmitting}
        />

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
    backgroundColor: "#f5f5f5",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontSize: 28,
    fontWeight: "semibold",
    color: "#333333",
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  logo: {
    width: 40,
    height: 40,
  },
  greetingSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
  },
  quickActionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  gridItem: {
    flex: 1,
    marginHorizontal: 8,
  },
});
