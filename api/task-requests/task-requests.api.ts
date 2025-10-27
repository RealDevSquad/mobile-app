import { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import { apiClient } from '../../lib/api-client';
import {
  TApproveTaskRequestDto,
  TApproveTaskRequestResponse,
  TGetTaskRequestByIdResponse,
  TGetTaskRequestsDto,
  TGetTaskRequestsResponse,
  TRejectTaskRequestDto,
  TRejectTaskRequestResponse,
} from './task-requests.types';

export const TaskRequestsApi = {
  getTaskRequests: {
    key: (params?: TGetTaskRequestsDto) => [
      'TaskRequestsApi.getTaskRequests',
      JSON.stringify(params),
    ],
    fn: async (
      params?: TGetTaskRequestsDto,
      token?: string
    ): Promise<TGetTaskRequestsResponse> => {
      let url = '/task-requests';
      const queryParams = new URLSearchParams();

      if (params?.status === 'ALL') {
        queryParams.append('size', '20');
        queryParams.append('q', 'sort:created-desc');
      } else {
        const status = params?.status || 'PENDING';
        queryParams.append('size', '20');
        queryParams.append(
          'q',
          `status:${status.toLowerCase()}++sort:created-desc`
        );
      }

      if (params?.next) {
        queryParams.append('next', params.next);
      }

      const config: InternalAxiosRequestConfig = {
        params: queryParams,
        headers: new AxiosHeaders(),
      };
      if (token) {
        (config as any).token = token;
      }
      const { data } = await apiClient.get<TGetTaskRequestsResponse>(
        url,
        config
      );
      return data;
    },
  },

  getTaskRequestById: {
    key: (id: string) => ['TaskRequestsApi.getTaskRequestById', id],
    fn: async (
      id: string,
      token?: string
    ): Promise<TGetTaskRequestByIdResponse> => {
      const config: InternalAxiosRequestConfig = {
        headers: new AxiosHeaders(),
      };
      if (token) {
        (config as any).token = token;
      }
      const { data } = await apiClient.get<TGetTaskRequestByIdResponse>(
        `/task-requests/${id}`,
        config
      );
      return data;
    },
  },

  approveTaskRequest: {
    key: (taskRequestId: string, userId: string) => [
      'TaskRequestsApi.approveTaskRequest',
      taskRequestId,
      userId,
    ],
    fn: async (
      { taskRequestId, userId }: TApproveTaskRequestDto,
      token?: string
    ): Promise<TApproveTaskRequestResponse> => {
      const config: InternalAxiosRequestConfig = {
        headers: new AxiosHeaders(),
      };
      if (token) {
        (config as any).token = token;
      }
      const { data } = await apiClient.patch<TApproveTaskRequestResponse>(
        '/task-requests/approve',
        { taskRequestId, userId },
        config
      );
      return data;
    },
  },

  rejectTaskRequest: {
    key: (taskRequestId: string, userId: string) => [
      'TaskRequestsApi.rejectTaskRequest',
      taskRequestId,
      userId,
    ],
    fn: async (
      { taskRequestId, userId, reason }: TRejectTaskRequestDto,
      token?: string
    ): Promise<TRejectTaskRequestResponse> => {
      const config: InternalAxiosRequestConfig = {
        headers: new AxiosHeaders(),
      };
      if (token) {
        (config as any).token = token;
      }
      const { data } = await apiClient.patch<TRejectTaskRequestResponse>(
        '/task-requests/reject',
        { taskRequestId, userId, reason },
        config
      );
      return data;
    },
  },
};
