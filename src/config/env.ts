const trimTrailingSlash = (value: string): string => value.replace(/\/$/, '');

const parseTimeout = (value: string | undefined): number => {
  const parsed = Number(value ?? '25');
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 25;
};

export const env = {
  apiBaseUrl: trimTrailingSlash(import.meta.env.VITE_API_BASE_URL ?? '/api/v1'),
  appName: import.meta.env.VITE_APP_NAME ?? '',
  defaultLocale: import.meta.env.VITE_DEFAULT_LOCALE ?? 'en-GB',
  idleTimeoutMinutes: parseTimeout(import.meta.env.VITE_IDLE_TIMEOUT_MINUTES),
  sentryDsn: import.meta.env.VITE_SENTRY_DSN ?? '',
} as const;
