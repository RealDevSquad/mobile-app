import { BASE_URL } from "./base-url";

const AuthApis = {
  USER_DETAIL: `${BASE_URL}/users/userId/`,
  QR_AUTH_API: `${BASE_URL}/auth/qr-code-auth`,
  GITHUB_AUTH_API: `${BASE_URL}/auth/github/login`,
};

export default AuthApis;
