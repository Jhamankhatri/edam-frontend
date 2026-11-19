import { Link } from '@tanstack/react-router';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useVisibleNavigation } from '@/hooks/usePermissions';
import type { ShellBadges } from '@/hooks/useShellBadges';
import { formatBadgeCount, cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { BrandMark } from '@/components/brand/BrandMark';

interface SidebarProps {
  collapsed?: boolean;
  badges: ShellBadges;
  onToggle?: () => void;
  onNavigate?: () => void;
}

export function Sidebar({
  collapsed = false,
  badges,
  onToggle,
  onNavigate,
}: SidebarProps) {
  const items = useVisibleNavigation();

  const badgeValue = (kind?: 'approvals' | 'notifications'): string | null => {
    if (!kind) return null;
    const value = kind === 'approvals' ? badges.approvalCount : badges.notificationCount;
    return formatBadgeCount(value);
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col border-r border-line-accent bg-brand-gradient text-on-brand">
      <div className={cn(
        'flex h-20 shrink-0 items-center border-b border-line-on-brand px-5',
        collapsed ? 'justify-center' : 'justify-between',
      )}>
        <Link to="/app/dashboard" className="flex min-h-11 min-w-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold" onClick={onNavigate}>
          <BrandMark compact={collapsed} />
        </Link>
        {onToggle && !collapsed && (
          <Button variant="ghost" size="icon" className="text-on-brand hover:bg-brand-panel-hover" onClick={onToggle} aria-label="Collapse sidebar">
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      <nav aria-label="Primary navigation" className="scrollbar-subtle min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 py-6">
        {!collapsed && (
          <p className="mb-4 font-numeric text-2xs uppercase tracking-eyebrow-wide text-on-brand-faint">
            Workspace register
          </p>
        )}
        <ol>
          {items.map((item, index) => {
            const number = String(index + 1).padStart(2, '0');
            const badge = badgeValue(item.badge);
            const link = (
              <Link
                to={item.to}
                onClick={onNavigate}
                className={cn(
                  'group relative flex min-h-11 items-center border-b border-line-on-brand text-sm font-medium text-on-brand-muted transition-colors duration-150 hover:bg-brand-panel-hover hover:text-on-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold',
                  'aria-[current=page]:bg-brand-panel-active aria-[current=page]:text-on-brand',
                  'before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.5 before:-translate-y-1/2 before:bg-accent-warm before:opacity-0 aria-[current=page]:before:opacity-100',
                  collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-2 py-3',
                )}
                activeProps={{ className: 'bg-brand-panel-active text-on-brand' }}
                aria-label={item.label}
              >
                <span aria-hidden="true" className="w-6 shrink-0 font-numeric text-2xs font-semibold text-accent-warm">{number}</span>
                {!collapsed && (
                  <>
                    <item.icon aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {badge && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-pill border border-line-accent px-1.5 font-numeric text-2xs font-bold text-on-brand">
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
        </ol>
      </nav>

      <div className="shrink-0 border-t border-line-on-brand px-5 py-4">
        {collapsed && onToggle ? (
          <Button variant="ghost" size="icon" className="w-full text-on-brand hover:bg-brand-panel-hover" onClick={onToggle} aria-label="Expand sidebar">
            <ChevronsRight className="h-4 w-4" />
          </Button>
        ) : (
          <div>
            <p className="font-numeric text-2xs uppercase tracking-eyebrow-wide text-on-brand-faint">Institution workspace</p>
            <p className="mt-2 text-xs leading-relaxed text-on-brand-muted">
              Access is determined by your effective permissions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
