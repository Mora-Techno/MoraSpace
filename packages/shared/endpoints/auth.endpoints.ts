import { buildEndpoint } from '../config/api.config';

const mount = '/auth';

export const AUTH_ENDPOINTS = {
  LOGIN: buildEndpoint(mount, '/login'),
  REGISTER: buildEndpoint(mount, '/register'),
  LOGOUT: buildEndpoint(mount, '/logout'),
  REFRESH: buildEndpoint(mount, '/refresh'),
  SEND_MAGIC_LINK: buildEndpoint(mount, '/magic-link/send'),
  VERIFY_MAGIC_LINK: buildEndpoint(mount, '/magic-link/verify'),
  SEND_OTP: buildEndpoint(mount, '/otp/send'),
  FORGOT_PASSWORD: buildEndpoint(mount, '/forgot-password'),
  RESET_PASSWORD: buildEndpoint(mount, '/reset-password'),
  VERIFY_OTP: buildEndpoint(mount, '/otp/verify'),
} as const;

export function listAuthEndpoints() {
  return Object.keys(AUTH_ENDPOINTS).map((key) => ({
    name: key,
    path: AUTH_ENDPOINTS[key as keyof typeof AUTH_ENDPOINTS],
  }));
}
