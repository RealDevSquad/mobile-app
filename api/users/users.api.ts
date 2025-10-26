import { AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { apiClient } from "../../lib/api-client";
import {
  TCancelOOOResponse,
  TGetActiveTaskResponse,
  TGetUserDetailsResponse,
  TGetUserStatusResponse,
  TSearchUsersResponse,
  TSubmitOOOFormDto,
  TSubmitOOOResponse,
} from "./users.types";

export const UsersApi = {
  getUserDetails: {
    key: ["UsersApi.getUserDetails"],
    fn: async (token?: string): Promise<TGetUserDetailsResponse> => {
      const config: InternalAxiosRequestConfig = {
        headers: new AxiosHeaders(),
      };
      if (token) {
        (config as any).token = token;
      }
      const { data } = await apiClient.get<TGetUserDetailsResponse>(
        "/users?profile=true",
        config
      );
      return data;
    },
  },

  getUserStatus: {
    key: ["UsersApi.getUserStatus"],
    fn: async (token?: string): Promise<TGetUserStatusResponse> => {
      const config: InternalAxiosRequestConfig = {
        headers: new AxiosHeaders(),
      };
      if (token) {
        (config as any).token = token;
      }
      const { data } = await apiClient.get<TGetUserStatusResponse>(
        "/users/status/self",
        config
      );
      return data;
    },
  },

  searchUsers: {
    key: (searchTerm: string) => ["UsersApi.searchUsers", searchTerm],
    fn: async (
      searchTerm: string,
      token?: string
    ): Promise<TSearchUsersResponse> => {
      const config: InternalAxiosRequestConfig = {
        params: { search: searchTerm, size: 5 },
        headers: new AxiosHeaders(),
      };
      if (token) {
        (config as any).token = token;
      }
      const { data } = await apiClient.get<TSearchUsersResponse>(
        "/users",
        config
      );
      return data;
    },
  },

  getActiveTask: {
    key: ["UsersApi.getActiveTask"],
    fn: async (token?: string): Promise<TGetActiveTaskResponse> => {
      const config: InternalAxiosRequestConfig = {
        headers: new AxiosHeaders(),
      };
      if (token) {
        (config as any).token = token;
      }
      const { data } = await apiClient.get<TGetActiveTaskResponse>(
        "/users/self/tasks/active",
        config
      );
      return data;
    },
  },

  submitOOOForm: {
    key: ["UsersApi.submitOOOForm"],
    fn: async (
      oooData: TSubmitOOOFormDto,
      token?: string
    ): Promise<TSubmitOOOResponse> => {
      const payload = {
        currentStatus: {
          from: new Date(oooData.fromDate).getTime(),
          until: new Date(oooData.toDate).getTime(),
          message: oooData.description,
          state: "OOO",
          updatedAt: Date.now(),
        },
      };

      const config: InternalAxiosRequestConfig = {
        headers: new AxiosHeaders(),
      };
      if (token) {
        (config as any).token = token;
      }
      const { data } = await apiClient.patch<TSubmitOOOResponse>(
        "/users/status/self?userStatusFlag=true",
        payload,
        config
      );
      return data;
    },
  },

  cancelOOO: {
    key: ["UsersApi.cancelOOO"],
    fn: async (token?: string): Promise<TCancelOOOResponse> => {
      const payload = {
        cancelOoo: true,
      };

      const config: InternalAxiosRequestConfig = {
        headers: new AxiosHeaders(),
      };
      if (token) {
        (config as any).token = token;
      }
      const { data } = await apiClient.patch<TCancelOOOResponse>(
        "/users/status/self?userStatusFlag=true",
        payload,
        config
      );
      return data;
    },
  },
};
