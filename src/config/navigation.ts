import {
  Bell,
  ClipboardCheck,
  FilePlus2,
  Files,
  LayoutDashboard,
  ListFilter,
  type LucideIcon,
} from 'lucide-react';
import {
  permissionRequirement,
  satisfiesPermissionRequirement,
  type PermissionRequirement,
} from '@/auth/permissions';

export type AppRoute =
  | '/app/dashboard'
  | '/app/requests/mine'
  | '/app/requests/all'
  | '/app/requests/new'
  | '/app/approvals'
  | '/app/notifications';

export interface NavigationItem {
  label: string;
  to: AppRoute;
  icon: LucideIcon;
  description: string;
  access: PermissionRequirement | null;
  badge?: 'approvals' | 'notifications';
}

/** H04 §3 navigation → permission mapping. Dashboard nav is available to every authenticated user. */
export const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  {
    label: 'Dashboard',
    to: '/app/dashboard',
    icon: LayoutDashboard,
    description: 'Institution overview',
    access: null,
  },
  {
    label: 'My Requests',
    to: '/app/requests/mine',
    icon: Files,
    description: 'Requests you created',
    access: permissionRequirement(['request:view-own']),
  },
  {
    label: 'All Requests',
    to: '/app/requests/all',
    icon: ListFilter,
    description: 'Scoped register view',
    access: permissionRequirement(
      ['request:view-own', 'request:view-scope', 'request:view-all'],
      'any',
    ),
  },
  {
    label: 'New Request',
    to: '/app/requests/new',
    icon: FilePlus2,
    description: 'Create a draft request',
    access: permissionRequirement(['request:create']),
  },
  {
    label: 'Approval Inbox',
    to: '/app/approvals',
    icon: ClipboardCheck,
    description: 'Assigned approval tasks',
    access: permissionRequirement(['approval:view']),
    badge: 'approvals',
  },
  {
    label: 'Notifications',
    to: '/app/notifications',
    icon: Bell,
    description: 'Your notification inbox',
    access: permissionRequirement(['notification:view']),
    badge: 'notifications',
  },
] as const;

export function getVisibleNavigation(permissions: readonly string[] | undefined): NavigationItem[] {
  return NAVIGATION_ITEMS.filter((item) =>
    satisfiesPermissionRequirement(permissions, item.access),
  );
}
