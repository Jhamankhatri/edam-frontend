import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { AuthProvider } from '@/auth/AuthProvider';
import { queryClient } from '@/app/query-client';
import { router } from '@/router';
import '@/styles/index.css';

const container = document.getElementById('root');
if (!container) throw new Error('EDAM root element is missing.');

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
