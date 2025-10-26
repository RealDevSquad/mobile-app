import { AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { apiClient } from "../../lib/api-client";
import { TGetUserLogsDto, TGetUserLogsResponse } from "./logs.types";

export const LogsApi = {
  getUserLogs: {
    key: (username: string) => ["LogsApi.getUserLogs", username],
    fn: async (
      { username }: TGetUserLogsDto,
      token?: string
    ): Promise<TGetUserLogsResponse> => {
      const config: InternalAxiosRequestConfig = {
        params: { username },
        headers: new AxiosHeaders(),
      };
      if (token) {
        (config as any).token = token;
      }
      const { data } = await apiClient.get<TGetUserLogsResponse>(
        "/logs",
        config
      );
      return data;
    },
  },
};
