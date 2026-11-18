import { Link } from '@tanstack/react-router';
import { ChevronsLeft, ChevronsRight, Landmark } from 'lucide-react';
import { useVisibleNavigation } from '@/hooks/usePermissions';
import type { ShellBadges } from '@/hooks/useShellBadges';
import { useBranding } from '@/hooks/useBranding';
import { formatBadgeCount, cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Surface } from '@/components/ui/surface';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  collapsed?: boolean;
  badges: ShellBadges;
  onToggle?: () => void;
  onNavigate?: () => void;
  compactHeader?: boolean;
}

export function Sidebar({
  collapsed = false,
  badges,
  onToggle,
  onNavigate,
  compactHeader = false,
}: SidebarProps) {
  const items = useVisibleNavigation();
  const branding = useBranding();

  const badgeValue = (kind?: 'approvals' | 'notifications'): string | null => {
    if (!kind) return null;
    const value = kind === 'approvals' ? badges.approvalCount : badges.notificationCount;
    return formatBadgeCount(value);
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-brand-gradient text-on-brand">
      <div className={cn(
        'flex h-16 shrink-0 items-center border-b border-brand-panel-border bg-brand-panel-subtle px-4',
        collapsed ? 'justify-center' : 'justify-between',
      )}>
        <Link to="/app/dashboard" className="flex min-h-11 min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold" onClick={onNavigate}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-warm text-accent-warm-foreground shadow-inset">
            <Landmark aria-hidden="true" className="h-5 w-5" />
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate font-display text-lg font-semibold leading-tight">{branding.appName}</span>
              <span className="block truncate micro-label text-on-brand-quiet">
                {compactHeader ? 'Workspace' : 'Expense Governance'}
              </span>
            </span>
          )}
        </Link>
        {onToggle && !collapsed && (
          <Button variant="ghost" size="icon" className="text-on-brand hover:bg-brand-panel-hover" onClick={onToggle} aria-label="Collapse sidebar">
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      <nav aria-label="Primary navigation" className="scrollbar-subtle min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-5">
        {!collapsed && (
          <p className="mb-3 px-2 badge-label text-on-brand-faint">
            Workspace
          </p>
        )}
        <ul className="space-y-1.5">
          {items.map((item) => {
            const badge = badgeValue(item.badge);
            const link = (
              <Link
                to={item.to}
                onClick={onNavigate}
                className={cn(
                  'group relative flex min-h-11 items-center rounded-xl text-sm font-medium text-on-brand-muted transition-colors duration-150 hover:bg-brand-panel-hover hover:text-on-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold',
                  'aria-[current=page]:bg-brand-panel-active aria-[current=page]:text-on-brand aria-[current=page]:shadow-inset',
                  'before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.5 before:-translate-y-1/2 before:rounded-pill before:bg-accent-warm before:opacity-0 aria-[current=page]:before:opacity-100',
                  collapsed ? 'justify-center px-2' : 'gap-3 px-3',
                )}
                activeProps={{ className: 'bg-brand-panel-active text-on-brand shadow-inset' }}
                aria-label={collapsed ? item.label : undefined}
              >
                <item.icon aria-hidden="true" className="h-4.5 w-4.5 shrink-0" strokeWidth={2} />
                {!collapsed && (
                  <>
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {badge && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-pill bg-accent-warm px-1.5 text-2xs font-bold text-accent-warm-foreground">
                        {badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && badge && <span aria-hidden="true" className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent-warm" />}
              </Link>
            );
            return (
              <li key={item.to} className="relative">
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ) : (
                  link
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-brand-panel-border p-3">
        {collapsed && onToggle ? (
          <Button variant="ghost" size="icon" className="w-full text-on-brand hover:bg-brand-panel-hover" onClick={onToggle} aria-label="Expand sidebar">
            <ChevronsRight className="h-4 w-4" />
          </Button>
        ) : (
          <Surface variant="brand" padding="sm" className="shadow-inset">
            <p className="text-xs font-semibold">Institution workspace</p>
            <p className="mt-1 text-xs leading-relaxed text-on-brand-muted">
              Access is determined by your effective permissions.
            </p>
          </Surface>
        )}
      </div>
    </div>
  );
}
