import { useAuth } from '@/auth/useAuth';
import type { PermissionCode } from '@/auth/permissions';
import { getVisibleNavigation } from '@/config/navigation';

export function useHasPermission(code: PermissionCode): boolean {
  return useAuth().hasPermission(code);
}

export function useVisibleNavigation() {
  const { user } = useAuth();
  return getVisibleNavigation(user?.permissions);
}
