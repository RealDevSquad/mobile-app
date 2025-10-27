import {
  ProgressUpdateDTO,
  ProgressUpdatesResponseDTO,
  TaskDTO,
  TaskDetailsDTO,
} from '@/types/task.dto';
import { PaginatedResponse, TApiResponse } from '../common/common.types';

// Request DTOs
export type TGetTaskReqDto = {
  next?: string;
  assignee?: string;
  dev?: boolean;
};

export type TGetTasksDto = PaginatedResponse<TaskDTO> & {
  tasks: TaskDTO[];
};

export type TGetSelfTasksDto = TaskDTO[];

export type TGetTaskDetailsDto = TaskDetailsDTO;

export type TGetTaskProgressDto = ProgressUpdatesResponseDTO;

export type TCreateTaskReqDto = {
  title: string;
  description?: string;
  assignee?: string;
  priority?: string;
  type?: string;
  endsOn?: number;
  dependsOn?: string[];
};

export type TUpdateTaskDto = {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  percentCompleted?: number;
  priority?: string;
  type?: string;
  endsOn?: number;
  dependsOn?: string[];
};

export type TUpdateTaskStatusDto = {
  status: string;
  percentCompleted?: number;
};

export type TSubmitProgressDto = {
  taskId: string;
  completed: string;
  planned: string;
  blockers?: string;
};

export type TCreateTaskResponse = TApiResponse<TaskDTO>;
export type TUpdateTaskResponse = TaskDTO;
export type TUpdateTaskStatusResponse = TaskDTO;
export type TSubmitProgressResponse = TApiResponse<ProgressUpdateDTO>;
