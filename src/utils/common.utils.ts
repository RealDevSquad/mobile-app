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

export const getInitialsFromName = (fullName: string): string => {
  if (!fullName) return "?";
  const parts = fullName.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return fullName.substring(0, 2).toUpperCase();
};

export const formatDateFull = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

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

export const formatDateShort = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

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

export const getDaysUntilDue = (timestamp: number): number => {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isOverdue = (timestamp: number): boolean => {
  return getDaysUntilDue(timestamp) < 0;
};

export const formatDateFromDateObject = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatTimestamp = (timestamp: number): string => {
  const timestampInSeconds = timestamp >= 1e12 ? Math.floor(timestamp / 1000) : timestamp;
  return formatDateFull(timestampInSeconds);
};

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

export const formatStatus = (status: string): string => {
  const statusUpper = status.toUpperCase();
  if (statusUpper === "DENIED") {
    return "Rejected";
  }
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
