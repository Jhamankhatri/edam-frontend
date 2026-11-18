import { Link } from '@tanstack/react-router';
import { Compass, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function NotFound() {
  return (
    <main className="auth-canvas flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl rounded-2xl">
        <CardHeader className="gap-4 p-6 sm:p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-info">
            <Compass aria-hidden="true" className="h-6 w-6" />
          </span>
          <div>
            <CardTitle className="font-display text-2xl">Page not found</CardTitle>
            <CardDescription className="mt-2 leading-relaxed">
              The requested EDAM page does not exist, or the link is no longer valid.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0 sm:p-8 sm:pt-0">
          <Button asChild>
            <Link to="/app/dashboard">
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Go to workspace
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
