import { permissionRequirement, type PermissionRequirement } from '@/auth/permissions';

interface RouteRule {
  pattern: RegExp;
  requirement: PermissionRequirement;
  title: string;
  section: string;
}

/** H09 route permission matrix. Backend remains authoritative for every API call. */
export const ROUTE_RULES: readonly RouteRule[] = [
  {
    pattern: /^\/app\/dashboard\/?$/,
    requirement: permissionRequirement(['report:view']),
    title: 'Dashboard',
    section: 'Overview',
  },
  {
    pattern: /^\/app\/requests\/mine\/?$/,
    requirement: permissionRequirement(['request:view-own']),
    title: 'My Requests',
    section: 'Requests',
  },
  {
    pattern: /^\/app\/requests\/all\/?$/,
    requirement: permissionRequirement(
      ['request:view-own', 'request:view-scope', 'request:view-all'],
      'any',
    ),
    title: 'All Requests',
    section: 'Requests',
  },
  {
    pattern: /^\/app\/requests\/new\/?$/,
    requirement: permissionRequirement(['request:create']),
    title: 'New Request',
    section: 'Requests',
  },
  {
    pattern: /^\/app\/requests\/[^/]+\/edit\/?$/,
    requirement: permissionRequirement(['request:edit']),
    title: 'Edit Request',
    section: 'Requests',
  },
  {
    pattern: /^\/app\/requests\/[^/]+\/?$/,
    requirement: permissionRequirement(['request:view-own']),
    title: 'Request Detail',
    section: 'Requests',
  },
  {
    pattern: /^\/app\/approvals\/tasks\/[^/]+\/?$/,
    requirement: permissionRequirement(['approval:view']),
    title: 'Approval Case',
    section: 'Approvals',
  },
  {
    pattern: /^\/app\/approvals\/?$/,
    requirement: permissionRequirement(['approval:view']),
    title: 'Approval Inbox',
    section: 'Approvals',
  },
  {
    pattern: /^\/app\/notifications\/?$/,
    requirement: permissionRequirement(['notification:view']),
    title: 'Notifications',
    section: 'Inbox',
  },
] as const;

export interface PageMeta {
  title: string;
  breadcrumbs: string[];
}

export function getRouteRequirement(pathname: string): PermissionRequirement | null {
  return ROUTE_RULES.find((rule) => rule.pattern.test(pathname))?.requirement ?? null;
}

/**
 * H04 keeps the Dashboard navigation item visible to every authenticated user,
 * while H09/Appendix A keep the dashboard route itself behind `report:view`.
 * This explicit exception preserves both rules without duplicating permission
 * metadata in the navigation catalogue.
 */
export function getNavigationRequirement(pathname: string): PermissionRequirement | null {
  if (/^\/app\/dashboard\/?$/.test(pathname)) return null;
  return getRouteRequirement(pathname);
}

export function getPageMeta(pathname: string): PageMeta {
  const rule = ROUTE_RULES.find((entry) => entry.pattern.test(pathname));
  if (!rule) {
    return { title: 'EDAM', breadcrumbs: ['Workspace'] };
  }
  return { title: rule.title, breadcrumbs: ['Workspace', rule.section, rule.title] };
}
