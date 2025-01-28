const baseUrl = 'https://api.realdevsquad.com'; //production
// const baseUrl = 'https://staging-api.realdevsquad.com'; //staging

export const HomeApi = {
  GET_USER_STATUS: `${baseUrl}/users/status/self`,
  UPDATE_STATUS: `${baseUrl}/users/status/self?userStatusFlag=true`,
  GET_ALL_USERS: `${baseUrl}/users`,
};
