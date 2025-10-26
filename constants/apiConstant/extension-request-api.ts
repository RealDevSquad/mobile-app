const baseUrl = "https://api.realdevsquad.com";

export const EXTENSION_REQUEST_API = {
  GET_EXTENSION_REQUESTS: `${baseUrl}/extension-requests`,
  UPDATE_EXTENSION_REQUEST_STATUS: (id: string) =>
    `${baseUrl}/extension-requests/${id}/status`,
};
