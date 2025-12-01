import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { SwipeableTabs } from "../../components/SwipeableTabs";
import { ExtensionRequestsList } from "./extension-requests-list";
import styles from "./extension-requests.styles";

type ExtensionRequestStatus = "PENDING" | "APPROVED" | "DENIED";

const EXTENSION_TABS = [
  { key: "PENDING" as const, label: "Pending" },
  { key: "APPROVED" as const, label: "Approved" },
  { key: "DENIED" as const, label: "Rejected" },
];

export function ExtensionRequestsModule() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ExtensionRequestStatus>("PENDING");

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          onPress={() => router.push("/(tabs)/dashboard")}
        >
          <FontAwesome5 name="arrow-left" size={20} color="#1F2937" />
        </Pressable>
        <Text style={styles.headerTitle}>Extension Requests</Text>
        <View style={styles.placeholder} />
      </View>

      <SwipeableTabs<ExtensionRequestStatus>
        tabs={EXTENSION_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        <ExtensionRequestsList status="PENDING" />
        <ExtensionRequestsList status="APPROVED" />
        <ExtensionRequestsList status="DENIED" />
      </SwipeableTabs>
    </View>
  );
}
