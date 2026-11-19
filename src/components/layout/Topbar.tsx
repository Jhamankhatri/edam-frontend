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
      <header className="sticky top-0 z-30 flex h-20 w-full max-w-full items-center gap-2 border-b border-line bg-topbar px-3 sm:gap-4 sm:px-5 lg:px-7">
        <MobileNav badges={badges} />
        <div className="min-w-0 flex-1">
          <Breadcrumbs meta={meta} className="hidden sm:block" />
          <h2 className="truncate font-display text-lg font-semibold tracking-display sm:hidden">{meta.title}</h2>
          <h2 className="mt-1 hidden truncate font-display text-xl font-semibold tracking-display sm:block">{meta.title}</h2>
        </div>

        {canViewNotifications && (
          <Link
            to="/app/notifications"
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-muted-foreground transition-colors duration-150 hover:border-line-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={badge ? `Notifications, ${badge} unread` : 'Notifications'}
          >
            <Bell aria-hidden="true" className="h-4 w-4" />
            {badge && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-pill border border-line-accent bg-surface px-1 font-numeric text-2xs font-bold text-foreground">
                {badge}
              </span>
            )}
          </Link>
        )}
        <UserMenu />
      </header>
      <div aria-hidden="true" className="h-px w-full bg-gradient-to-r from-line-accent via-line to-transparent" />
    </TooltipProvider>
  );
}
