// Log entry interfaces for calendar feature - Flat API response format

export interface LogEntry {
  // Common fields
  type: 'task' | 'taskRequests' | 'oooRequests' | 'extensionRequests';
  timestamp: number; // Unix timestamp in seconds
  user?: string;
  userId?: string;
  username?: string;

  // Task-related fields
  taskId?: string;
  taskTitle?: string;

  // Task log specific fields
  subType?: string;
  status?: string;
  endsOn?: number;
  percentCompleted?: number;

  // TaskRequest log specific fields
  action?: string;
  subAction?: string;
  taskRequestId?: string;
  requestType?: string;
  approvedTo?: string;
  createdAt?: number;
  createdBy?: string;
  externalIssueHtmlUrl?: string;
  externalIssueUrl?: string;
  lastModifiedAt?: number;
  lastModifiedBy?: string;
  proposedDeadline?: number;
  proposedStartDate?: number;
  requestors?: any[];
  usersCount?: number;

  // ExtensionRequest log specific fields
  extensionRequestId?: string;
  newEndsOn?: number;
  oldEndsOn?: number;
  newReason?: string;
  oldReason?: string;
  newTitle?: string;
  oldTitle?: string;
  assignee?: string;

  // OOO log specific fields (to be defined when we see actual OOO data)
  startDate?: number;
  endDate?: number;
  reason?: string;
}

// API response interfaces - Feed format
export interface LogsResponse {
  message: string;
  data: LogEntry[];
  next?: string;
  prev?: string;
}

// Calendar marker types
export interface CalendarMarker {
  key: string;
  color: string;
  selectedDotColor?: string;
}

export interface MarkedDate {
  dots?: CalendarMarker[];
  selected?: boolean;
  selectedColor?: string;
}

export interface MarkedDates {
  [date: string]: MarkedDate;
}

// Activity types for grouping
export type ActivityType =
  | 'task'
  | 'taskRequests'
  | 'oooRequests'
  | 'extensionRequests';

export interface ActivityGroup {
  type: ActivityType;
  logs: LogEntry[];
  color: string;
  label: string;
}

export interface DateActivities {
  date: string;
  activities: ActivityGroup[];
  totalCount: number;
}
