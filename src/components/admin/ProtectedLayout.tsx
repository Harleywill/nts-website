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
  const isChangePasswordPage = pathname === '/admin/change-password';

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
      .then(async (res) => {
        if (cancelled) return;
        if (!res.ok) {
          router.replace('/admin/login');
          return;
        }
        const data = await res.json();
        // New/reset accounts start with passwordChanged: false — force them
        // through the change-password page before anything else in the
        // admin is reachable, until they set their own password.
        if (!data.passwordChanged && !isChangePasswordPage) {
          router.replace('/admin/change-password');
          return;
        }
        setIsReady(true);
      })
      .catch(() => {
        if (!cancelled) router.replace('/admin/login');
      });

    return () => {
      cancelled = true;
    };
  }, [router, isLoginPage, isChangePasswordPage, pathname]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
