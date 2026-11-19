import { QueryClient } from '@tanstack/react-query';

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 30_000,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export const queryClient = createQueryClient();

export const queryKeys = {
  auth: ['auth', 'me'] as const,
  publicConfiguration: ['public', 'configuration'] as const,
  installationStatus: ['auth', 'installation'] as const,
  approvalCount: ['approvals', 'count'] as const,
  notificationUnreadCount: ['notifications', 'unread-count'] as const,
  dashboard: {
    all: ['reporting', 'dashboard'] as const,
    summary: (params: Record<string, string | number | boolean | undefined>) =>
      ['reporting', 'dashboard', params] as const,
  },
  requests: {
    all: ['requests'] as const,
    list: (params: Record<string, string | number | boolean | undefined>) =>
      ['requests', 'list', params] as const,
    detail: (id: string) => ['requests', 'detail', id] as const,
    activity: (id: string, size: number) => ['requests', 'activity', id, size] as const,
    lookups: {
      requestTypes: ['requests', 'lookups', 'request-types'] as const,
      categories: ['requests', 'lookups', 'categories'] as const,
      natures: ['requests', 'lookups', 'natures'] as const,
      departments: ['requests', 'lookups', 'departments'] as const,
      branches: ['requests', 'lookups', 'branches'] as const,
      currencies: ['requests', 'lookups', 'currencies'] as const,
      taxAuthorities: ['requests', 'lookups', 'tax-authorities'] as const,
    },
  },
} as const;
