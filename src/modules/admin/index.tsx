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
        <Text style={styles.title}>Dashboard</Text>

        <View style={styles.actionsContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              styles.taskRequestCard,
              pressed && styles.actionCardPressed,
            ]}
            onPress={() => router.push("/(tabs)/task-requests")}
          >
            <View>
              <View style={[styles.actionIconContainer, { backgroundColor: "#FCE7F3" }]}>
                <FontAwesome5 name="file-alt" size={20} color="#E30464" />
              </View>
              <Text style={styles.actionTitle}>Task Requests</Text>
              <Text style={styles.actionDescription}>Manage requests</Text>
            </View>
            <View style={styles.actionArrow}>
              <FontAwesome5 name="arrow-right" size={12} color="#E30464" />
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
            <View>
              <View style={[styles.actionIconContainer, { backgroundColor: "#DBEAFE" }]}>
                <FontAwesome5 name="calendar-plus" size={20} color="#3B82F6" />
              </View>
              <Text style={styles.actionTitle}>Extension Requests</Text>
              <Text style={styles.actionDescription}>Manage extensions</Text>
            </View>
            <View style={styles.actionArrow}>
              <FontAwesome5 name="arrow-right" size={12} color="#3B82F6" />
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
