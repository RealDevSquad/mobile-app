export const getStatusColor = (status: string): string => {
  const statusUpper = status.toUpperCase();
  switch (statusUpper) {
    case "COMPLETED":
    case "DONE":
      return "#10B981";
    case "IN_PROGRESS":
    case "IN PROGRESS":
      return "#F59E0B";
    case "BLOCKED":
      return "#EF4444";
    case "ASSIGNED":
      return "#3B82F6";
    case "AVAILABLE":
      return "#8B5CF6";
    default:
      return "#6B7280";
  }
};

export const getPriorityColor = (priority: string): string => {
  const priorityUpper = priority.toUpperCase();
  switch (priorityUpper) {
    case "URGENT":
      return "#EF4444";
    case "HIGH":
      return "#F59E0B";
    case "MEDIUM":
      return "#3B82F6";
    case "LOW":
      return "#10B981";
    default:
      return "#6B7280";
  }
};

export const getPriorityLabel = (priority: string): string => {
  const priorityUpper = priority.toUpperCase();
  switch (priorityUpper) {
    case "URGENT":
      return "Urgent";
    case "HIGH":
      return "High";
    case "MEDIUM":
      return "Medium";
    case "LOW":
      return "Low";
    default:
      return priority;
  }
};

// Re-export common utilities for backward compatibility
export {
  formatDateRelative as formatDate,
  getDaysUntilDue,
  isOverdue,
  getInitialsFromName as getAssigneeInitials,
} from "../../../utils/common.utils";

export const formatStatus = (status: string): string => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
