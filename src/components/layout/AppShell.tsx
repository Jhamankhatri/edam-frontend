import { useState, type ReactNode } from 'react';
import { useShellBadges } from '@/hooks/useShellBadges';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  // One observer per shell: Sidebar, mobile drawer and Topbar share these values
  // instead of each subscribing to the same React Query keys.
  const badges = useShellBadges();

  return (
    <div className="flex min-h-screen w-full max-w-full overflow-x-hidden bg-background">
      <aside className={cn('hidden shrink-0 transition-all duration-200 lg:block', collapsed ? 'w-20' : 'w-72')}>
        <div className={cn('fixed inset-y-0 left-0 z-40', collapsed ? 'w-20' : 'w-72')}>
          <Sidebar
            collapsed={collapsed}
            badges={badges}
            onToggle={() => setCollapsed((value) => !value)}
          />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar badges={badges} />
        <main className="min-w-0 flex-1 px-3 py-5 sm:px-5 lg:px-7 xl:px-9">
          <div className="mx-auto w-full max-w-shell">{children}</div>
        </main>
      </div>
    </div>
  );
}
