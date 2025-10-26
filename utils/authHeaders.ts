/**
 * Creates authentication headers based on token type
 * - JWT tokens (starting with 'eyJ') use Authorization header
 * - Session tokens use Cookie header
 * - For staging environment, uses rds-session-staging cookie name
 */
export const createAuthHeaders = (token: string): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token?.startsWith("eyJ")) {
    // JWT token - use Authorization header
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    // Session token - use Cookie header
    // For staging environment, use rds-session-staging
    headers["Cookie"] = `rds-session-staging=${token}`;
  }

  return headers;
};
