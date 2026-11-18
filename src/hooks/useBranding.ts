import { env } from '@/config/env';
import { useAuth } from '@/auth/useAuth';

export interface Branding {
  appName: string;
  organizationName: string;
  supportEmail: string | null;
  locale: string;
  hasServerBranding: boolean;
}

export function useBranding(): Branding {
  const { publicConfiguration } = useAuth();
  const serverAppName = publicConfiguration?.applicationName.trim() || '';
  const appName = env.appName.trim() || serverAppName || 'EDAM';
  return {
    appName,
    organizationName:
      publicConfiguration?.organizationDisplayName?.trim() ||
      publicConfiguration?.organizationName?.trim() ||
      appName,
    supportEmail: publicConfiguration?.supportEmail ?? null,
    locale: publicConfiguration?.defaultLocale || env.defaultLocale,
    hasServerBranding: Boolean(publicConfiguration),
  };
}
