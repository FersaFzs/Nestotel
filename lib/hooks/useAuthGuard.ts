import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface UseAuthGuardOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { redirectTo = '/login', requireAuth = true } = options;
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Redirect to login if auth is required but user is not logged in
        router.push(redirectTo);
      } else if (!requireAuth && user) {
        // Redirect to home if user is logged in but shouldn't be (e.g., login page)
        router.push('/');
      }
    }
  }, [user, loading, router, redirectTo, requireAuth]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isLoading: loading,
  };
}
