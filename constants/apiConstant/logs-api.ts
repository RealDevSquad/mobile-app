import { BASE_URL } from "./base-url";

export const LOGS_API = {
  // Unified logs endpoint - gets all log types at once
  GET_ALL_LOGS: `${BASE_URL}/logs`,
};

// Helper function to build query parameters for unified logs API
export const buildLogsQuery = (params: {
  username?: string;
  startDate?: number;
  endDate?: number;
  page?: number;
  size?: number;
}) => {
  const queryParams = new URLSearchParams();

  if (params.username) {
    queryParams.append("username", params.username);
  }

  // Add all log types to get everything at once
  queryParams.append("type", "task,taskRequests,oooRequests,extensionRequests");

  if (params.page) {
    queryParams.append("page", params.page.toString());
  }

  // Set default size to 100
  queryParams.append("size", "100");

  // Add dev=true parameter for staging environment
  queryParams.append("dev", "true");

  // Add format=feed for better structured response
  queryParams.append("format", "feed");

  return queryParams.toString();
};

// Helper function to build full URL with query parameters
export const buildLogsUrl = (
  baseUrl: string,
  params: {
    username?: string;
    startDate?: number;
    endDate?: number;
    page?: number;
    size?: number;
  }
) => {
  const queryString = buildLogsQuery(params);
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};
