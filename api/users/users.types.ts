import { UserData, UserStatus } from '@/types/user.dto';
import { TApiResponse } from '../common/common.types';

// Request DTOs
export type TGetUserDetailsDto = Record<string, never>;

export type TGetUserStatusDto = Record<string, never>;

export type TSearchUsersDto = {
  search: string;
  size?: number;
};

export type TGetActiveTaskDto = Record<string, never>;

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

export type TCancelOOODto = Record<string, never>;

export type TSubmitOOOResponse = TApiResponse<{ success: boolean }>;
export type TCancelOOOResponse = TApiResponse<{ success: boolean }>;
