import React from "react";
import { AnimatedTabs, TabItem } from "../../components/AnimatedTabs";

type ExtensionRequestStatus = "PENDING" | "APPROVED" | "DENIED";

type ExtensionRequestsTabsProps = {
  activeTab: ExtensionRequestStatus;
  onTabChange: (tab: ExtensionRequestStatus) => void;
};

const EXTENSION_REQUEST_TABS: TabItem<ExtensionRequestStatus>[] = [
  { key: "PENDING", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "DENIED", label: "Rejected" },
];

export function ExtensionRequestsTabs({ activeTab, onTabChange }: ExtensionRequestsTabsProps) {
  return (
    <AnimatedTabs tabs={EXTENSION_REQUEST_TABS} activeTab={activeTab} onTabChange={onTabChange} />
  );
}
