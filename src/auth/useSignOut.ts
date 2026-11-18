import { useCallback, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from './useAuth';

/**
 * Centralizes the one sign-out transition used by the account menu and the
 * access-denied fallback. Navigation happens even when the backend logout
 * fails, because local session state is always cleared by AuthProvider.
 */
export function useSignOut(): {
  signOut: () => Promise<void>;
  signingOut: boolean;
} {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  const signOut = useCallback(async (): Promise<void> => {
    setSigningOut(true);
    try {
      await logout();
    } finally {
      await navigate({ to: '/login', replace: true });
      setSigningOut(false);
    }
  }, [logout, navigate]);

  return { signOut, signingOut };
}
