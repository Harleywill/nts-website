'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedLayout({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    // Only run this check once
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    // Give the DOM a moment to be fully ready
    const timer = setTimeout(() => {
      try {
        // Check if auth status cookie exists (accessible from client-side)
        const cookies = document.cookie;
        const hasAuthStatus = cookies.includes('auth-status=');

        if (!hasAuthStatus) {
          // No auth status found, redirect to login
          router.push('/admin/login');
          return;
        }

        // User is authenticated - ready to display
        setIsReady(true);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/admin/login');
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [router]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
