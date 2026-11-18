import type { PermissionCode } from './permission-codes';

export type { PermissionCode };

export interface PermissionRequirement {
  mode: 'all' | 'any';
  codes: readonly PermissionCode[];
}

export function hasPermission(
  permissions: readonly string[] | undefined,
  code: PermissionCode,
): boolean {
  return Boolean(permissions?.includes(code));
}

export function hasAnyPermission(
  permissions: readonly string[] | undefined,
  codes: readonly PermissionCode[],
): boolean {
  return codes.some((code) => hasPermission(permissions, code));
}

export function satisfiesPermissionRequirement(
  permissions: readonly string[] | undefined,
  requirement: PermissionRequirement | null,
): boolean {
  if (!requirement) return true;
  if (requirement.codes.length === 0) return true;
  return requirement.mode === 'all'
    ? requirement.codes.every((code) => hasPermission(permissions, code))
    : hasAnyPermission(permissions, requirement.codes);
}

export function permissionRequirement(
  codes: readonly PermissionCode[],
  mode: 'all' | 'any' = 'all',
): PermissionRequirement {
  return { mode, codes };
}
