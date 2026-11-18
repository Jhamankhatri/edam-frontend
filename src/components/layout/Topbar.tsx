import { Link, useRouterState } from '@tanstack/react-router';
import { Bell } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { getPageMeta } from '@/config/route-access';
import { useHasPermission } from '@/hooks/usePermissions';
import type { ShellBadges } from '@/hooks/useShellBadges';
import { formatBadgeCount } from '@/lib/utils';
import { Breadcrumbs } from './Breadcrumbs';
import { MobileNav } from './MobileNav';
import { UserMenu } from './UserMenu';

export function Topbar({ badges }: { badges: ShellBadges }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const meta = getPageMeta(pathname);
  const canViewNotifications = useHasPermission('notification:view');
  const badge = formatBadgeCount(badges.notificationCount);

  return (
    <TooltipProvider delayDuration={200}>
      <header className="sticky top-0 z-30 flex h-16 w-full max-w-full items-center gap-2 border-b border-line bg-topbar px-3 shadow-soft sm:gap-4 sm:px-5">
        <MobileNav badges={badges} />
        <div className="min-w-0 flex-1">
          <Breadcrumbs meta={meta} className="hidden sm:block" />
          <h2 className="truncate text-sm font-semibold sm:hidden">{meta.title}</h2>
          <h2 className="mt-0.5 hidden truncate text-lg font-semibold sm:block">{meta.title}</h2>
        </div>

        {canViewNotifications && (
          <Link
            to="/app/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-muted-foreground shadow-soft transition-colors duration-150 hover:bg-state-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={badge ? `Notifications, ${badge} unread` : 'Notifications'}
          >
            <Bell aria-hidden="true" className="h-4.5 w-4.5" />
            {badge && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-2xs font-bold text-destructive-foreground">
                {badge}
              </span>
            )}
          </Link>
        )}
        <UserMenu />
      </header>
    </TooltipProvider>
  );
}
