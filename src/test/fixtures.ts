import type {
  BootstrapResponse,
  CurrentUserResponse,
  InstallationStatusResponse,
  PasswordPolicyView,
  PublicConfigurationResponse,
} from '@/api/contracts';

export const INITIAL_CSRF_TOKEN = 'csrf-token-initial';
export const POST_LOGIN_CSRF_TOKEN = 'csrf-token-after-login';
export const INSTALLATION_TOKEN = 'one-time-installation-token';
export const TEST_PASSWORD = 'InitialPass1';

export const passwordPolicy: PasswordPolicyView = {
  minimumLength: 8,
  maximumLength: 64,
  requireUppercase: true,
  requireLowercase: true,
  requireDigit: true,
  requireSpecial: false,
};

const allRequiredPermissions = [
  'report:view',
  'request:view-own',
  'request:view-scope',
  'request:view-all',
  'request:create',
  'request:edit',
  'approval:view',
  'notification:view',
] as const;

export function currentUser(
  overrides: Partial<CurrentUserResponse> = {},
): CurrentUserResponse {
  return {
    userId: '00000000-0000-0000-0000-000000000001',
    username: 'admin',
    employeeCode: 'EMP-001',
    displayName: 'Preview Session',
    email: 'preview.session@example.invalid',
    designation: 'Institution Administrator',
    departmentId: null,
    departmentName: null,
    branchId: null,
    branchName: null,
    roles: [],
    permissions: [...allRequiredPermissions],
    dataScopes: [],
    installationScope: true,
    mustChangePassword: false,
    lastLoginAt: '2026-11-18T09:00:00Z',
    passwordPolicy,
    ...overrides,
  };
}

export const publicConfiguration: PublicConfigurationResponse = {
  applicationName: 'EDAM',
  organizationDisplayName: 'Preview Institution',
  organizationName: 'Preview Institution',
  supportEmail: 'support@example.invalid',
  logoAssetId: null,
  faviconAssetId: null,
  defaultLocale: 'en-GB',
  defaultTimeZone: 'Asia/Karachi',
  dateFormat: 'dd MMM yyyy',
  defaultCurrencyCode: 'PKR',
  activeThemeName: 'Institution Light',
  activeThemeType: 'LIGHT',
  themeTokens: { primary: '#1e5fd6' },
};

export const bootstrappedStatus: InstallationStatusResponse = {
  bootstrapped: true,
  bootstrappedAt: '2026-11-18T08:00:00Z',
};

export const bootstrapResponse: BootstrapResponse = {
  userId: '00000000-0000-0000-0000-000000000002',
  username: 'admin',
  displayName: 'Preview Session',
  roles: [],
  bootstrappedAt: '2026-11-18T10:00:00Z',
};
