import { apiClient } from '../../lib/api-client';
import {
  TCreateTaskReqDto,
  TCreateTaskResponse,
  TGetSelfTasksDto,
  TGetTaskDetailsDto,
  TGetTaskProgressDto,
  TGetTaskReqDto,
  TGetTasksDto,
  TSubmitProgressDto,
  TSubmitProgressResponse,
  TUpdateTaskDto,
  TUpdateTaskResponse,
  TUpdateTaskStatusDto,
  TUpdateTaskStatusResponse,
} from './tasks.types';

export const TasksApi = {
  getTasks: {
    key: (params?: TGetTaskReqDto) => [
      'TasksApi.getTasks',
      JSON.stringify(params),
    ],
    fn: async (params?: TGetTaskReqDto): Promise<TGetTasksDto> => {
      const { data } = await apiClient.get<TGetTasksDto>('/tasks', {
        params: { dev: true, ...params },
      });
      return data;
    },
  },

  getSelfTasks: {
    key: ['TasksApi.getSelfTasks'],
    fn: async (): Promise<TGetSelfTasksDto> => {
      const { data } = await apiClient.get<TGetSelfTasksDto>('/tasks/self');
      return data;
    },
  },

  getTaskDetails: {
    key: (id: string) => ['TasksApi.getTaskDetails', id],
    fn: async (id: string): Promise<TGetTaskDetailsDto> => {
      const { data } = await apiClient.get<TGetTaskDetailsDto>(
        `/tasks/${id}/details`
      );
      return data;
    },
  },

  getTaskProgress: {
    key: (id: string) => ['TasksApi.getTaskProgress', id],
    fn: async (id: string): Promise<TGetTaskProgressDto> => {
      try {
        const { data } = await apiClient.get<TGetTaskProgressDto>(
          `/progresses`,
          {
            params: { taskId: id, dev: false },
          }
        );
        return data;
      } catch (error: any) {
        if (error.response?.status === 404) {
          return {
            message: 'No progress updates found',
            count: 0,
            data: [],
          };
        }
        throw error;
      }
    },
  },

  createTask: {
    key: ['TasksApi.createTask'],
    fn: async (task: TCreateTaskReqDto): Promise<TCreateTaskResponse> => {
      const { data } = await apiClient.post<TCreateTaskResponse>(
        '/tasks',
        task
      );
      return data;
    },
  },

  updateTask: {
    key: ['TasksApi.updateTask'],
    fn: async ({
      id,
      ...task
    }: TUpdateTaskDto): Promise<TUpdateTaskResponse> => {
      const { data } = await apiClient.patch<TUpdateTaskResponse>(
        `/tasks/${id}`,
        task
      );
      return data;
    },
  },

  updateTaskStatus: {
    key: (id: string) => ['TasksApi.updateTaskStatus', id],
    fn: async (
      id: string,
      statusData: TUpdateTaskStatusDto
    ): Promise<TUpdateTaskStatusResponse> => {
      const { data } = await apiClient.patch<TUpdateTaskStatusResponse>(
        `/tasks/self/${id}`,
        statusData
      );
      return data;
    },
  },

  submitProgress: {
    key: ['TasksApi.submitProgress'],
    fn: async (
      progress: TSubmitProgressDto
    ): Promise<TSubmitProgressResponse> => {
      const { data } = await apiClient.post<TSubmitProgressResponse>(
        '/progresses',
        progress
      );
      return data;
    },
  },
};
