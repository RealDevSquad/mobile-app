import { BASE_URL } from "./base-url";

export const TASK_REQUEST_API = {
  GET_TASK_REQUESTS: `${BASE_URL}/taskRequests`,
  GET_TASK_REQUEST_BY_ID: (id: string) => `${BASE_URL}/taskRequests/${id}`,
  UPDATE_TASK_REQUEST_STATUS: (id: string) => `${BASE_URL}/taskRequests/${id}`,
  APPROVE_TASK_REQUEST: `${BASE_URL}/taskRequests?action=approve`,
  REJECT_TASK_REQUEST: `${BASE_URL}/taskRequests?action=reject`,
};
