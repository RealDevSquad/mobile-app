import { useQuery } from "@tanstack/react-query";
import { UsersApi } from "../api/users/users.api";
import { useAuthStore } from "../store/authStore";

export function useCurrentUser() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: UsersApi.getUserDetails.key,
    queryFn: UsersApi.getUserDetails.fn,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}
