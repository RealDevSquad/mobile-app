import {
  ActivityGroup,
  ActivityType,
  DateActivities,
  LogEntry,
  MarkedDates,
} from "@/types/logs.dto";

// Color mapping for different activity types
export const ACTIVITY_COLORS = {
  task: "#007AFF", // Blue
  oooRequests: "#FF9500", // Orange
  taskRequests: "#34C759", // Green
  extensionRequests: "#FF3B30", // Red
} as const;

export const ACTIVITY_LABELS = {
  task: "Tasks",
  oooRequests: "OOO",
  taskRequests: "Task Requests",
  extensionRequests: "Extensions",
} as const;

/**
 * Converts timestamp to date string in YYYY-MM-DD format
 * Now handles Unix timestamps in seconds from flat API format
 */
export const timestampToDateString = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toISOString().split("T")[0];
};

/**
 * Gets the start and end dates for a given month (YYYY-MM format)
 * Returns Unix timestamps in seconds
 */
export const getMonthDateRange = (
  month: string
): { startDate: number; endDate: number } => {
  const [year, monthNum] = month.split("-").map(Number);
  const startDate = new Date(year, monthNum - 1, 1);
  const endDate = new Date(year, monthNum, 0); // Last day of the month

  // Set end date to end of day (23:59:59)
  endDate.setHours(23, 59, 59, 999);

  return {
    startDate: Math.floor(startDate.getTime() / 1000), // Unix timestamp in seconds
    endDate: Math.floor(endDate.getTime() / 1000), // Unix timestamp in seconds
  };
};

/**
 * Groups logs by date and activity type
 */
export const groupLogsByDate = (
  logs: LogEntry[]
): { [date: string]: LogEntry[] } => {
  const grouped: { [date: string]: LogEntry[] } = {};

  for (const log of logs) {
    const date = timestampToDateString(log.timestamp);
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(log);
  }

  return grouped;
};

/**
 * Creates activity groups for a specific date
 */
export const createActivityGroups = (logs: LogEntry[]): ActivityGroup[] => {
  const groups: { [key in ActivityType]?: LogEntry[] } = {};

  // Group logs by type
  for (const log of logs) {
    if (!groups[log.type]) {
      groups[log.type] = [];
    }
    groups[log.type]!.push(log);
  }

  // Convert to ActivityGroup array
  return Object.entries(groups).map(([type, logs]) => ({
    type: type as ActivityType,
    logs: logs || [],
    color: ACTIVITY_COLORS[type as ActivityType],
    label: ACTIVITY_LABELS[type as ActivityType],
  }));
};

/**
 * Processes logs into marked dates for the calendar
 * Optimized to prevent memory issues with large datasets
 */
export const processLogsToMarkedDates = (logs: LogEntry[]): MarkedDates => {
  const markedDates: MarkedDates = {};

  // Limit processing to recent logs (last 2 years) to prevent memory issues
  const twoYearsAgo = Date.now() - 2 * 365 * 24 * 60 * 60 * 1000;
  const recentLogs = logs.filter((log) => log.timestamp * 1000 > twoYearsAgo);

  if (recentLogs.length === 0) {
    return markedDates;
  }

  // Process logs in batches to prevent memory issues
  const batchSize = 100;
  const batches = [];
  for (let i = 0; i < recentLogs.length; i += batchSize) {
    batches.push(recentLogs.slice(i, i + batchSize));
  }

  for (const batch of batches) {
    const { statusByDate } = processTaskDateRanges(batch);

    // Process status-based dates
    for (const [timestamp, status] of Object.entries(statusByDate)) {
      const date = new Date(Number.parseInt(timestamp, 10));
      const dateString = date.toISOString().split("T")[0];

      if (!markedDates[dateString]) {
        markedDates[dateString] = { dots: [] };
      }

      // Limit dots per date to prevent memory issues
      if (markedDates[dateString].dots!.length < 4) {
        const statusColor = getStatusColor(status);
        markedDates[dateString].dots!.push({
          key: `${dateString}-${status}`,
          color: statusColor,
          selectedDotColor: statusColor,
        });
      }
    }
  }

  // Process regular activity logs for additional markers (limited)
  const groupedLogs = groupLogsByDate(recentLogs);
  let processedDates = 0;
  const maxDates = 1000; // Limit total marked dates

  for (const [date, dateLogs] of Object.entries(groupedLogs)) {
    if (processedDates >= maxDates) break;

    const activityGroups = createActivityGroups(dateLogs);

    if (!markedDates[date]) {
      markedDates[date] = { dots: [] };
    }

    // Add activity markers (max 4 total dots)
    const existingDots = markedDates[date].dots?.length || 0;
    const remainingSlots = Math.max(0, 4 - existingDots);

    for (const group of activityGroups.slice(0, remainingSlots)) {
      markedDates[date].dots!.push({
        key: `${date}-${group.type}`,
        color: group.color,
        selectedDotColor: group.color,
      });
    }

    processedDates++;
  }

  return markedDates;
};

/**
 * Gets activities for a specific date
 */
export const getActivitiesForDate = (
  logs: LogEntry[],
  date: string
): DateActivities | null => {
  const dateLogs = logs.filter(
    (log) => timestampToDateString(log.timestamp) === date
  );

  if (dateLogs.length === 0) {
    return null;
  }

  const activityGroups = createActivityGroups(dateLogs);
  const totalCount = dateLogs.length;

  return {
    date,
    activities: activityGroups,
    totalCount,
  };
};

/**
 * Formats timestamp for display
 * Now handles Unix timestamps in seconds from flat API format
 * Returns both relative time and full date
 */
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Calculate relative time
  let relativeTime: string;
  if (diffInSeconds < 60) {
    relativeTime = "just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    relativeTime = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    relativeTime = `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    relativeTime = `${days} day${days > 1 ? "s" : ""} ago`;
  } else {
    const months = Math.floor(diffInSeconds / 2592000);
    relativeTime = `${months} month${months > 1 ? "s" : ""} ago`;
  }

  // Format full date
  const fullDate = date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${relativeTime} • ${fullDate}`;
};

/**
 * Creates human-readable activity summary from log entry
 */
const getTaskSummary = (log: LogEntry): string => {
  if (log.percentCompleted !== undefined) {
    return `Task progress: ${log.percentCompleted}%`;
  }
  if (log.status) {
    return `Task status updated to ${log.status}`;
  }
  if (log.subType) {
    return `Task ${log.subType}`;
  }
  return "Task activity";
};

/**
 * Maps log type to status indicator for calendar display
 */
export const getLogStatus = (log: LogEntry): string => {
  switch (log.type) {
    case "task":
      if (log.status === "COMPLETED" || log.percentCompleted === 100) {
        return "COMPLETED";
      }
      if (log.status === "IN_PROGRESS" || log.status === "ACTIVE") {
        return "ACTIVE";
      }
      return "TASK";
    case "oooRequests":
      return "OOO";
    case "taskRequests":
      return "REQUEST";
    case "extensionRequests":
      return "EXTENSION";
    default:
      return "ACTIVITY";
  }
};

/**
 * Gets status color for calendar display
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "ACTIVE":
    case "COMPLETED":
      return "#28a745"; // Green
    case "OOO":
      return "#dc3545"; // Red
    case "REQUEST":
      return "#17a2b8"; // Blue
    case "EXTENSION":
      return "#ffc107"; // Yellow
    case "TASK":
      return "#007bff"; // Blue
    default:
      return "#6c757d"; // Gray
  }
};

/**
 * Gets start of day for a given date
 */
export const getStartOfDay = (date: Date): Date => {
  if (date instanceof Date && !Number.isNaN(date.getTime())) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
  return new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );
};

/**
 * Gets all dates in a range
 */
export const getDatesInRange = (startDate: Date, endDate: Date): number[] => {
  const date = getStartOfDay(startDate);
  const dates: number[] = [];

  if (
    !(startDate instanceof Date && !Number.isNaN(startDate.getTime())) ||
    !(endDate instanceof Date && !Number.isNaN(endDate.getTime()))
  ) {
    return [];
  }

  while (date <= getStartOfDay(endDate)) {
    dates.push(getStartOfDay(date).getTime());
    date.setDate(date.getDate() + 1);
  }

  return dates;
};

/**
 * Processes task data to populate date ranges for multi-day tasks
 * Optimized to prevent memory issues with large date ranges
 */
export const processTaskDateRanges = (
  logs: LogEntry[]
): {
  statusByDate: Record<number, string>;
  taskByDate: Record<number, string>;
  taskDataByDate: Record<
    number,
    { taskId: string; taskTitle: string; startedOn: number; endsOn?: number }
  >;
} => {
  const statusByDate: Record<number, string> = {};
  const taskByDate: Record<number, string> = {};
  const taskDataByDate: Record<
    number,
    { taskId: string; taskTitle: string; startedOn: number; endsOn?: number }
  > = {};

  // Limit date range processing to prevent memory issues
  const maxDateRange = 365; // Maximum days to process for any single task
  const currentTime = Date.now();

  for (const log of logs) {
    if (log.type === "task" && log.taskId && log.taskTitle) {
      const timestamp = log.timestamp * 1000;
      const logDate = new Date(timestamp);
      const logDayKey = getStartOfDay(logDate).getTime();

      // Set status and task info for the log date
      const status = getLogStatus(log);
      statusByDate[logDayKey] = status;
      taskByDate[logDayKey] = log.taskTitle;
      taskDataByDate[logDayKey] = {
        taskId: log.taskId,
        taskTitle: log.taskTitle,
        startedOn: timestamp,
        endsOn: log.endsOn,
      };

      // If task has an end date, populate dates in the range (with limits)
      if (log.endsOn) {
        const endDate = new Date(log.endsOn * 1000);

        // Limit the date range to prevent memory issues
        const daysDiff = Math.ceil(
          (endDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (
          daysDiff <= maxDateRange &&
          log.endsOn * 1000 > currentTime - 2 * 365 * 24 * 60 * 60 * 1000
        ) {
          const dates = getDatesInRange(logDate, endDate);

          // Limit the number of dates processed
          const limitedDates = dates.slice(0, maxDateRange);

          for (const dateTimestamp of limitedDates) {
            statusByDate[dateTimestamp] = status;
            taskByDate[dateTimestamp] = log.taskTitle;
            taskDataByDate[dateTimestamp] = {
              taskId: log.taskId,
              taskTitle: log.taskTitle,
              startedOn: timestamp,
              endsOn: log.endsOn,
            };
          }
        }
      }
    } else if (log.type === "oooRequests") {
      // Handle OOO requests
      const timestamp = log.timestamp * 1000;
      const logDate = new Date(timestamp);
      const logDayKey = getStartOfDay(logDate).getTime();

      statusByDate[logDayKey] = "OOO";

      // If OOO has start and end dates, populate the range (with limits)
      if (log.startDate && log.endDate) {
        const startDate = new Date(log.startDate * 1000);
        const endDate = new Date(log.endDate * 1000);

        // Limit the date range to prevent memory issues
        const daysDiff = Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (
          daysDiff <= maxDateRange &&
          log.endDate * 1000 > currentTime - 2 * 365 * 24 * 60 * 60 * 1000
        ) {
          const dates = getDatesInRange(startDate, endDate);

          // Limit the number of dates processed
          const limitedDates = dates.slice(0, maxDateRange);

          for (const dateTimestamp of limitedDates) {
            statusByDate[dateTimestamp] = "OOO";
          }
        }
      }
    }
  }

  return { statusByDate, taskByDate, taskDataByDate };
};

/**
 * Generates detailed status message for a specific date
 */
export const generateDateStatusMessage = (
  date: string,
  username: string,
  logs: LogEntry[]
): string => {
  const targetDate = new Date(date);
  const targetTimestamp = getStartOfDay(targetDate).getTime();

  // Check if it's Sunday
  if (targetDate.getDay() === 0) {
    return `${username} - Sunday (Holiday)`;
  }

  // Find logs for this specific date
  const dateLogs = logs.filter((log) => {
    const logDate = getStartOfDay(new Date(log.timestamp * 1000));
    return logDate.getTime() === targetTimestamp;
  });

  if (dateLogs.length === 0) {
    return `${username} - No activity found for ${date}`;
  }

  // Check for OOO status
  const oooLog = dateLogs.find((log) => log.type === "oooRequests");
  if (oooLog) {
    return `${username} - Out of Office (${oooLog.status || "OOO"})`;
  }

  // Check for active tasks
  const activeTasks = dateLogs.filter(
    (log) =>
      log.type === "task" &&
      (log.status === "IN_PROGRESS" ||
        log.status === "ACTIVE" ||
        log.percentCompleted !== undefined)
  );

  if (activeTasks.length > 0) {
    const taskTitles = activeTasks
      .map((task) => task.taskTitle)
      .filter(Boolean);
    const taskList = taskTitles.length > 0 ? `: ${taskTitles.join(", ")}` : "";
    return `${username} - Active on ${date}${taskList}`;
  }

  // Check for completed tasks
  const completedTasks = dateLogs.filter(
    (log) =>
      log.type === "task" &&
      (log.status === "COMPLETED" || log.percentCompleted === 100)
  );

  if (completedTasks.length > 0) {
    const taskTitles = completedTasks
      .map((task) => task.taskTitle)
      .filter(Boolean);
    const taskList = taskTitles.length > 0 ? `: ${taskTitles.join(", ")}` : "";
    return `${username} - Completed tasks on ${date}${taskList}`;
  }

  // Check for requests
  const requests = dateLogs.filter(
    (log) => log.type === "taskRequests" || log.type === "extensionRequests"
  );
  if (requests.length > 0) {
    const requestTypes = requests.map((req) =>
      req.type === "taskRequests" ? "Task Request" : "Extension Request"
    );
    return `${username} - ${requestTypes.join(", ")} activity on ${date}`;
  }

  return `${username} - Activity on ${date}`;
};

const getTaskRequestSummary = (log: LogEntry): string => {
  const action = log.subAction || log.action || "updated";
  const status = log.status ? ` (${log.status})` : "";
  return `Task request ${action}${status}`;
};

const getExtensionRequestSummary = (log: LogEntry): string => {
  if (log.status) {
    return `Extension request ${log.status}`;
  }
  if (log.newEndsOn && log.oldEndsOn) {
    const oldDate = new Date(log.oldEndsOn * 1000).toLocaleDateString();
    const newDate = new Date(log.newEndsOn * 1000).toLocaleDateString();
    return `Extension request: ${oldDate} → ${newDate}`;
  }
  return "Extension request activity";
};

const getOOORequestSummary = (log: LogEntry): string => {
  if (log.status) {
    return `Out of office request ${log.status}`;
  }
  return "Out of office request";
};

export const createActivitySummary = (log: LogEntry): string => {
  switch (log.type) {
    case "task":
      return getTaskSummary(log);
    case "taskRequests":
      return getTaskRequestSummary(log);
    case "extensionRequests":
      return getExtensionRequestSummary(log);
    case "oooRequests":
      return getOOORequestSummary(log);
    default:
      return "Activity";
  }
};

/**
 * Gets the current month in YYYY-MM format
 */
export const getCurrentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

/**
 * Gets the next month in YYYY-MM format
 */
export const getNextMonth = (month: string): string => {
  const [year, monthNum] = month.split("-").map(Number);
  const nextDate = new Date(year, monthNum, 1);
  return `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
};

/**
 * Gets the previous month in YYYY-MM format
 */
export const getPreviousMonth = (month: string): string => {
  const [year, monthNum] = month.split("-").map(Number);
  const prevDate = new Date(year, monthNum - 2, 1);
  return `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
};
