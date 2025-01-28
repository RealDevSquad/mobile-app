const baseUrl = 'https://staging-goals-api.realdevsquad.com/api/';

const GoalsApi = {
  MEMBERS_API: 'https://api.realdevsquad.com/members',
  GET_TODO_S: baseUrl + 'v1/goal',
  GET_USER_GOALS: baseUrl + 'v1/goal/?status=&assigned_to=',
  POST_TODO_S: baseUrl + 'v1/goal/',
};

export default GoalsApi;
