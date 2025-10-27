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
      params?: TGetTaskRequestsDto
    ): Promise<TGetTaskRequestsResponse> => {
      let url = '/taskRequests';

      const queryParts: string[] = [];

      if (params?.status === 'ALL') {
        queryParts.push('size=5', 'q=sort:created-asc');
      } else {
        const status = params?.status || 'PENDING';
        queryParts.push(
          'size=5',
          `q=status%3A${status.toLowerCase()}+sort%3Acreated-asc`
        );
      }

      if (params?.next) {
        queryParts.push(`next=${encodeURIComponent(params.next)}`);
      }

      const queryString = queryParts.join('&');
      const fullUrl = `${apiClient.defaults.baseURL}${url}?${queryString}`;

      try {
        const { data } = await apiClient.get<any>(fullUrl);

        const transformedData: TGetTaskRequestsResponse = {
          data: data.data || [],
          taskRequests: data.data || [],
          next: data.next,
          hasMore: !!data.next,
          total: data.total,
        };

        return transformedData;
      } catch (error: any) {
        throw error;
      }
    },
  },

  getTaskRequestById: {
    key: (id: string) => ['TaskRequestsApi.getTaskRequestById', id],
    fn: async (id: string): Promise<TGetTaskRequestByIdResponse> => {
      const url = `/taskRequests/${id}`;

      try {
        const { data } = await apiClient.get<{
          data: TGetTaskRequestByIdResponse;
          message: string;
        }>(url);
        return data.data;
      } catch (error: any) {
        throw error;
      }
    },
  },

  approveTaskRequest: {
    key: (taskRequestId: string, userId: string) => [
      'TaskRequestsApi.approveTaskRequest',
      taskRequestId,
      userId,
    ],
    fn: async ({
      taskRequestId,
      userId,
    }: TApproveTaskRequestDto): Promise<TApproveTaskRequestResponse> => {
      const url = '/taskRequests/approve';
      const payload = { taskRequestId, userId };

      try {
        const { data } = await apiClient.patch<TApproveTaskRequestResponse>(
          url,
          payload
        );
        return data;
      } catch (error: any) {
        throw error;
      }
    },
  },

  rejectTaskRequest: {
    key: (taskRequestId: string, userId: string) => [
      'TaskRequestsApi.rejectTaskRequest',
      taskRequestId,
      userId,
    ],
    fn: async ({
      taskRequestId,
      userId,
      reason,
    }: TRejectTaskRequestDto): Promise<TRejectTaskRequestResponse> => {
      const url = '/taskRequests/reject';
      const payload = { taskRequestId, userId, reason };

      try {
        const { data } = await apiClient.patch<TRejectTaskRequestResponse>(
          url,
          payload
        );
        return data;
      } catch (error: any) {
        throw error;
      }
    },
  },
};
