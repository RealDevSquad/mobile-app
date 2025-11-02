export type ExtensionRequestDTO = {
  id: string;
  taskId: string;
  title: string;
  reason: string;
  assignee: string;
  assigneeId: string;
  oldEndsOn: number;
  newEndsOn: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DENIED';
  requestNumber: number;
  timestamp: number;
};

export type ExtensionRequestsResponse = {
  message: string;
  allExtensionRequests: ExtensionRequestDTO[];
  next: string;
};
