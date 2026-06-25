'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { MdDashboard, MdWork, MdArticle, MdFolder, MdMailOutline, MdPeople, MdSettings, MdLogout, MdRateReview, MdLock, MdPhotoLibrary } from 'react-icons/md';

const mainNavItems = [
  { icon: MdDashboard, label: 'Dashboard', href: '/admin/dashboard', key: 'dashboard', requiredRole: 'EDITOR' as const },
  { icon: MdWork, label: 'Careers', href: '/admin/careers', key: 'careers', requiredRole: 'MANAGER' as const },
  { icon: MdFolder, label: 'Projects', href: '/admin/projects', key: 'projects', requiredRole: 'EDITOR' as const },
  { icon: MdPhotoLibrary, label: 'Gallery', href: '/admin/gallery', key: 'gallery', requiredRole: 'EDITOR' as const },
  { icon: MdArticle, label: 'News', href: '/admin/news', key: 'news', requiredRole: 'EDITOR' as const },
  { icon: MdRateReview, label: 'Reviews', href: '/admin/reviews', key: 'reviews', requiredRole: 'EDITOR' as const },
  { icon: MdMailOutline, label: 'Contact', href: '/admin/contact-submissions', key: 'contact', requiredRole: 'MANAGER' as const },
  { icon: MdPeople, label: 'Users', href: '/admin/users', key: 'users', requiredRole: 'ADMIN' as const },
];

const bottomNavItems = [
  { icon: MdSettings, label: 'Settings', href: '/admin/settings', key: 'settings', requiredRole: 'ADMIN' as const },
];

const NavLink = ({ item, isActive }: { item: any; isActive: boolean }) => (
  <Link
    href={item.href}
    className="relative w-full h-12 flex items-center gap-3 px-3 rounded-lg transition-all"
    style={{
      background: isActive ? 'var(--navy-700)' : 'transparent',
      color: isActive ? 'var(--green-600)' : 'rgba(255,255,255,0.7)',
    }}
    onMouseEnter={(e) => {
      if (!isActive) {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
        (e.currentTarget as HTMLElement).style.color = '#ffffff';
      }
    }}
    onMouseLeave={(e) => {
      if (!isActive) {
        (e.currentTarget as HTMLElement).style.background = 'transparent';
        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)';
      }
    }}
    title={item.label}
  >
    {isActive && (
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-600 rounded-r" style={{ background: 'var(--green-600)' }} />
    )}
    <item.icon size={20} />
    <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500 }}>
      {item.label}
    </span>
  </Link>
);

export function IconRail() {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav
      className="fixed left-0 top-0 h-screen w-64 flex flex-col py-4 px-4"
      style={{ background: 'var(--navy-950)', borderRight: '1px solid var(--border)' }}
    >
      {/* Main Nav Items */}
      <div className="flex-1 flex flex-col w-full gap-1">
        {mainNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return <NavLink key={item.key} item={item} isActive={isActive} />;
        })}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '12px 0' }} />

      {/* Bottom Nav Items (Settings) */}
      <div className="flex flex-col w-full gap-1 mb-4">
        {bottomNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return <NavLink key={item.key} item={item} isActive={isActive} />;
        })}
      </div>

      {/* User Profile Section */}
      <div
        style={{
          padding: '12px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          position: 'relative',
        }}
      >
        {/* User Info Button */}
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
          onMouseEnter={(e) => {
            if (!showUserMenu) {
              (e.currentTarget as HTMLElement).style.opacity = '0.8';
            }
          }}
          onMouseLeave={(e) => {
            if (!showUserMenu) {
              (e.currentTarget as HTMLElement).style.opacity = '1';
            }
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--green-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: '16px',
              flex: 'none',
            }}
          >
            A
          </div>
          <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 600,
                color: '#ffffff',
                margin: 0,
              }}
            >
              Admin
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.6)',
                margin: '2px 0 0 0',
              }}
            >
              Manager
            </div>
          </div>
        </button>

        {/* Dropdown Menu */}
        {showUserMenu && (
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '12px',
              right: '12px',
              marginBottom: '8px',
              background: 'var(--navy-800)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              zIndex: 1000,
              overflow: 'hidden',
            }}
          >
            {/* Change Password Button */}
            <button
              onClick={() => {
                setShowUserMenu(false);
                // Navigate to change password or open modal
                window.location.href = '/admin/change-password';
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 14px',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.9)',
                textAlign: 'left',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <MdLock size={16} />
              Change Password
            </button>

            {/* Logout Button */}
            <form action="/api/auth/logout" method="POST" style={{ width: '100%' }}>
              <button
                type="submit"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 14px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#ff6b6b',
                  textAlign: 'left',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255, 107, 107, 0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <MdLogout size={16} />
                Logout
              </button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}
