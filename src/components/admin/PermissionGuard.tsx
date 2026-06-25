'use client';

import { useEffect, useState } from 'react';
import type { UserRole } from '@/lib/admin/permissions';

interface PermissionGuardProps {
  requiredRole?: UserRole;
  requiredAction?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function PermissionGuard({
  requiredRole,
  requiredAction,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const [userRole, setUserRole] = useState<UserRole>('VIEWER' as const as UserRole);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          const role: UserRole = (data.role as UserRole) || ('VIEWER' as const);
          setUserRole(role);
        } else {
          setUserRole('VIEWER' as const);
        }
      } catch (err) {
        console.error('Failed to fetch user role:', err);
        setUserRole('VIEWER' as const);
      } finally {
        setLoading(false);
      }
    };
    fetchUserRole();
  }, []);

  if (requiredRole && userRole !== requiredRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
