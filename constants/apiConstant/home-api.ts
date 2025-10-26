import { BASE_URL } from "./base-url";

export const HomeApi = {
  GET_USER_STATUS: `${BASE_URL}/users/status/self`,
  UPDATE_STATUS: `${BASE_URL}/users/status/self?userStatusFlag=true`,
  CANCEL_STATUS: `${BASE_URL}/users/status/self?userStatusFlag=true`,
  GET_ALL_USERS: `${BASE_URL}/users`,
};
