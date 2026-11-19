import { ChevronDown, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/auth/useAuth';
import { useSignOut } from '@/auth/useSignOut';
import { formatApiError } from '@/api/errors';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { initials } from '@/lib/utils';

export function UserMenu() {
  const { user } = useAuth();
  const { signOut, signingOut } = useSignOut();

  if (!user) return null;

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut();
      toast.success('Signed out securely');
    } catch (error) {
      toast.error(formatApiError(error));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-11 gap-2 rounded-md px-2 sm:px-3" aria-label="Open account menu">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line-accent bg-surface-subtle font-display text-sm font-semibold text-brand-ink">
            {initials(user.displayName)}
          </span>
          <span className="hidden min-w-0 text-left md:block">
            <span className="block max-w-36 truncate text-sm font-semibold leading-tight">{user.displayName}</span>
            <span className="block max-w-36 truncate font-numeric text-2xs text-muted-foreground">{user.email}</span>
          </span>
          <ChevronDown aria-hidden="true" className="hidden h-4 w-4 opacity-60 md:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Signed in</DropdownMenuLabel>
        <div className="px-3 pb-2">
          <p className="truncate text-sm font-semibold">{user.displayName}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          {user.designation && <p className="mt-1 truncate text-xs text-muted-foreground">{user.designation}</p>}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={signingOut}
          onSelect={(event) => {
            event.preventDefault();
            void handleSignOut();
          }}
          className="text-destructive focus:text-destructive"
        >
          <LogOut aria-hidden="true" className="h-4 w-4" />
          {signingOut ? 'Signing out…' : 'Sign out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
