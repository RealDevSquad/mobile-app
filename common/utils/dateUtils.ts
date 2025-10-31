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
  if (!timestamp || timestamp <= 0 || Number.isNaN(timestamp))
    return 'Invalid date';

  try {
    const date = fromUnixTime(timestamp);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Format a unix timestamp to "MMM dd, yyyy 'at' h:mm a" format
 * @param timestamp Unix timestamp in seconds
 * @returns Formatted date and time string
 */
export const formatDateTime = (timestamp: number): string => {
  if (!timestamp || timestamp <= 0 || Number.isNaN(timestamp))
    return 'Invalid date';

  try {
    const date = fromUnixTime(timestamp);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return format(date, "MMM dd, yyyy 'at' h:mm a");
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Get relative time from now (e.g., "2 hours ago", "in 3 days")
 * @param timestamp Unix timestamp in seconds
 * @returns Relative time string
 */
export const formatTimeAgo = (timestamp: number): string => {
  if (!timestamp || timestamp <= 0 || Number.isNaN(timestamp))
    return 'Invalid date';

  try {
    const date = fromUnixTime(timestamp);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Get relative time from now without suffix (e.g., "2 hours", "3 days")
 * @param timestamp Unix timestamp in seconds
 * @returns Relative time string without suffix
 */
export const getRelativeFromNow = (timestamp?: number): string => {
  if (!timestamp || timestamp <= 0 || Number.isNaN(timestamp)) return 'Not set';

  // Check if timestamp is valid (not too far in the past or future)
  // Reasonable range: between 1970-01-01 and 2100-01-01
  const minTimestamp = 0;
  const maxTimestamp = 4102444800; // Jan 1, 2100

  if (timestamp < minTimestamp || timestamp > maxTimestamp) {
    return 'Not set';
  }

  try {
    const date = fromUnixTime(timestamp);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Not set';
    }
    return formatDistanceToNow(date, { addSuffix: false });
  } catch (error) {
    return 'Not set';
  }
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
  if (!timestamp || timestamp <= 0 || Number.isNaN(timestamp))
    return 'Invalid date';

  try {
    const date = fromUnixTime(timestamp);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    const fromDate = fromTimestamp ? fromUnixTime(fromTimestamp) : new Date();
    if (fromTimestamp && isNaN(fromDate.getTime())) {
      return 'Invalid date';
    }
    return formatDistance(date, fromDate, { addSuffix: false });
  } catch (error) {
    return 'Invalid date';
  }
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
