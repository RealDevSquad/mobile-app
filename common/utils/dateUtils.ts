import {
  format,
  formatDistanceToNow,
  formatDistance,
  fromUnixTime,
  addDays,
} from 'date-fns';

/**
 * Format a unix timestamp to "MMM dd, yyyy" format
 * @param timestamp Unix timestamp in seconds
 * @returns Formatted date string
 */
export const formatDate = (timestamp: number): string => {
  return format(fromUnixTime(timestamp), 'MMM dd, yyyy');
};

/**
 * Format a unix timestamp to "MMM dd, yyyy 'at' h:mm a" format
 * @param timestamp Unix timestamp in seconds
 * @returns Formatted date and time string
 */
export const formatDateTime = (timestamp: number): string => {
  return format(fromUnixTime(timestamp), "MMM dd, yyyy 'at' h:mm a");
};

/**
 * Get relative time from now (e.g., "2 hours ago", "in 3 days")
 * @param timestamp Unix timestamp in seconds
 * @returns Relative time string
 */
export const formatTimeAgo = (timestamp: number): string => {
  return formatDistanceToNow(fromUnixTime(timestamp), { addSuffix: true });
};

/**
 * Get relative time from now without suffix (e.g., "2 hours", "3 days")
 * @param timestamp Unix timestamp in seconds
 * @returns Relative time string without suffix
 */
export const getRelativeFromNow = (timestamp?: number): string => {
  if (!timestamp) return 'Not set';
  const date = fromUnixTime(timestamp);
  return formatDistanceToNow(date, { addSuffix: false });
};

/**
 * Get relative time between two timestamps
 * @param timestamp Unix timestamp in seconds
 * @param fromTimestamp Reference timestamp in seconds (defaults to now)
 * @returns Relative time string
 */
export const getRelativeTime = (
  timestamp: number,
  fromTimestamp?: number
): string => {
  const date = fromUnixTime(timestamp);
  const fromDate = fromTimestamp ? fromUnixTime(fromTimestamp) : new Date();
  return formatDistance(date, fromDate, { addSuffix: false });
};

/**
 * Convert unix timestamp to Date object
 * @param timestamp Unix timestamp in seconds
 * @returns Date object
 */
export const unixToDate = (timestamp: number): Date => {
  return fromUnixTime(timestamp);
};

/**
 * Convert Date object to unix timestamp (seconds)
 * @param date Date object
 * @returns Unix timestamp in seconds
 */
export const dateToUnix = (date: Date): number => {
  return Math.floor(date.getTime() / 1000);
};

/**
 * Add days to a unix timestamp and return a Date object
 * @param timestamp Unix timestamp in seconds
 * @param days Number of days to add
 * @returns Date object
 */
export const addDaysToUnix = (timestamp: number, days: number): Date => {
  const date = fromUnixTime(timestamp);
  return addDays(date, days);
};

/**
 * Format a regular timestamp (milliseconds) to "MMM DD, YYYY" format
 * @param timestamp Timestamp in milliseconds
 * @returns Formatted date string
 */
export const formatDateFromMillis = (timestamp: number): string => {
  return format(new Date(timestamp), 'MMM dd, yyyy');
};

/**
 * Format a regular timestamp (milliseconds) to "MMM DD, YYYY [at] h:mm A" format
 * @param timestamp Timestamp in milliseconds
 * @returns Formatted date and time string
 */
export const formatDateTimeFromMillis = (timestamp: number): string => {
  return format(new Date(timestamp), "MMM dd, yyyy 'at' h:mm a");
};
