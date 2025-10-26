export interface GithubIssue {
  url: string;
  html_url: string;
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
  dependsOn: string[];
}

export interface TaskDetailsDTO {
  message: string;
  taskData: {
    assignee: string;
    assigneeId: string;
    createdAt: number;
    updatedAt: number;
    startedOn: number;
    endsOn: number;
    github: {
      issue: GithubIssue;
    };
    id: string;
    percentCompleted: number;
    priority: string;
    status: string;
    title: string;
    type: string;
    updated_at: number;
    dependsOn: string[];
  };
}

export interface ProgressUpdateDTO {
  id: string;
  type: string;
  taskId: string;
  completed: string;
  planned: string;
  blockers: string;
  userId: string;
  createdAt: number;
  date: number;
  userData: {
    github_created_at: number;
    github_display_name: string;
    github_id: string;
    github_user_id: string;
    website: string;
    last_name: string;
    linkedin_id: string;
    company: string;
    designation: string;
    twitter_id: string;
    first_name: string;
    incompleteUserDetails: boolean;
    username: string;
    created_at: number;
    discordJoinedAt: string;
    discordId: string;
    picture: {
      publicId: string;
      url: string;
    };
    roles: {
      member: boolean;
      in_discord: boolean;
      archived: boolean;
      super_user: boolean;
    };
    profileURL: string;
    profileStatus: string;
    updated_at: number;
    id: string;
  };
}

export interface ProgressUpdatesResponseDTO {
  message: string;
  count: number;
  data: ProgressUpdateDTO[];
}
