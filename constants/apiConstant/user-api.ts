import { BASE_URL } from "./base-url";

export const USER_API = {
  USER_DETAIL: `${BASE_URL}/users?profile=true`,
  GET_ACTIVE_TASK: `${BASE_URL}/tasks/self`,
  GET_USER_STATUS: `${BASE_URL}/users/status/self`,
  SEARCH_USERS: `${BASE_URL}/users`,
};
