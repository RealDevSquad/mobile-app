import { appConfig } from '@/config/app-config';
import { useAuthStore } from '@/store/authStore';
import { createAuthHeaders } from '@/utils/authHeaders';
import axios from 'axios';
import { router } from 'expo-router';
import { Alert, Platform, ToastAndroid } from 'react-native';

// Token is now automatically handled by the request interceptor

const backendUrl = appConfig.backendBaseUrl;

export const apiClient = axios.create({
  baseURL: backendUrl,
  timeout: 30000,
  withCredentials: true,
});

const showError = (message: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.LONG);
  } else {
    Alert.alert('Error', message);
  }
};

apiClient.interceptors.request.use(
  async (config) => {
    config.headers.set('Content-Type', 'application/json');

    // Automatically get token from auth store
    const token = useAuthStore.getState().token;

    if (token) {
      const authHeaders = createAuthHeaders(token);
      for (const [key, value] of Object.entries(authHeaders)) {
        config.headers.set(key, value);
      }
    }

    return config;
  },
  (error) => {
    throw error instanceof Error ? error : new Error(String(error));
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Use Zustand auth store logout instead of router.replace
      useAuthStore.getState().logout();
      router.replace('/');
    }

    if (error.response) {
      const errorMessage = error.response.data?.message || 'An error occurred';
      showError(errorMessage);
    } else if (error.request) {
      showError('Network error - please check your connection');
    } else {
      showError('An unexpected error occurred');
    }

    throw error instanceof Error ? error : new Error(String(error));
  }
);
