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

export {
  formatDateRelative as formatDate,
  getDaysUntilDue,
  isOverdue,
  getInitialsFromName as getAssigneeInitials,
  getStatusColor,
  formatStatus,
} from "../../../utils/common.utils";
