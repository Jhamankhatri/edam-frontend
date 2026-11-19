import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      theme="light"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: 'rounded-xl border border-line bg-surface-gradient shadow-layered',
          title: 'text-sm font-semibold text-foreground',
          description: 'text-sm text-muted-foreground',
        },
      }}
    />
  );
}
