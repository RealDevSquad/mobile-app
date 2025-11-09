import React, { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AllTasks } from "./all-tasks";
import { MyTasks } from "./my-tasks";
import styles from "./tasks.styles";
import { TasksTabs } from "./tasks-tabs";

export function TasksModule() {
  const [activeTab, setActiveTab] = useState<"tasks" | "my-tasks">("tasks");
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TasksTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <View style={styles.contentContainer}>
        {activeTab === "tasks" ? <AllTasks /> : <MyTasks />}
      </View>
    </View>
  );
}
