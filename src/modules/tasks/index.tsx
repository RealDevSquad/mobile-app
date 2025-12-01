import React, { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SwipeableTabs } from "../../components/SwipeableTabs";
import { AllTasks } from "./all-tasks";
import { MyTasks } from "./my-tasks";
import styles from "./tasks.styles";

type TasksTab = "tasks" | "my-tasks";

const TASKS_TABS = [
  { key: "tasks" as const, label: "Tasks" },
  { key: "my-tasks" as const, label: "My Tasks" },
];

export function TasksModule() {
  const [activeTab, setActiveTab] = useState<TasksTab>("tasks");
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <SwipeableTabs<TasksTab> tabs={TASKS_TABS} activeTab={activeTab} onTabChange={setActiveTab}>
        <AllTasks />
        <MyTasks />
      </SwipeableTabs>
    </View>
  );
}
