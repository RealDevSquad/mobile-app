import { AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { apiClient } from "../../lib/api-client";
import {
  TGetExtensionRequestsDto,
  TGetExtensionRequestsResponse,
  TUpdateExtensionRequestStatusDto,
  TUpdateExtensionRequestStatusResponse,
} from "./extension-requests.types";

export const ExtensionRequestsApi = {
  getExtensionRequests: {
    key: (params?: TGetExtensionRequestsDto) => [
      "ExtensionRequestsApi.getExtensionRequests",
      JSON.stringify(params),
    ],
    fn: async (
      params?: TGetExtensionRequestsDto,
      token?: string
    ): Promise<TGetExtensionRequestsResponse> => {
      const queryParams = new URLSearchParams({
        order: "desc",
        size: "5",
        q: `status:${params?.status || "PENDING"}`,
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
        "/extension-requests",
        config
      );
      return data;
    },
  },

  updateExtensionRequestStatus: {
    key: (id: string) => [
      "ExtensionRequestsApi.updateExtensionRequestStatus",
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
};
