import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { appConfig } from "../config/app.config";
import { logger } from "../utils/logger";

export const apiClient = axios.create({
  baseURL: appConfig.backendBaseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log the request
    const url = config.url || "";
    const method = config.method || "GET";
    logger.apiRequest(method, url, config.data);

    return config;
  },
  (error) => {
    logger.error("Request interceptor error", error, "API");
    throw error;
  }
);

apiClient.interceptors.response.use(
  (response) => {
    // Log successful response
    const url = response.config.url || "";
    const method = response.config.method || "GET";
    logger.apiResponse(method, url, response.status, response.data);

    return response;
  },
  async (error) => {
    // Log error response
    const url = error.config?.url || "";
    const method = error.config?.method || "GET";
    const status = error.response?.status;
    const errorData = error.response?.data || error.message;

    if (status) {
      logger.apiResponse(method, url, status, errorData);
    } else {
      logger.apiError(method, url, errorData);
    }

    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    throw error;
  }
);
