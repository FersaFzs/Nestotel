import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface UseAdminGuardOptions {
  redirectTo?: string;
  requiredRole?: 'admin' | 'super_admin';
  requiredPermissions?: string[];
}

interface UserData {
  _id: string;
  firebaseUid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'user' | 'admin' | 'super_admin';
  permissions: string[];
  isActive: boolean;
}

export function useAdminGuard(options: UseAdminGuardOptions = {}) {
  const { redirectTo = '/login', requiredRole = 'admin', requiredPermissions = [] } = options;
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      checkUserPermissions();
    } else if (!loading && !user) {
      router.push(redirectTo);
      setIsLoading(false);
    }
  }, [user, loading]);

  const checkUserPermissions = async () => {
    if (!user) return;

    try {
      // Verificar si es el super admin por email
      const userEmail = user.email;
      const isSuperAdmin = userEmail === 'fersafzs04@gmail.com';

      if (isSuperAdmin) {
        // Crear datos temporales del super admin
        const tempUserData: UserData = {
          _id: 'temp-super-admin-id',
          firebaseUid: user.uid,
          email: userEmail!,
          firstName: 'Fersa',
          lastName: 'Admin',
          role: 'super_admin',
          permissions: ['all'],
          isActive: true,
        };

        setUserData(tempUserData);
        setHasAccess(true);
        setIsLoading(false);
        return;
      }

      // Para otros usuarios, intentar verificar con la API
      const response = await fetch(`/api/users/me`, {
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUserData(userData);

        // Verificar rol
        const hasRequiredRole =
          userData.role === requiredRole ||
          (requiredRole === 'admin' && userData.role === 'super_admin');

        // Verificar permisos
        const hasRequiredPermissions =
          requiredPermissions.length === 0 ||
          requiredPermissions.every(permission => userData.permissions.includes(permission));

        const access = hasRequiredRole && hasRequiredPermissions && userData.isActive;
        setHasAccess(access);

        if (!access) {
          router.push('/unauthorized');
        }
      } else {
        // Usuario no existe en la base de datos o no tiene permisos
        router.push('/unauthorized');
      }
    } catch (error) {
      // Error checking user permissions - silent in production
      router.push('/unauthorized');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user: userData,
    loading: isLoading,
    hasAccess,
    isAuthenticated: !!user,
  };
}
