export interface UserPicture {
  publicId: string;
  url: string;
}

export interface UserRoles {
  archived: boolean;
  in_discord: boolean;
  member: boolean;
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
