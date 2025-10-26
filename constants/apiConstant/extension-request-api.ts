import { BASE_URL } from "./base-url";

export const EXTENSION_REQUEST_API = {
  GET_EXTENSION_REQUESTS: `${BASE_URL}/extension-requests`,
  UPDATE_EXTENSION_REQUEST_STATUS: (id: string) =>
    `${BASE_URL}/extension-requests/${id}/status`,
};
