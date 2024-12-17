import { githubConfig } from '../../../config/config';
import { PROD_BASE_URL } from '../apiConstant/BaseUrl';

export const urls = {
  GITHUB_AUTH: `https://github.com/login/oauth/authorize?client_id=${githubConfig.clientId}`,
  API_ENDPOINT: 'https://api.realdevsquad.com/',
  REDIRECT_URL: 'https://www.realdevsquad.com/goto',
  GET_USERS_DATA: 'https://api.realdevsquad.com/users?profile=true',
  GET_USER_DATA: 'https://api.realdevsquad.com/users?id=',
  GET_CONTRIBUTIONS: 'https://api.realdevsquad.com/contributions/',
  GET_ACTIVE_TASKS:
    'https://api.realdevsquad.com/tasks?dev=true&status=IN_PROGRESS&assignee=',
  GITHUB: 'https://github.com/',
  TWITTER: 'https://twitter.com',
  LINKEDIN: 'https://www.linkedin.com/in/',
  GET_ACTIVE_TASK: 'https://api.realdevsquad.com/tasks/self',
  GOALS_AUTH: 'https://staging-api.realdevsquad.com/goals/token',
  GET_ALL_TASK: `${PROD_BASE_URL}/tasks/self`,
  GET_TASK_PROGRESS_DETAIL: `${PROD_BASE_URL}/progresses?taskId=`,
  UPDATE_OVERALL_TASK_PROGRESS: `${PROD_BASE_URL}/tasks/self/`,
};
