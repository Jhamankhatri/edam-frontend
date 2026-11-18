/**
 * Cross-cutting Step-1 contract types, kept separate from the generated OpenAPI
 * definitions in `src/api/generated/schema.d.ts` (backend commit
 * 620f7a795cc67a16e905115131f561bbd986af85, artifact from Actions run 44395699755).
 *
 * The genuine OpenAPI 3.1 document emits no `required` or `nullable` metadata for
 * response DTOs, so openapi-typescript marks every response field optional and
 * non-nullable. These Step 1 types are transcribed from the exact backend Java
 * records (which do return null for optional display fields) and are deliberately
 * stricter than the generated response shapes. Nothing here is invented: see
 * `docs/PHASE1_STEP1_CONTRACT_NOTES.md` §7 and §14.
 */

export interface ApiEnvelope<T> {
  success: boolean;
  data?: T | null;
  error?: ErrorBody | null;
  fieldErrors?: FieldErrorDetail[] | null;
  correlationId?: string;
  path?: string;
  timestamp?: string;
}

export interface ErrorBody {
  code: string;
  message: string;
}

export interface FieldErrorDetail {
  field: string;
  message: string;
}

export interface DataScopeView {
  type: string;
  referenceId: string;
  referenceName: string;
}

export interface PasswordPolicyView {
  minimumLength: number;
  maximumLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireDigit: boolean;
  requireSpecial: boolean;
}

export interface CurrentUserResponse {
  userId: string;
  username: string;
  employeeCode: string;
  displayName: string;
  email: string;
  designation: string | null;
  departmentId: string | null;
  departmentName: string | null;
  branchId: string | null;
  branchName: string | null;
  roles: string[];
  permissions: string[];
  dataScopes: DataScopeView[];
  installationScope: boolean;
  mustChangePassword: boolean;
  lastLoginAt: string | null;
  passwordPolicy: PasswordPolicyView;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface NeutralResponse {
  message: string;
}

export interface InstallationStatusResponse {
  bootstrapped: boolean;
  bootstrappedAt: string | null;
}

export interface BootstrapRequest {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeCode?: string;
  password: string;
}

export interface BootstrapResponse {
  userId: string;
  username: string;
  displayName: string;
  roles: string[];
  bootstrappedAt: string;
}

export interface CsrfTokenResponse {
  headerName: string;
  parameterName: string;
  token: string;
}

export interface PublicConfigurationResponse {
  applicationName: string;
  organizationDisplayName: string | null;
  organizationName: string | null;
  supportEmail: string | null;
  logoAssetId: string | null;
  faviconAssetId: string | null;
  defaultLocale: string;
  defaultTimeZone: string;
  dateFormat: string;
  defaultCurrencyCode: string | null;
  activeThemeName: string | null;
  activeThemeType: string | null;
  themeTokens: Record<string, string>;
}

export interface UnreadCountResponse {
  count: number;
}
