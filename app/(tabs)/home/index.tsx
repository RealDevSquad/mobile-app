import Avatar from "@/components/Avatar";
import QuickActionCard from "@/components/QuickActionCard";
import useCheckUserSession from "@/hooks/getUserToken";
import { useUserStore } from "@/store/store";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  const { userData, fetchUsers, loading } = useUserStore();
  const { token } = useCheckUserSession();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      fetchUsers(token);
    }
  }, [token, fetchUsers]);

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

  const getUserDisplayName = () => {
    if (userData?.first_name) {
      return userData.first_name;
    }
    if (userData?.username) {
      return userData.username;
    }
    return "User";
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require("../../../assets/images/rdsLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
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
    width: 80,
    height: 28,
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
