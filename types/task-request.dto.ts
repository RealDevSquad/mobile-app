export interface TaskRequestUser {
  userId: string;
  username: string;
  first_name: string;
  last_name: string;
  picture?: {
    publicId: string;
    url: string;
  };
  proposedStartDate: number;
  proposedDeadline: number;
  description?: string;
  status: string;
  markdownEnabled?: boolean;
}

export interface TaskRequestDTO {
  id: string;
  createdAt: number;
  lastModifiedAt: number;
  requestType: string;
  createdBy: string;
  requestors: string[];
  lastModifiedBy: string;
  taskTitle: string;
  externalIssueUrl?: string;
  externalIssueHtmlUrl?: string;
  users: TaskRequestUser[];
  status: string;
  usersCount: number;
  url?: string;
}

export interface TaskRequestsResponse {
  message: string;
  data: TaskRequestDTO[];
  next: string;
  prev: string;
}

export interface TaskRequestDetailsResponse {
  message: string;
  data: TaskRequestDTO;
}
