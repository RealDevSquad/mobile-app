import React from "react";
import { Pressable, Text, View } from "react-native";
import styles from "./tasks.styles";

type TasksTabsProps = {
  activeTab: "tasks" | "my-tasks";
  onTabChange: (tab: "tasks" | "my-tasks") => void;
};

export function TasksTabs({ activeTab, onTabChange }: TasksTabsProps) {
  return (
    <View style={styles.tabsContainer}>
      <Pressable style={styles.tab} onPress={() => onTabChange("tasks")}>
        <Text style={[styles.tabText, activeTab === "tasks" && styles.activeTabText]}>Tasks</Text>
        {activeTab === "tasks" && <View style={styles.activeIndicator} />}
      </Pressable>
      <Pressable style={styles.tab} onPress={() => onTabChange("my-tasks")}>
        <Text style={[styles.tabText, activeTab === "my-tasks" && styles.activeTabText]}>
          My Tasks
        </Text>
        {activeTab === "my-tasks" && <View style={styles.activeIndicator} />}
      </Pressable>
    </View>
  );
}
