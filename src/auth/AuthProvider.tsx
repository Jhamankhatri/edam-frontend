import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type {
  BootstrapRequest,
  BootstrapResponse,
  CurrentUserResponse,
  InstallationStatusResponse,
  LoginRequest,
  PublicConfigurationResponse,
} from '@/api/contracts';
import type { ApiError } from '@/api/errors';
import { isUnauthenticatedError, normalizeUnknownError } from '@/api/errors';
import { primeCsrf } from '@/api/csrf';
import {
  bootstrapInstallation,
  getCurrentUser,
  getInstallationStatus,
  getPublicConfiguration,
  login as loginRequest,
  logout as logoutRequest,
} from '@/api/services/auth';
import { applyPublicBranding } from '@/lib/theme';
import { AuthContext, type AuthContextValue, type AuthStatus } from './auth-context';
import {
  hasPermission,
  satisfiesPermissionRequirement,
  type PermissionCode,
  type PermissionRequirement,
} from './permissions';
import { subscribeToAuthExpired } from './session-events';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const initializationRef = useRef<Promise<void> | null>(null);
  const [status, setStatus] = useState<AuthStatus>('initializing');
  const [user, setUser] = useState<CurrentUserResponse | null>(null);
  const [publicConfiguration, setPublicConfiguration] = useState<PublicConfigurationResponse | null>(null);
  const [installationStatus, setInstallationStatus] = useState<InstallationStatusResponse | null>(null);
  const [initializationError, setInitializationError] = useState<ApiError | null>(null);

  const initialize = useCallback(
    async (force = false): Promise<void> => {
      if (!force && initializationRef.current) return initializationRef.current;
      setStatus('initializing');
      setInitializationError(null);

      const task = (async (): Promise<void> => {
        const [configurationResult, sessionResult, installationResult] = await Promise.allSettled([
          getPublicConfiguration(),
          getCurrentUser({ suppressAuthExpiration: true }),
          getInstallationStatus(),
          // Explicit H03 priming before the first write. A CSRF failure must not hide a valid session.
          primeCsrf({ force: true }),
        ]);

        if (configurationResult.status === 'fulfilled') {
          setPublicConfiguration(configurationResult.value);
          applyPublicBranding(configurationResult.value);
        }
        if (installationResult.status === 'fulfilled') {
          setInstallationStatus(installationResult.value);
        }

        if (sessionResult.status === 'fulfilled') {
          setUser(sessionResult.value);
          setStatus('authenticated');
          return;
        }

        const sessionError = normalizeUnknownError(sessionResult.reason);
        if (isUnauthenticatedError(sessionError)) {
          setUser(null);
          setStatus('anonymous');
          return;
        }
        setUser(null);
        setInitializationError(sessionError);
        setStatus('error');
      })();

      initializationRef.current = task;
      try {
        await task;
      } finally {
        initializationRef.current = null;
      }
    },
    [],
  );

  useEffect(() => {
    void initialize();
  }, [initialize]);

  useEffect(
    () =>
      subscribeToAuthExpired(() => {
        setUser(null);
        setStatus('anonymous');
        void queryClient.clear();
      }),
    [queryClient],
  );

  const login = useCallback(
    async (credentials: LoginRequest): Promise<CurrentUserResponse> => {
      const authenticatedUser = await loginRequest(credentials);
      setUser(authenticatedUser);
      setStatus('authenticated');
      setInitializationError(null);
      void queryClient.clear();
      return authenticatedUser;
    },
    [queryClient],
  );

  const logout = useCallback(async (): Promise<void> => {
    let failure: unknown;
    try {
      await logoutRequest();
    } catch (error) {
      failure = error;
    } finally {
      setUser(null);
      setStatus('anonymous');
      void queryClient.clear();
      await primeCsrf({ force: true }).catch(() => undefined);
    }
    if (failure) throw normalizeUnknownError(failure);
  }, [queryClient]);

  const bootstrap = useCallback(
    async (
      installationToken: string,
      payload: BootstrapRequest,
    ): Promise<BootstrapResponse> => {
      const created = await bootstrapInstallation(installationToken, payload);
      setInstallationStatus({ bootstrapped: true, bootstrappedAt: created.bootstrappedAt });
      // D-23: no session is established here and no user state is set.
      return created;
    },
    [],
  );

  const refresh = useCallback(async (): Promise<CurrentUserResponse> => {
    const refreshed = await getCurrentUser();
    setUser(refreshed);
    setStatus('authenticated');
    return refreshed;
  }, []);

  const retryInitialization = useCallback((): void => {
    void initialize(true);
  }, [initialize]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      publicConfiguration,
      installationStatus,
      initializationError,
      login,
      logout,
      bootstrap,
      refresh,
      retryInitialization,
      hasPermission: (code: PermissionCode) => hasPermission(user?.permissions, code),
      satisfiesRequirement: (requirement: PermissionRequirement | null) =>
        satisfiesPermissionRequirement(user?.permissions, requirement),
    }),
    [
      status,
      user,
      publicConfiguration,
      installationStatus,
      initializationError,
      login,
      logout,
      bootstrap,
      refresh,
      retryInitialization,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
