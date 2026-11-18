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
          toast: 'rounded-xl border border-border shadow-elevated',
          title: 'text-sm font-semibold',
          description: 'text-sm',
        },
      }}
    />
  );
}
