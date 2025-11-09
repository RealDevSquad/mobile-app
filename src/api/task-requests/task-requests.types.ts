import { PaginatedResponse, TApiResponse } from "../common/common.types";
import { TaskRequestDTO } from "./task-request.dto";

// Request DTOs
export type TGetTaskRequestsDto = {
  status?: string;
  next?: string;
  size?: string;
  q?: string;
};

export type TTaskRequestActionDto = {
  taskRequestId: string;
  userId?: string;
  action: "approve" | "reject";
};

// Response DTOs
export type TGetTaskRequestsResponse = PaginatedResponse<TaskRequestDTO> & {
  taskRequests: TaskRequestDTO[];
};

export type TGetTaskRequestByIdDto = {
  id: string;
};

export type TGetTaskRequestByIdResponse = TaskRequestDTO;

export type TTaskRequestActionResponse = TApiResponse<TaskRequestDTO>;

export type TCreateTaskRequestDto = {
  externalIssueUrl: string;
  externalIssueHtmlUrl: string;
  userId: string;
  requestType: "CREATION";
  proposedStartDate: number;
  proposedDeadline: number;
  description: string;
  markdownEnabled: boolean;
};

export type TCreateTaskRequestResponse = TApiResponse<TaskRequestDTO>;
