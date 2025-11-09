import { apiClient } from "../client";
import { appConfig } from "../../config/app.config";
import {
  TCreateTaskRequestDto,
  TCreateTaskRequestResponse,
  TGetTaskRequestByIdResponse,
  TGetTaskRequestsDto,
  TGetTaskRequestsResponse,
  TTaskRequestActionDto,
  TTaskRequestActionResponse,
} from "./task-requests.types";

export const TaskRequestsApi = {
  getTaskRequests: {
    key: (params?: TGetTaskRequestsDto) => [
      "TaskRequestsApi.getTaskRequests",
      JSON.stringify(params),
    ],
    fn: async (params?: TGetTaskRequestsDto): Promise<TGetTaskRequestsResponse> => {
      let url = "/taskRequests";

      const queryParts: string[] = [];

      if (params?.status === "ALL") {
        queryParts.push("size=5", "q=sort:created-asc");
      } else {
        const status = params?.status || "PENDING";
        queryParts.push("size=5", `q=status%3A${status.toLowerCase()}+sort%3Acreated-desc`);
      }

      if (params?.next) {
        queryParts.push(`next=${encodeURIComponent(params.next)}`);
      }

      const queryString = queryParts.join("&");
      const fullUrl = `${appConfig.backendBaseUrl}${url}?${queryString}`;

      try {
        const { data } = await apiClient.get<any>(fullUrl);

        const transformedData: TGetTaskRequestsResponse = {
          data: data.data || [],
          taskRequests: data.data || [],
          next: data.next,
          hasMore: !!data.next,
          total: data.total,
        };

        return transformedData;
      } catch (error: any) {
        throw error;
      }
    },
  },

  getTaskRequestById: {
    key: (id: string) => ["TaskRequestsApi.getTaskRequestById", id],
    fn: async (id: string): Promise<TGetTaskRequestByIdResponse> => {
      const url = `/taskRequests/${id}`;

      try {
        const { data } = await apiClient.get<{
          data: TGetTaskRequestByIdResponse;
          message: string;
        }>(url);
        return data.data;
      } catch (error: any) {
        throw error;
      }
    },
  },

  updateTaskRequestStatus: {
    key: (taskRequestId: string, userId: string, action: "approve" | "reject") => [
      "TaskRequestsApi.updateTaskRequestStatus",
      taskRequestId,
      userId,
      action,
    ],
    fn: async ({
      taskRequestId,
      userId,
      action,
    }: TTaskRequestActionDto): Promise<TTaskRequestActionResponse> => {
      const url = `/taskRequests?action=${action}`;
      const payload = action === "reject" ? { taskRequestId } : { taskRequestId, userId };

      try {
        const { data } = await apiClient.patch<TTaskRequestActionResponse>(url, payload);

        return data;
      } catch (error: any) {
        throw error;
      }
    },
  },

  createTaskRequest: {
    key: ["TaskRequestsApi.createTaskRequest"],
    fn: async (taskRequest: TCreateTaskRequestDto): Promise<TCreateTaskRequestResponse> => {
      const { data } = await apiClient.post<TCreateTaskRequestResponse>(
        "/taskRequests",
        taskRequest
      );
      return data;
    },
  },
};
