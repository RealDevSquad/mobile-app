import { apiClient } from '../../lib/api-client';
import { TGetUserLogsDto, TGetUserLogsResponse } from './logs.types';

export const LogsApi = {
  getUserLogs: {
    key: (username: string) => ['LogsApi.getUserLogs', username],
    fn: async ({
      username,
    }: TGetUserLogsDto): Promise<TGetUserLogsResponse> => {
      const { data } = await apiClient.get<TGetUserLogsResponse>('/logs', {
        params: { username },
      });
      return data;
    },
  },
};
