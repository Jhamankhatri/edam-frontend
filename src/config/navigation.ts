import {
  Bell,
  ClipboardCheck,
  FilePlus2,
  Files,
  LayoutDashboard,
  ListFilter,
  type LucideIcon,
} from 'lucide-react';
import { satisfiesPermissionRequirement } from '@/auth/permissions';
import { getNavigationRequirement } from './route-access';

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
  badge?: 'approvals' | 'notifications';
}

/**
 * H04 §3 navigation metadata. Permission requirements live only in the route
 * matrix so navigation and route guards cannot drift apart.
 */
export const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  {
    label: 'Dashboard',
    to: '/app/dashboard',
    icon: LayoutDashboard,
    description: 'Institution overview',
  },
  {
    label: 'My Requests',
    to: '/app/requests/mine',
    icon: Files,
    description: 'Requests you created',
  },
  {
    label: 'All Requests',
    to: '/app/requests/all',
    icon: ListFilter,
    description: 'Scoped register view',
  },
  {
    label: 'New Request',
    to: '/app/requests/new',
    icon: FilePlus2,
    description: 'Create a draft request',
  },
  {
    label: 'Approval Inbox',
    to: '/app/approvals',
    icon: ClipboardCheck,
    description: 'Assigned approval tasks',
    badge: 'approvals',
  },
  {
    label: 'Notifications',
    to: '/app/notifications',
    icon: Bell,
    description: 'Your notification inbox',
    badge: 'notifications',
  },
] as const;

export function getVisibleNavigation(permissions: readonly string[] | undefined): NavigationItem[] {
  return NAVIGATION_ITEMS.filter((item) =>
    satisfiesPermissionRequirement(permissions, getNavigationRequirement(item.to)),
  );
}
