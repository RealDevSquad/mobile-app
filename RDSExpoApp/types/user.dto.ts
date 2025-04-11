export interface Picture {
    publicId: string;
    url: string;
  }
  
  export interface Roles {
    archived: boolean;
    in_discord: boolean;
  }
  
  export interface Picture {
    publicId: string;
    url: string;
  }
  
  export interface Roles {
    archived: boolean;
    in_discord: boolean;
  }
  
  export interface UserDTO {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    github_id: string;
    github_user_id: string;
    github_display_name: string;
    github_created_at: number;
    designation: string;
    company: string;
    linkedin_id: string;
    twitter_id: string;
    discordId: string;
    discordJoinedAt: string;
    incompleteUserDetails: boolean;
    picture: Picture;
    roles: Roles;
    created_at: number;
    updated_at: number;
  }

  export interface MonthlyHours {
    committed: number;
  }
  
  export interface CurrentStatus {
    state: string;
    message: string;
    from: number;
    until: string;
    updatedAt: number;
  }
  
  export interface UserStatusDTO {
    id: string;
    userId: string;
    monthlyHours: MonthlyHours;
    currentStatus: CurrentStatus;
    message: string;
  }