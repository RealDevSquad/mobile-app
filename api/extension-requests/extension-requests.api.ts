import { apiClient } from '../../lib/api-client';
import {
  TCreateExtensionRequestDto,
  TCreateExtensionRequestResponse,
  TGetExtensionRequestsDto,
  TGetExtensionRequestsResponse,
  TGetSelfExtensionRequestsDto,
  TGetSelfExtensionRequestsResponse,
  TUpdateExtensionRequestStatusDto,
  TUpdateExtensionRequestStatusResponse,
} from './extension-requests.types';

export const ExtensionRequestsApi = {
  getExtensionRequests: {
    key: (params?: TGetExtensionRequestsDto) => [
      'ExtensionRequestsApi.getExtensionRequests',
      JSON.stringify(params),
    ],
    fn: async (
      params?: TGetExtensionRequestsDto
    ): Promise<TGetExtensionRequestsResponse> => {
      const queryParams = new URLSearchParams({
        order: 'desc',
        size: '5',
        q: `status:${params?.status || 'PENDING'}`,
        ...(params?.next && { cursor: params.next }),
      });

      const { data } = await apiClient.get<TGetExtensionRequestsResponse>(
        '/extension-requests',
        { params: queryParams }
      );
      return data;
    },
  },

  getSelfExtensionRequests: {
    key: (params: TGetSelfExtensionRequestsDto) => [
      'ExtensionRequestsApi.getSelfExtensionRequests',
      params.taskId,
    ],
    fn: async (
      params: TGetSelfExtensionRequestsDto
    ): Promise<TGetSelfExtensionRequestsResponse> => {
      const { data } = await apiClient.get<TGetSelfExtensionRequestsResponse>(
        '/extension-requests/self',
        { params: { taskId: params.taskId, dev: true } }
      );
      return data;
    },
  },

  updateExtensionRequestStatus: {
    key: (id: string) => [
      'ExtensionRequestsApi.updateExtensionRequestStatus',
      id,
    ],
    fn: async (
      id: string,
      statusData: TUpdateExtensionRequestStatusDto
    ): Promise<TUpdateExtensionRequestStatusResponse> => {
      const url = `/extension-requests/${id}/status`;
      const payload = { status: statusData.status };
      const { data } =
        await apiClient.patch<TUpdateExtensionRequestStatusResponse>(
          url,
          payload
        );
      return data;
    },
  },

  createExtensionRequest: {
    key: ['ExtensionRequestsApi.createExtensionRequest'],
    fn: async (
      extensionData: TCreateExtensionRequestDto
    ): Promise<TCreateExtensionRequestResponse> => {
      const { data } = await apiClient.post<TCreateExtensionRequestResponse>(
        '/extension-requests',
        extensionData
      );
      return data;
    },
  },
};
