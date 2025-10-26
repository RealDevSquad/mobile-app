import { BASE_URL } from "./base-url";

export const TASK_API = {
  GET_TASKS: `${BASE_URL}/tasks?dev=true`,
  GET_SELF_TASKS: `${BASE_URL}/tasks/self`,
  GET_TASK_DETAILS: (id: string) => `${BASE_URL}/tasks/${id}/details`,
  GET_TASK_PROGRESS: (id: string) =>
    `${BASE_URL}/progresses?taskId=${id}&dev=false`,
  UPDATE_TASK_STATUS: (id: string) => `${BASE_URL}/tasks/self/${id}`,
  SUBMIT_PROGRESS: `${BASE_URL}/progresses`,
};
