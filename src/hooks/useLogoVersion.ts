'use client';

import { useState, useEffect } from 'react';

const CACHE_KEY = 'nts_logo_version';

export function useLogoVersion() {
  const [logoVersion, setLogoVersion] = useState<'old' | 'new'>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached === 'old' || cached === 'new') return cached;
    }
    // Default matches the live setting (logoVersion 2 = old) so the server
    // renders the correct logo, avoiding a first-paint flash and the stale
    // preload warning. The effect below still syncs to whatever the DB says.
    return 'old';
  });

  useEffect(() => {
    const fetchLogoVersion = async () => {
      try {
        const res = await fetch(`/api/settings?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          const logoV = (data.settings ?? data).logoVersion;
          const version: 'old' | 'new' = logoV === 2 ? 'old' : 'new';
          setLogoVersion(version);
          localStorage.setItem(CACHE_KEY, version);
        }
      } catch (error) {
        console.error('Failed to fetch logo version:', error);
      }
    };

    fetchLogoVersion();

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
