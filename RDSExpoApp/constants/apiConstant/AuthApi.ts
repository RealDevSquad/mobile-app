import { STAGING_BASE_URL } from './BaseUrl';
// const basrUrl = 'https://api.realdevsquad.com'; //production
const AuthApis = {
  USER_DETAIL: 'https://api.realdevsquad.com/users/userId/',
  QR_AUTH_API: 'https://api.realdevsquad.com/auth/qr-code-auth',
  QR_AUTH_API_STAGING: `${STAGING_BASE_URL}/auth/qr-code-auth`,
  GITHUB_AUTH_API: 'https://api.realdevsquad.com/auth/github/login',
};

export default AuthApis;
