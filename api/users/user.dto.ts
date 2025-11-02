export interface UserPicture {
  publicId: string;
  url: string;
}

export interface UserRoles {
  archived: boolean;
  in_discord: boolean;
  member: boolean;
  super_user?: boolean;
}

export interface CurrentStatus {
  state: string;
  from: number;
  until: number;
  message: string;
  updatedAt: number;
}

export interface UserStatus {
  data: {
    currentStatus: CurrentStatus;
  };
}

export interface UserRolesExtended {
  archived: boolean;
  in_discord: boolean;
  designer: boolean;
}

export interface UserDetails {
  github_id: string;
  github_display_name: string | null;
  github_created_at: number;
  github_user_id: string;
  created_at: number;
  incompleteUserDetails: boolean;
  last_name: string;
  first_name: string;
  username: string;
  discordJoinedAt: string;
  discordId: string;
  roles: UserRolesExtended;
  updated_at: number;
  id: string;
}

export interface TGetUserByIdResponse {
  message: string;
  user: UserDetails;
}

export interface UserData {
  github_created_at: number;
  github_display_name: string;
  github_id: string;
  github_user_id: string;
  incompleteUserDetails: boolean;
  website: string;
  linkedin_id: string;
  company: string;
  designation: string;
  twitter_id: string;
  discordJoinedAt: string;
  discordId: string;
  id: string;
  username: string;
  last_name: string;
  first_name: string;
  created_at: number;
  isSubscribed: boolean;
  profileURL: string;
  picture: UserPicture;
  roles: UserRoles;
  profileStatus: string;
  updated_at: number;
}
