import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { AdminDashboard } from "../admin";
import { UserDashboard } from "./user-dashboard";
import styles from "./dashboard.styles";

export function DashboardModule() {
  const { data: user, isLoading } = useCurrentUser();
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E30464" />
        </View>
      </View>
    );
  }

  const isSuperUser = user?.roles?.super_user === true;

  return isSuperUser ? <AdminDashboard /> : <UserDashboard />;
}
