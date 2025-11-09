import { PaginatedResponse, TApiResponse } from "../common/common.types";
import { ProgressUpdateDTO, ProgressUpdatesResponseDTO, TaskDTO, TaskDetailsDTO } from "./task.dto";

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
  blockers: string;
  type: string;
};

export type TCreateTaskResponse = TApiResponse<TaskDTO>;
export type TUpdateTaskResponse = TaskDTO;
export type TUpdateTaskStatusResponse = TaskDTO;
export type TSubmitProgressResponse = TApiResponse<ProgressUpdateDTO>;

export type TGithubUser = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  user_view_type: string;
  site_admin: boolean;
};

export type TGithubLabel = {
  id: number;
  node_id: string;
  url: string;
  name: string;
  color: string;
  default: boolean;
  description: string;
};

export type TGithubIssue = {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  user: TGithubUser;
  labels: TGithubLabel[];
  state: string;
  locked: boolean;
  assignee: TGithubUser | null;
  assignees: TGithubUser[];
  milestone: any;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  author_association: string;
  type: any;
  active_lock_reason: any;
  sub_issues_summary: {
    total: number;
    completed: number;
    percent_completed: number;
  };
  issue_dependencies_summary: {
    blocked_by: number;
    total_blocked_by: number;
    blocking: number;
    total_blocking: number;
  };
  body: string;
  closed_by: any;
  reactions: {
    url: string;
    total_count: number;
    "+1": number;
    "-1": number;
    laugh: number;
    hooray: number;
    confused: number;
    heart: number;
    rocket: number;
    eyes: number;
  };
  timeline_url: string;
  performed_via_github_app: any;
  state_reason: any;
};

export type TGithubIssuesResponse = {
  message: string;
  issues: TGithubIssue[];
};

export type TGetGithubIssueDto = {
  githubUrl: string;
};
