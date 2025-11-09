import { apiClient } from "../client";
import { TGithubLoginResponse, TQRAuthRequest, TQRAuthResponse } from "./auth.types";

export const AuthApi = {
  githubLogin: {
    key: ["AuthApi.githubLogin"],
    fn: async (): Promise<TGithubLoginResponse> => {
      const { data } = await apiClient.get<TGithubLoginResponse>("/auth/github/login");
      return data;
    },
  },

  qrCodeAuth: {
    key: (deviceId: string) => ["AuthApi.qrCodeAuth", deviceId],
    fn: async (deviceId: string): Promise<TQRAuthResponse> => {
      const { data } = await apiClient.get<TQRAuthResponse>(
        `/auth/qr-code-auth?device_id=${deviceId}`
      );
      return data;
    },
  },

  qrCodeAuthPost: {
    key: (deviceId: string, userId: string) => ["AuthApi.qrCodeAuthPost", deviceId, userId],
    fn: async (requestData: TQRAuthRequest): Promise<TQRAuthResponse> => {
      const { data } = await apiClient.post<TQRAuthResponse>("/auth/qr-code-auth", requestData);
      return data;
    },
  },
};
