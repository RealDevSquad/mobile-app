/**
 * Common utility functions used across modules
 */

/**
 * Get user initials from first name, last name, or username
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @param username - User's username
 * @returns Initials string (e.g., "JD" for John Doe)
 */
export const getInitials = (firstName?: string, lastName?: string, username?: string): string => {
  if (firstName && lastName) {
    return (firstName[0] + lastName[0]).toUpperCase();
  }
  if (firstName) {
    return firstName[0].toUpperCase();
  }
  if (username) {
    return username.substring(0, 2).toUpperCase();
  }
  return "U";
};

/**
 * Get initials from a full name string (e.g., "John Doe" -> "JD")
 * @param fullName - Full name string
 * @returns Initials string
 */
export const getInitialsFromName = (fullName: string): string => {
  if (!fullName) return "?";
  const parts = fullName.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return fullName.substring(0, 2).toUpperCase();
};

/**
 * Format date to full readable format (e.g., "January 15, 2024")
 * API returns timestamps in seconds, so we convert to milliseconds
 * @param timestamp - Unix timestamp in seconds
 * @returns Formatted date string
 */
export const formatDateFull = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format date with time (e.g., "January 15, 2024, 10:30 AM")
 * API returns timestamps in seconds, so we convert to milliseconds
 * @param timestamp - Unix timestamp in seconds
 * @returns Formatted date string with time
 */
export const formatDateWithTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format date to short format (e.g., "Jan 15, 2024")
 * API returns timestamps in seconds, so we convert to milliseconds
 * @param timestamp - Unix timestamp in seconds
 * @returns Formatted date string
 */
export const formatDateShort = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Format date with relative time for tasks (e.g., "Due in 3 days", "2 days overdue")
 * API returns timestamps in seconds, so we convert to milliseconds
 * @param timestamp - Unix timestamp in seconds
 * @returns Formatted relative date string
 */
export const formatDateRelative = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const daysOverdue = Math.abs(diffDays);
    return `${daysOverdue} day${daysOverdue === 1 ? "" : "s"} overdue`;
  } else if (diffDays === 0) {
    return "Due today";
  } else if (diffDays === 1) {
    return "Due tomorrow";
  } else if (diffDays <= 7) {
    return `Due in ${diffDays} days`;
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
};

/**
 * Calculate days until a due date
 * API returns timestamps in seconds, so we convert to milliseconds
 * @param timestamp - Unix timestamp in seconds
 * @returns Number of days until due (negative if overdue)
 */
export const getDaysUntilDue = (timestamp: number): number => {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Check if a date is overdue
 * @param timestamp - Unix timestamp in seconds
 * @returns True if the date is in the past
 */
export const isOverdue = (timestamp: number): boolean => {
  return getDaysUntilDue(timestamp) < 0;
};

/**
 * Format a Date object to string with time (e.g., "January 15, 2024, 10:30 AM")
 * Used for date pickers and Date objects
 * @param date - Date object
 * @returns Formatted date string with time
 */
export const formatDateFromDateObject = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format timestamp that can be in seconds or milliseconds
 * Handles both formats and converts to formatted date string
 * @param timestamp - Unix timestamp in seconds or milliseconds
 * @returns Formatted date string
 */
export const formatTimestamp = (timestamp: number): string => {
  const timestampInSeconds = timestamp >= 1e12 ? Math.floor(timestamp / 1000) : timestamp;
  return formatDateFull(timestampInSeconds);
};

/**
 * Get status color based on status string
 * Works for task statuses, task request statuses, and extension request statuses
 * @param status - Status string
 * @returns Hex color code
 */
export const getStatusColor = (status: string): string => {
  const statusUpper = status.toUpperCase();
  switch (statusUpper) {
    // Task statuses
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
    // Task request and extension request statuses
    case "APPROVED":
      return "#10B981";
    case "REJECTED":
    case "DENIED":
      return "#EF4444";
    case "PENDING":
      return "#F59E0B";
    default:
      return "#6B7280";
  }
};

/**
 * Format status string to readable format (e.g., "IN_PROGRESS" -> "In Progress")
 * Works for task statuses, task request statuses, and extension request statuses
 * @param status - Status string
 * @returns Formatted status string
 */
export const formatStatus = (status: string): string => {
  const statusUpper = status.toUpperCase();
  // Special case for DENIED -> Rejected
  if (statusUpper === "DENIED") {
    return "Rejected";
  }
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
