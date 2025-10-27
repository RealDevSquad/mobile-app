import { UserData, UserStatus } from '@/types/user.dto';
import { TApiResponse } from '../common/common.types';

// Request DTOs
export type TGetUserDetailsDto = {
  // No specific request params for user details
};

export type TGetUserStatusDto = {
  // No specific request params for user status
};

export type TSearchUsersDto = {
  search: string;
  size?: number;
};

export type TGetActiveTaskDto = {
  // No specific request params for active task
};

// Response DTOs
export type TGetUserDetailsResponse = UserData;
export type TGetUserStatusResponse = UserStatus;
export type TSearchUsersResponse = {
  users: UserData[];
};
export type TGetActiveTaskResponse = UserData[];

// OOO (Out of Office) types
export type TSubmitOOOFormDto = {
  fromDate: string;
  toDate: string;
  description: string;
};

export type TCancelOOODto = {
  // No specific request params for cancel OOO
};

export type TSubmitOOOResponse = TApiResponse<{ success: boolean }>;
export type TCancelOOOResponse = TApiResponse<{ success: boolean }>;
