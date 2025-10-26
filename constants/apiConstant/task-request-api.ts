import { PROD_BASE_URL } from "./base-url";

export const TASK_REQUEST_API = {
  GET_TASK_REQUESTS: `${PROD_BASE_URL}/taskRequests`,
  GET_TASK_REQUEST_BY_ID: (id: string) => `${PROD_BASE_URL}/taskRequests/${id}`,
  UPDATE_TASK_REQUEST_STATUS: (id: string) =>
    `${PROD_BASE_URL}/taskRequests/${id}`,
};
