export type UserPicture = {
  publicId: string;
  url: string;
};

export type UserRoles = {
  archived: boolean;
  in_discord: boolean;
  member: boolean;
  super_user?: boolean;
};

export type CurrentStatus = {
  state: string;
  from: number;
  until: number;
  message: string;
  updatedAt: number;
};

export type UserStatus = {
  data: {
    currentStatus: CurrentStatus;
  };
};

export type UserRolesExtended = {
  archived: boolean;
  in_discord: boolean;
  super_user: boolean;
};

export type UserDetails = {
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
};

export type TGetUserByIdResponse = {
  message: string;
  user: UserDetails;
};

export type UserData = {
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
};

export type MemberUserRoles = {
  archived: boolean;
  in_discord: boolean;
  member: boolean;
  super_user?: boolean | string;
  admin?: boolean;
};

export type MemberUser = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  github_id: string;
  github_display_name: string;
  github_user_id: string;
  github_created_at: number;
  discordId: string;
  discordJoinedAt: string;
  profileURL: string;
  incompleteUserDetails: boolean;
  picture: UserPicture;
  roles: MemberUserRoles;
  created_at: number;
  updated_at: number;
  company?: string;
  company_name?: string;
  designation?: string;
  website?: string;
  linkedin_id?: string;
  twitter_id?: string;
  instagram_id?: string;
  yoe?: number | string;
  status?: string;
  profileStatus?: string;
  isSubscribed?: boolean;
  isMember?: boolean;
  disabled_roles?: string[];
};

export type MembersResponseLinks = {
  next?: string;
  prev?: string;
};

export type TGetMembersResponse = {
  message: string;
  users: MemberUser[];
  links: MembersResponseLinks;
};
