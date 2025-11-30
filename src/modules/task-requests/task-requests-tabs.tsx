import React from "react";
import { AnimatedTabs, TabItem } from "../../components/AnimatedTabs";

type TaskRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

type TaskRequestsTabsProps = {
  activeTab: TaskRequestStatus;
  onTabChange: (tab: TaskRequestStatus) => void;
};

const TASK_REQUEST_TABS: TabItem<TaskRequestStatus>[] = [
  { key: "PENDING", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "REJECTED", label: "Rejected" },
];

export function TaskRequestsTabs({ activeTab, onTabChange }: TaskRequestsTabsProps) {
  return (
    <AnimatedTabs tabs={TASK_REQUEST_TABS} activeTab={activeTab} onTabChange={onTabChange} />
  );
}
