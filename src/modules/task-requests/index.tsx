import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { TaskRequestsList } from "./task-requests-list";
import { TaskRequestsTabs } from "./task-requests-tabs";
import styles from "./task-requests.styles";

type TaskRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export function TaskRequestsModule() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TaskRequestStatus>("PENDING");

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          onPress={() => router.push("/(tabs)/dashboard")}
        >
          <FontAwesome5 name="arrow-left" size={20} color="#1F2937" />
        </Pressable>
        <Text style={styles.headerTitle}>Task Requests</Text>
        <View style={styles.placeholder} />
      </View>

      <TaskRequestsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <View style={styles.contentContainer}>
        <TaskRequestsList status={activeTab} />
      </View>
    </View>
  );
}
