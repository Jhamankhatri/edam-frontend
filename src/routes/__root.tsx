import { createRootRoute, Outlet } from '@tanstack/react-router';
import { AuthExpiredRedirector } from '@/components/auth/AuthExpiredRedirector';
import { NotFound } from '@/components/feedback/NotFound';
import { Toaster } from '@/components/ui/toaster';

function RootLayout() {
  return (
    <>
      <AuthExpiredRedirector />
      <Outlet />
      <Toaster />
    </>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});
