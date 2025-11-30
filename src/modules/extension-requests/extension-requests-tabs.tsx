import React from "react";
import { Pressable, Text, View } from "react-native";
import styles from "./extension-requests.styles";

type ExtensionRequestStatus = "PENDING" | "APPROVED" | "DENIED";

type ExtensionRequestsTabsProps = {
  activeTab: ExtensionRequestStatus;
  onTabChange: (tab: ExtensionRequestStatus) => void;
};

export function ExtensionRequestsTabs({ activeTab, onTabChange }: ExtensionRequestsTabsProps) {
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
      <Pressable style={styles.tab} onPress={() => onTabChange("DENIED")}>
        <Text style={[styles.tabText, activeTab === "DENIED" && styles.activeTabText]}>
          Rejected
        </Text>
        {activeTab === "DENIED" && <View style={styles.activeIndicator} />}
      </Pressable>
    </View>
  );
}
