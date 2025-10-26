import { BASE_URL } from "./base-url";

export const EXTENSION_REQUEST_API = {
  GET_EXTENSION_REQUESTS: `${BASE_URL}/extension-requests`,
  GET_SELF_EXTENSION_REQUESTS: (taskId: string) =>
    `${BASE_URL}/extension-requests/self?taskId=${taskId}&dev=true`,
  CREATE_EXTENSION_REQUEST: `${BASE_URL}/extension-requests?dev=true`,
  UPDATE_EXTENSION_REQUEST_STATUS: (id: string) =>
    `${BASE_URL}/extension-requests/${id}/status`,
};
