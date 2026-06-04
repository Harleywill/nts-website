'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CommandPalette } from '@/components/admin/palette/CommandPalette';
import { NotificationPanel } from '@/components/admin/NotificationPanel';

export function TopBar() {
  const [logoVersion, setLogoVersion] = useState<'old' | 'new'>('new');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch current logo version on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          setLogoVersion(data.logoVersion || 'new');
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };

    fetchSettings();
  }, []);

  // Toggle logo version
  const toggleLogo = async () => {
    const newVersion = logoVersion === 'old' ? 'new' : 'old';
    setLoading(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logoVersion: newVersion }),
      });

      if (res.ok) {
        setLogoVersion(newVersion);
        router.refresh();
      } else {
        alert('Failed to update logo version');
      }
    } catch (error) {
      console.error('Error updating logo:', error);
      alert('Error updating logo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="h-14 bg-adm-app border-b border-adm-border flex items-center px-6 gap-4">
      {/* Command Palette Search */}
      <CommandPalette />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Logo Toggle Button */}
      <button
        onClick={toggleLogo}
        disabled={loading}
        className="px-3 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title={`Current logo: ${logoVersion}`}
      >
        Logo: {logoVersion === 'old' ? 'Old' : 'New'}
      </button>

      {/* Notifications */}
      <NotificationPanel />
    </header>
  );
}
