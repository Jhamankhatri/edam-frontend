import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Sidebar } from './Sidebar';

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle className="px-5 pb-1 pt-5 font-display text-xl font-semibold">EDAM</DrawerTitle>
        <DrawerDescription className="px-5 pb-4 text-xs text-white/60">
          Permission-aware navigation
        </DrawerDescription>
        <div className="min-h-0 flex-1">
          <Sidebar compactHeader onNavigate={() => setOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
