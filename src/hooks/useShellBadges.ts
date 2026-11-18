import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/app/query-client';
import { getApprovalCount, getNotificationUnreadCount } from '@/api/services/auth';
import { useHasPermission } from './usePermissions';

export interface ShellBadges {
  approvalCount: number | undefined;
  notificationCount: number | undefined;
}

/** H05 W12/W17: 60-second polling, enabled only when the exact permission is present. */
export function useShellBadges(): ShellBadges {
  const canViewApprovals = useHasPermission('approval:view');
  const canViewNotifications = useHasPermission('notification:view');

  const approvals = useQuery({
    queryKey: queryKeys.approvalCount,
    queryFn: getApprovalCount,
    enabled: canViewApprovals,
    refetchInterval: 60_000,
  });
  const notifications = useQuery({
    queryKey: queryKeys.notificationUnreadCount,
    queryFn: getNotificationUnreadCount,
    enabled: canViewNotifications,
    refetchInterval: 60_000,
  });

  return {
    approvalCount: approvals.isSuccess ? approvals.data : undefined,
    notificationCount: notifications.isSuccess ? notifications.data.count : undefined,
  };
}
