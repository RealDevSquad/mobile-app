import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import styles from "./admin.styles";

export function AdminDashboard() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <FontAwesome5 name="user-shield" size={32} color="#E30464" />
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Super User Panel</Text>
        </View>

        <View style={styles.actionsContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              styles.taskRequestCard,
              pressed && styles.actionCardPressed,
            ]}
            onPress={() => router.push("/(tabs)/task-requests")}
          >
            <View style={styles.actionIconContainer}>
              <FontAwesome5 name="file-alt" size={24} color="#E30464" />
            </View>
            <Text style={styles.actionTitle}>Task Requests</Text>
            <Text style={styles.actionDescription}>View and manage all task requests</Text>
            <View style={styles.actionArrow}>
              <FontAwesome5 name="chevron-right" size={14} color="#E30464" />
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              styles.extensionRequestCard,
              pressed && styles.actionCardPressed,
            ]}
            onPress={() => router.push("/(tabs)/extension-requests")}
          >
            <View style={styles.actionIconContainer}>
              <FontAwesome5 name="calendar-plus" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.actionTitle}>Extension Requests</Text>
            <Text style={styles.actionDescription}>View and manage extension requests</Text>
            <View style={styles.actionArrow}>
              <FontAwesome5 name="chevron-right" size={14} color="#3B82F6" />
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
