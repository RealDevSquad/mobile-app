import { apiClient } from "../client";
import { TGetUserByIdResponse } from "./user.dto";
import {
  TCancelOOOResponse,
  TGetActiveTaskResponse,
  TGetMembersDto,
  TGetMembersResponse,
  TGetUserDetailsResponse,
  TGetUserStatusResponse,
  TSearchUsersResponse,
  TSubmitOOOFormDto,
  TSubmitOOOResponse,
} from "./users.types";

export const UsersApi = {
  getUserDetails: {
    key: ["UsersApi.getUserDetails"],
    fn: async (): Promise<TGetUserDetailsResponse> => {
      const { data } = await apiClient.get<TGetUserDetailsResponse>("/users?profile=true");
      return data;
    },
  },

  getUserStatus: {
    key: ["UsersApi.getUserStatus"],
    fn: async (): Promise<TGetUserStatusResponse> => {
      const { data } = await apiClient.get<TGetUserStatusResponse>("/users/status/self");
      return data;
    },
  },

  searchUsers: {
    key: (searchTerm: string) => ["UsersApi.searchUsers", searchTerm],
    fn: async (searchTerm: string): Promise<TSearchUsersResponse> => {
      const { data } = await apiClient.get<TSearchUsersResponse>("/users", {
        params: { search: searchTerm, size: 5 },
      });
      return data;
    },
  },

  getActiveTask: {
    key: ["UsersApi.getActiveTask"],
    fn: async (): Promise<TGetActiveTaskResponse> => {
      const { data } = await apiClient.get<TGetActiveTaskResponse>("/users/self/tasks/active");
      return data;
    },
  },

  getUserById: {
    key: (userId: string) => ["UsersApi.getUserById", userId],
    fn: async (userId: string): Promise<TGetUserByIdResponse> => {
      const { data } = await apiClient.get<TGetUserByIdResponse>(`/users/userId/${userId}`);
      return data;
    },
  },

  submitOOOForm: {
    key: ["UsersApi.submitOOOForm"],
    fn: async (oooData: TSubmitOOOFormDto): Promise<TSubmitOOOResponse> => {
      const payload = {
        currentStatus: {
          from: new Date(oooData.fromDate).getTime(),
          until: new Date(oooData.toDate).getTime(),
          message: oooData.description,
          state: "OOO",
          updatedAt: Date.now(),
        },
      };

      const { data } = await apiClient.patch<TSubmitOOOResponse>(
        "/users/status/self?userStatusFlag=true",
        payload
      );
      return data;
    },
  },

  cancelOOO: {
    key: ["UsersApi.cancelOOO"],
    fn: async (): Promise<TCancelOOOResponse> => {
      const payload = {
        cancelOoo: true,
      };

      const { data } = await apiClient.patch<TCancelOOOResponse>(
        "/users/status/self?userStatusFlag=true",
        payload
      );
      return data;
    },
  },

  getMembers: {
    key: (params?: TGetMembersDto) => ["UsersApi.getMembers", params],
    fn: async (params?: TGetMembersDto): Promise<TGetMembersResponse> => {
      const { data } = await apiClient.get<TGetMembersResponse>("/users", {
        params: {
          roles: "member",
          ...params,
        },
      });
      return data;
    },
  },
};
