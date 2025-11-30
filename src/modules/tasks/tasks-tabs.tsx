import React from "react";
import { AnimatedTabs, TabItem } from "../../components/AnimatedTabs";

type TasksTabType = "tasks" | "my-tasks";

type TasksTabsProps = {
  activeTab: TasksTabType;
  onTabChange: (tab: TasksTabType) => void;
};

const TASKS_TABS: TabItem<TasksTabType>[] = [
  { key: "tasks", label: "Tasks" },
  { key: "my-tasks", label: "My Tasks" },
];

export function TasksTabs({ activeTab, onTabChange }: TasksTabsProps) {
  return <AnimatedTabs tabs={TASKS_TABS} activeTab={activeTab} onTabChange={onTabChange} />;
}
