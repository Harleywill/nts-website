'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function ProtectedLayout({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setIsReady(true);
      return;
    }

    let cancelled = false;
    setIsReady(false);

    // Verify the actual session with the server rather than trusting a
    // client-readable cookie. /api/auth/me validates the real token, so a
    // stale, forged, or absent session all correctly send the user to login.
    fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' })
      .then((res) => {
        if (cancelled) return;
        if (res.ok) {
          setIsReady(true);
        } else {
          router.replace('/admin/login');
        }
      })
      .catch(() => {
        if (!cancelled) router.replace('/admin/login');
      });

    return () => {
      cancelled = true;
    };
  }, [router, isLoginPage, pathname]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
