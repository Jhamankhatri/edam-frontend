import { createContext } from 'react';
import type { ApiError } from '@/api/errors';
import type {
  BootstrapRequest,
  BootstrapResponse,
  CurrentUserResponse,
  InstallationStatusResponse,
  LoginRequest,
  PublicConfigurationResponse,
} from '@/api/contracts';
import type { PermissionCode, PermissionRequirement } from './permissions';

export type AuthStatus = 'initializing' | 'authenticated' | 'anonymous' | 'error';

export interface AuthContextValue {
  status: AuthStatus;
  user: CurrentUserResponse | null;
  publicConfiguration: PublicConfigurationResponse | null;
  installationStatus: InstallationStatusResponse | null;
  initializationError: ApiError | null;
  login: (credentials: LoginRequest) => Promise<CurrentUserResponse>;
  logout: () => Promise<void>;
  bootstrap: (installationToken: string, payload: BootstrapRequest) => Promise<BootstrapResponse>;
  refresh: () => Promise<CurrentUserResponse>;
  retryInitialization: () => void;
  hasPermission: (code: PermissionCode) => boolean;
  hasAnyPermission: (codes: readonly PermissionCode[]) => boolean;
  satisfiesRequirement: (requirement: PermissionRequirement | null) => boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
