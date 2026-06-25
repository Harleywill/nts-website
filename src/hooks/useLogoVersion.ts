'use client';

import { useState, useEffect } from 'react';

export function useLogoVersion() {
  const [logoVersion, setLogoVersion] = useState<'old' | 'new'>('new');

  useEffect(() => {
    const fetchLogoVersion = async () => {
      try {
        const res = await fetch(`/api/settings?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          const logoV = (data.settings ?? data).logoVersion;
          const version = logoV === 1 ? 'old' : 'new';
          setLogoVersion(version);
        }
      } catch (error) {
        console.error('Failed to fetch logo version:', error);
      }
    };

    fetchLogoVersion();

    // Refetch when page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchLogoVersion();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return logoVersion;
}
