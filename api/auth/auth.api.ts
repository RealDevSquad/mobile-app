import { apiClient } from '@/lib/api-client';
import {
  TGithubLoginResponse,
  TQRAuthRequest,
  TQRAuthResponse,
} from './auth.types';

export const AuthApi = {
  githubLogin: {
    key: ['AuthApi.githubLogin'],
    fn: async (token?: string): Promise<TGithubLoginResponse> => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      if (token) {
        (config as any).token = token;
      }
      const { data } = await apiClient.get<TGithubLoginResponse>(
        '/auth/github/login',
        config
      );
      return data;
    },
  },

  qrCodeAuth: {
    key: (deviceId: string) => ['AuthApi.qrCodeAuth', deviceId],
    fn: async (deviceId: string, token?: string): Promise<TQRAuthResponse> => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      if (token) {
        (config as any).token = token;
      }
      const { data } = await apiClient.get<TQRAuthResponse>(
        `/auth/qr-code-auth?device_id=${deviceId}`,
        config
      );
      return data;
    },
  },

  qrCodeAuthPost: {
    key: (deviceId: string, userId: string) => [
      'AuthApi.qrCodeAuthPost',
      deviceId,
      userId,
    ],
    fn: async (
      requestData: TQRAuthRequest,
      token?: string
    ): Promise<TQRAuthResponse> => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      if (token) {
        (config as any).token = token;
      }
      const { data } = await apiClient.post<TQRAuthResponse>(
        '/auth/qr-code-auth',
        requestData,
        config
      );
      return data;
    },
  },
};
