import { UsersApi } from '@/api/users/users.api';
import { TGetUserDetailsResponse } from '@/api/users/users.types';
import { useQuery } from '@tanstack/react-query';

export type UseCurrentUserResult = {
  user: TGetUserDetailsResponse | null;
  isLoading: boolean;
  isError: boolean;
};

export function useCurrentUser(): UseCurrentUserResult {
  const { data, isLoading, isError } = useQuery({
    queryKey: UsersApi.getUserDetails.key,
    queryFn: UsersApi.getUserDetails.fn,
  });

  const user = data ?? null;
  return { user, isLoading, isError };
}
