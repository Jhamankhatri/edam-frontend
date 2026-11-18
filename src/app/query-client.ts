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
} as const;
