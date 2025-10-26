import { TaskRequestDTO } from "@/types/task-request.dto";
import { TApiResponse } from "../common/common.types";

// Request DTOs
export type TGetTaskRequestsDto = {
  status?: string;
  next?: string;
  size?: string;
  q?: string;
};

export type TApproveTaskRequestDto = {
  taskRequestId: string;
  userId: string;
};

export type TRejectTaskRequestDto = {
  taskRequestId: string;
  userId: string;
  reason?: string;
};

// Response DTOs
export type TGetTaskRequestsResponse = {
  data: TaskRequestDTO[];
  next?: string;
};

export type TApproveTaskRequestResponse = TApiResponse<TaskRequestDTO>;
export type TRejectTaskRequestResponse = TApiResponse<TaskRequestDTO>;
