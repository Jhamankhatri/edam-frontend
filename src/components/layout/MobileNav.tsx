import { useState } from 'react';
import { Menu } from 'lucide-react';
import type { ShellBadges } from '@/hooks/useShellBadges';
import { useBranding } from '@/hooks/useBranding';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Sidebar } from './Sidebar';

export function MobileNav({ badges }: { badges: ShellBadges }) {
  const [open, setOpen] = useState(false);
  const branding = useBranding();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle className="px-5 pb-1 pt-5 font-display text-2xl font-semibold tracking-display">{branding.appName}</DrawerTitle>
        <DrawerDescription className="px-5 pb-4 font-numeric text-2xs uppercase tracking-eyebrow-wide text-on-brand-muted">
          Workspace register
        </DrawerDescription>
        <div className="min-h-0 flex-1">
          <Sidebar badges={badges} onNavigate={() => setOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
