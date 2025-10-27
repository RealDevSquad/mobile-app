import { TaskRequestDTO } from '@/types/task-request.dto';
import { PaginatedResponse, TApiResponse } from '../common/common.types';

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
export type TGetTaskRequestsResponse = PaginatedResponse<TaskRequestDTO> & {
  taskRequests: TaskRequestDTO[];
};

export type TGetTaskRequestByIdDto = {
  id: string;
};

export type TGetTaskRequestByIdResponse = TaskRequestDTO;

export type TApproveTaskRequestResponse = TApiResponse<TaskRequestDTO>;
export type TRejectTaskRequestResponse = TApiResponse<TaskRequestDTO>;
