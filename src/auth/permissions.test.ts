import { describe, expect, it } from 'vitest';
import {
  hasAnyPermission,
  hasPermission,
  permissionRequirement,
  satisfiesPermissionRequirement,
} from './permissions';
import { PERMISSION_CODES, PERMISSION_CODE_SET } from './permission-codes';
import { getVisibleNavigation, NAVIGATION_ITEMS } from '@/config/navigation';
import { getPageMeta, getRouteRequirement } from '@/config/route-access';

describe('permission catalogue and centralized guards', () => {
  it('contains 60 unique source-derived permission codes and no invented document:view', () => {
    expect(PERMISSION_CODES).toHaveLength(60);
    expect(new Set(PERMISSION_CODES).size).toBe(60);
    expect(PERMISSION_CODE_SET.has('report:view')).toBe(true);
    expect(PERMISSION_CODE_SET.has('document:view')).toBe(false);
  });

  it('shows Dashboard to every authenticated user and hides other unauthorized nav', () => {
    expect(getVisibleNavigation([]).map((item) => item.to)).toEqual(['/app/dashboard']);
    expect(
      getVisibleNavigation(['request:view-own', 'approval:view', 'notification:view']).map(
        (item) => item.to,
      ),
    ).toEqual([
      '/app/dashboard',
      '/app/requests/mine',
      '/app/requests/all',
      '/app/approvals',
      '/app/notifications',
    ]);
    expect(NAVIGATION_ITEMS.find((item) => item.to === '/app/requests/new')?.access).toEqual(
      permissionRequirement(['request:create']),
    );
  });

  it('applies all and any permission requirements from the route matrix', () => {
    const mine = getRouteRequirement('/app/requests/mine');
    const allRequests = getRouteRequirement('/app/requests/all');
    expect(satisfiesPermissionRequirement(['request:view-own'], mine)).toBe(true);
    expect(satisfiesPermissionRequirement([], mine)).toBe(false);
    expect(satisfiesPermissionRequirement(['request:view-scope'], allRequests)).toBe(true);
    expect(satisfiesPermissionRequirement(['report:view'], allRequests)).toBe(false);
    expect(hasPermission(['report:view'], 'report:view')).toBe(true);
    expect(hasAnyPermission(['report:view'], ['approval:view', 'report:view'])).toBe(true);
  });

  it('provides breadcrumb metadata for known routes', () => {
    expect(getPageMeta('/app/requests/mine')).toEqual({
      title: 'My Requests',
      breadcrumbs: ['Workspace', 'Requests', 'My Requests'],
    });
  });
});
