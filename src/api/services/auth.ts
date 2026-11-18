import { apiFetch, type ApiRequestOptions } from '@/api/client';
import { primeCsrf } from '@/api/csrf';
import type {
  BootstrapRequest,
  BootstrapResponse,
  ChangePasswordRequest,
  CurrentUserResponse,
  ForgotPasswordRequest,
  InstallationStatusResponse,
  LoginRequest,
  NeutralResponse,
  PublicConfigurationResponse,
  ResetPasswordRequest,
  UnreadCountResponse,
} from '@/api/contracts';
import { ENDPOINTS } from '@/api/endpoints';

const suppressSessionExpiration: Pick<ApiRequestOptions, 'suppressAuthExpiration'> = {
  suppressAuthExpiration: true,
};

export function getPublicConfiguration(): Promise<PublicConfigurationResponse> {
  return apiFetch<PublicConfigurationResponse>({
    method: 'GET',
    path: ENDPOINTS.publicConfiguration,
    ...suppressSessionExpiration,
  });
}

export function getInstallationStatus(): Promise<InstallationStatusResponse> {
  return apiFetch<InstallationStatusResponse>({
    method: 'GET',
    path: ENDPOINTS.authInstallation,
    ...suppressSessionExpiration,
  });
}

export function getCurrentUser(
  options: Pick<ApiRequestOptions, 'suppressAuthExpiration'> = {},
): Promise<CurrentUserResponse> {
  return apiFetch<CurrentUserResponse>({
    method: 'GET',
    path: ENDPOINTS.authMe,
    ...options,
  });
}

export async function login(credentials: LoginRequest): Promise<CurrentUserResponse> {
  await primeCsrf({ force: true });
  const user = await apiFetch<CurrentUserResponse>({
    method: 'POST',
    path: ENDPOINTS.authLogin,
    body: credentials,
    suppressAuthExpiration: true,
  });
  // H03/H05: login rotates the CSRF cookie; explicitly refresh it before the next write.
  await primeCsrf({ force: true }).catch(() => undefined);
  return user;
}

export function logout(): Promise<void> {
  return apiFetch<void>({
    method: 'POST',
    path: ENDPOINTS.authLogout,
    suppressAuthExpiration: true,
  });
}

export async function bootstrapInstallation(
  installationToken: string,
  payload: BootstrapRequest,
): Promise<BootstrapResponse> {
  // H05 W1: explicitly obtain CSRF before the first bootstrap write.
  await primeCsrf({ force: true });
  return apiFetch<BootstrapResponse>({
    method: 'POST',
    path: ENDPOINTS.authBootstrap,
    body: payload,
    headers: { 'X-Installation-Token': installationToken },
    suppressAuthExpiration: true,
  });
}

export function forgotPassword(payload: ForgotPasswordRequest): Promise<NeutralResponse> {
  return apiFetch<NeutralResponse>({
    method: 'POST',
    path: ENDPOINTS.authForgotPassword,
    body: payload,
    suppressAuthExpiration: true,
  });
}

export function resetPassword(payload: ResetPasswordRequest): Promise<void> {
  return apiFetch<void>({
    method: 'POST',
    path: ENDPOINTS.authResetPassword,
    body: payload,
    suppressAuthExpiration: true,
  });
}

export function changePassword(payload: ChangePasswordRequest): Promise<void> {
  return apiFetch<void>({
    method: 'POST',
    path: ENDPOINTS.authChangePassword,
    body: payload,
    suppressAuthExpiration: true,
  });
}

export function getApprovalCount(): Promise<number> {
  return apiFetch<number>({ method: 'GET', path: ENDPOINTS.approvalsCount });
}

export function getNotificationUnreadCount(): Promise<UnreadCountResponse> {
  return apiFetch<UnreadCountResponse>({
    method: 'GET',
    path: ENDPOINTS.notificationsUnreadCount,
  });
}
