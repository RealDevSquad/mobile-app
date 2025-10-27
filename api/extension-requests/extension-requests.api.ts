import { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
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
      params?: TGetExtensionRequestsDto,
      token?: string
    ): Promise<TGetExtensionRequestsResponse> => {
      const queryParams = new URLSearchParams({
        order: 'desc',
        size: '5',
        q: `status:${params?.status || 'PENDING'}`,
        ...(params?.next && { next: params.next }),
      });

      const config: InternalAxiosRequestConfig = {
        params: queryParams,
        headers: new AxiosHeaders(),
      };
      if (token) {
        (config as any).token = token;
      }
      const { data } = await apiClient.get<TGetExtensionRequestsResponse>(
        '/extension-requests',
        config
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
      params: TGetSelfExtensionRequestsDto,
      token?: string
    ): Promise<TGetSelfExtensionRequestsResponse> => {
      const config: InternalAxiosRequestConfig = {
        params: { taskId: params.taskId, dev: true },
        headers: new AxiosHeaders(),
      };
      if (token) {
        (config as any).token = token;
      }
      const { data } = await apiClient.get<TGetSelfExtensionRequestsResponse>(
        '/extension-requests/self',
        config
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
      statusData: TUpdateExtensionRequestStatusDto,
      token?: string
    ): Promise<TUpdateExtensionRequestStatusResponse> => {
      const config: InternalAxiosRequestConfig = {
        headers: new AxiosHeaders(),
      };
      if (token) {
        (config as any).token = token;
      }
      const { data } =
        await apiClient.patch<TUpdateExtensionRequestStatusResponse>(
          `/extension-requests/${id}`,
          statusData,
          config
        );
      return data;
    },
  },

  createExtensionRequest: {
    key: ['ExtensionRequestsApi.createExtensionRequest'],
    fn: async (
      extensionData: TCreateExtensionRequestDto,
      token?: string
    ): Promise<TCreateExtensionRequestResponse> => {
      const config: InternalAxiosRequestConfig = {
        headers: new AxiosHeaders(),
      };
      if (token) {
        (config as any).token = token;
      }
      const { data } = await apiClient.post<TCreateExtensionRequestResponse>(
        '/extension-requests',
        extensionData,
        config
      );
      return data;
    },
  },
};
