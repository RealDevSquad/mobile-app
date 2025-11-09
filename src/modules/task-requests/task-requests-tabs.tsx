import React from "react";
import { Pressable, Text, View } from "react-native";
import styles from "./task-requests.styles";

type TaskRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

type TaskRequestsTabsProps = {
  activeTab: TaskRequestStatus;
  onTabChange: (tab: TaskRequestStatus) => void;
};

export function TaskRequestsTabs({ activeTab, onTabChange }: TaskRequestsTabsProps) {
  return (
    <View style={styles.tabsContainer}>
      <Pressable style={styles.tab} onPress={() => onTabChange("PENDING")}>
        <Text style={[styles.tabText, activeTab === "PENDING" && styles.activeTabText]}>
          Pending
        </Text>
        {activeTab === "PENDING" && <View style={styles.activeIndicator} />}
      </Pressable>
      <Pressable style={styles.tab} onPress={() => onTabChange("APPROVED")}>
        <Text style={[styles.tabText, activeTab === "APPROVED" && styles.activeTabText]}>
          Approved
        </Text>
        {activeTab === "APPROVED" && <View style={styles.activeIndicator} />}
      </Pressable>
      <Pressable style={styles.tab} onPress={() => onTabChange("REJECTED")}>
        <Text style={[styles.tabText, activeTab === "REJECTED" && styles.activeTabText]}>
          Rejected
        </Text>
        {activeTab === "REJECTED" && <View style={styles.activeIndicator} />}
      </Pressable>
    </View>
  );
}
