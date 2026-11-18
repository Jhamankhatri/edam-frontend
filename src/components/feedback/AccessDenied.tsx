import { Link } from '@tanstack/react-router';
import { ArrowLeft, LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/auth/useAuth';
import { useSignOut } from '@/auth/useSignOut';
import { NAVIGATION_ITEMS } from '@/config/navigation';
import { getRouteRequirement } from '@/config/route-access';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function AccessDenied() {
  const { satisfiesRequirement } = useAuth();
  const { signOut } = useSignOut();
  const destination = NAVIGATION_ITEMS.find(
    (item) => item.to !== '/app/dashboard' && satisfiesRequirement(getRouteRequirement(item.to)),
  )?.to;

  return (
    <section className="mx-auto flex w-full max-w-2xl items-center justify-center py-8 sm:py-14">
      <Card className="overflow-hidden rounded-2xl">
        <div className="h-1.5 w-full bg-brand-gold" aria-hidden="true" />
        <CardHeader className="gap-4 p-6 sm:p-8">
          <span className="feedback-icon bg-status-warning-surface text-warning">
            <ShieldAlert aria-hidden="true" className="h-6 w-6" />
          </span>
          <div>
            <CardTitle className="font-display text-2xl">Access denied</CardTitle>
            <CardDescription className="mt-2 leading-relaxed">
              Your account does not have the permission required for this area. The backend remains the
              authority for every protected operation.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0 sm:p-8 sm:pt-0">
          {destination ? (
            <Button asChild variant="outline">
              <Link to={destination}>
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                Return to an available workspace
              </Link>
            </Button>
          ) : (
            <Button variant="outline" onClick={() => void signOut().catch(() => undefined)}>
              <LogOut aria-hidden="true" className="h-4 w-4" />
              Sign out and return to sign in
            </Button>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
