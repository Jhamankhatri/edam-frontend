import { Link } from '@tanstack/react-router';
import { ChevronsLeft, ChevronsRight, Landmark } from 'lucide-react';
import { useVisibleNavigation } from '@/hooks/usePermissions';
import { useShellBadges } from '@/hooks/useShellBadges';
import { useBranding } from '@/hooks/useBranding';
import { formatBadgeCount, cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
  compactHeader?: boolean;
}

export function Sidebar({
  collapsed = false,
  onToggle,
  onNavigate,
  compactHeader = false,
}: SidebarProps) {
  const items = useVisibleNavigation();
  const badges = useShellBadges();
  const branding = useBranding();

  const badgeValue = (kind?: 'approvals' | 'notifications'): string | null => {
    if (!kind) return null;
    const value = kind === 'approvals' ? badges.approvalCount : badges.notificationCount;
    return formatBadgeCount(value);
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-brand-navy text-white">
      <div className={cn('flex h-16 shrink-0 items-center border-b border-white/10 px-4', collapsed ? 'justify-center' : 'justify-between')}>
        <Link to="/app/dashboard" className="flex min-h-11 min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold" onClick={onNavigate}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-gold text-brand-ink">
            <Landmark aria-hidden="true" className="h-5 w-5" />
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate font-display text-lg font-semibold leading-tight">{branding.appName}</span>
              <span className="block truncate text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/[0.55]">
                {compactHeader ? 'Workspace' : 'Expense Governance'}
              </span>
            </span>
          )}
        </Link>
        {onToggle && !collapsed && (
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={onToggle} aria-label="Collapse sidebar">
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      <nav aria-label="Primary navigation" className="scrollbar-subtle min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-5">
        {!collapsed && (
          <p className="mb-3 px-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/[0.45]">
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
                  'group flex min-h-11 items-center rounded-xl text-sm font-medium text-white/[0.75] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold',
                  collapsed ? 'justify-center px-2' : 'gap-3 px-3',
                )}
                activeProps={{ className: 'bg-white/[0.12] text-white shadow-inset' }}
                aria-label={collapsed ? item.label : undefined}
              >
                <item.icon aria-hidden="true" className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                {!collapsed && (
                  <>
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {badge && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-gold px-1.5 text-[0.65rem] font-bold text-brand-ink">
                        {badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && badge && <span aria-hidden="true" className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-gold" />}
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

      <div className="shrink-0 border-t border-white/10 p-3">
        {collapsed && onToggle ? (
          <Button variant="ghost" size="icon" className="w-full text-white hover:bg-white/10" onClick={onToggle} aria-label="Expand sidebar">
            <ChevronsRight className="h-4 w-4" />
          </Button>
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs font-semibold">Institution workspace</p>
            <p className="mt-1 text-xs leading-relaxed text-white/60">
              Access is determined by your effective permissions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
