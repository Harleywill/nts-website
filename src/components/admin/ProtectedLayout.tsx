'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function ProtectedLayout({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const hasCheckedAuth = useRef(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setIsReady(true);
      return;
    }

    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    const timer = setTimeout(() => {
      try {
        const cookies = document.cookie;
        const hasAuthStatus = cookies.includes('auth-status=');

        if (!hasAuthStatus) {
          router.push('/admin/login');
          return;
        }

        setIsReady(true);
      } catch (error) {
        router.push('/admin/login');
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [router, isLoginPage]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
