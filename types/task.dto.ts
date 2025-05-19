export interface GithubIssue {
  [key: string]: any;
}

export interface TaskDTO {
  assignee: string;
  assigneeId: string;
  createdAt: number;
  endsOn: number;
  github: {
    issue: GithubIssue;
  };
  id: string;
  percentCompleted: number;
  priority: string;
  startedOn: number;
  status: string;
  title: string;
  type: string;
  updatedAt: number;
}
