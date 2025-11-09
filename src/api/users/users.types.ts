import { TApiResponse } from "../common/common.types";
import { UserData, UserStatus } from "./user.dto";

// Request DTOs
export type TGetUserDetailsDto = Record<string, never>;

export type TGetUserStatusDto = Record<string, never>;

export type TGetUserByIdDto = {
  userId: string;
};

export type TSearchUsersDto = {
  search: string;
  size?: number;
};

export type TGetActiveTaskDto = Record<string, never>;

export type TGetUserDetailsResponse = UserData;
export type TGetUserStatusResponse = UserStatus;
export type TSearchUsersResponse = {
  users: UserData[];
};
export type TGetActiveTaskResponse = UserData[];

export type TGetMembersDto = {
  next?: string;
  prev?: string;
  size?: number;
};

export type { TGetMembersResponse } from "./user.dto";

export type TSubmitOOOFormDto = {
  fromDate: string;
  toDate: string;
  description: string;
};

export type TCancelOOODto = Record<string, never>;

export type TSubmitOOOResponse = TApiResponse<{ success: boolean }>;
export type TCancelOOOResponse = TApiResponse<{ success: boolean }>;
