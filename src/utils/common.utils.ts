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
