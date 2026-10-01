'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { IconType } from 'react-icons';
import { MdDashboard, MdWork, MdArticle, MdFolder, MdMailOutline, MdPeople, MdSettings, MdRateReview, MdPhotoLibrary, MdViewCarousel, MdChevronLeft, MdLogout, MdLock } from 'react-icons/md';

export const RAIL_WIDTH = 256;
export const RAIL_WIDTH_COLLAPSED = 72;

type Role = 'ADMIN' | 'MANAGER' | 'EDITOR' | 'VIEWER';

interface NavItem {
  icon: IconType;
  label: string;
  href: string;
  key: string;
  requiredRole: Role;
}

interface NavSection {
  title: string | null;
  items: NavItem[];
}

// Higher number = more access. A user sees an item when their rank is at
// least the item's required rank. Pages enforce access themselves; this just
// hides links a role can't open.
const ROLE_RANK: Record<Role, number> = { VIEWER: 0, EDITOR: 1, MANAGER: 2, ADMIN: 3 };

const navSections: NavSection[] = [
  {
    title: null,
    items: [
      { icon: MdDashboard, label: 'Dashboard', href: '/admin/dashboard', key: 'dashboard', requiredRole: 'EDITOR' },
    ],
  },
  {
    title: 'Content',
    items: [
      { icon: MdFolder, label: 'Projects', href: '/admin/projects', key: 'projects', requiredRole: 'EDITOR' },
      { icon: MdArticle, label: 'News', href: '/admin/news', key: 'news', requiredRole: 'EDITOR' },
      { icon: MdPhotoLibrary, label: 'Gallery', href: '/admin/gallery', key: 'gallery', requiredRole: 'EDITOR' },
      { icon: MdViewCarousel, label: 'Hero Images', href: '/admin/hero-images', key: 'hero-images', requiredRole: 'EDITOR' },
      { icon: MdRateReview, label: 'Reviews', href: '/admin/reviews', key: 'reviews', requiredRole: 'EDITOR' },
    ],
  },
  {
    title: 'Enquiries',
    items: [
      { icon: MdMailOutline, label: 'Contact', href: '/admin/contact-submissions', key: 'contact', requiredRole: 'MANAGER' },
      { icon: MdWork, label: 'Careers', href: '/admin/careers', key: 'careers', requiredRole: 'MANAGER' },
    ],
  },
  {
    title: 'Admin',
    items: [
      { icon: MdPeople, label: 'Users', href: '/admin/users', key: 'users', requiredRole: 'ADMIN' },
      { icon: MdSettings, label: 'Settings', href: '/admin/settings', key: 'settings', requiredRole: 'ADMIN' },
    ],
  },
];

const NavLink = ({ item, isActive, collapsed }: { item: NavItem; isActive: boolean; collapsed: boolean }) => (
  <Link
    href={item.href}
    title={collapsed ? item.label : undefined}
    aria-label={collapsed ? item.label : undefined}
    className={`w-full h-10 flex items-center gap-3 rounded-lg transition-colors ${collapsed ? 'justify-center px-0' : 'px-3'}`}
    style={{
      background: isActive ? 'rgba(255,255,255,0.14)' : 'transparent',
      color: isActive ? '#ffffff' : 'rgba(255,255,255,0.78)',
    }}
    onMouseEnter={(e) => {
      if (!isActive) {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
        (e.currentTarget as HTMLElement).style.color = '#ffffff';
      }
    }}
    onMouseLeave={(e) => {
      if (!isActive) {
        (e.currentTarget as HTMLElement).style.background = 'transparent';
        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.78)';
      }
    }}
    aria-current={isActive ? 'page' : undefined}
  >
    <item.icon size={18} style={{ flex: 'none' }} />
    {!collapsed && (
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: isActive ? 600 : 500, whiteSpace: 'nowrap' }}>
        {item.label}
      </span>
    )}
  </Link>
);

export function IconRail({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const [user, setUser] = useState<{ username?: string; role?: string } | null>(null);

  // Show the actual logged-in user rather than a hardcoded name.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (!cancelled && data) setUser(data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const displayName = user?.username || 'Account';
  const displayRole = user?.role
    ? user.role.charAt(0) + user.role.slice(1).toLowerCase()
    : '';

  // Until the user loads, show everything rather than flashing a short menu.
  const userRank = user?.role ? ROLE_RANK[user.role as Role] ?? 0 : ROLE_RANK.ADMIN;
  const visibleSections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => userRank >= ROLE_RANK[item.requiredRole]),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <nav
      className="fixed left-0 top-0 h-screen flex flex-col z-30"
      style={{
        width: `${collapsed ? RAIL_WIDTH_COLLAPSED : RAIL_WIDTH}px`,
        background: '#1a2f6e',
        transition: 'width 200ms ease',
      }}
    >
      {/* Collapse toggle — sits on the sidebar's right edge */}
      <button
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute flex items-center justify-center rounded-full"
        style={{
          top: '28px', right: '-14px', width: '28px', height: '28px',
          background: '#ffffff', border: '1px solid var(--border)', color: 'var(--slate-600)',
          boxShadow: '0 1px 3px rgba(15,23,42,0.15)', cursor: 'pointer', zIndex: 1,
        }}
      >
        <MdChevronLeft size={18} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }} />
      </button>

      {/* Brand */}
      <Link
        href="/admin/dashboard"
        className={`flex items-center gap-3 pt-5 pb-4 ${collapsed ? 'justify-center px-0' : 'px-5'}`}
        style={{ textDecoration: 'none' }}
        title={collapsed ? 'NTS Ltd Admin' : undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/favicon.png" alt="" style={{ width: '36px', height: '36px', flex: 'none' }} />
        {!collapsed && (
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px', fontWeight: 700, color: '#ffffff', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
            NTS Ltd Admin
          </span>
        )}
      </Link>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-4">
        {visibleSections.map((section, i) => (
          <div key={section.title ?? `section-${i}`} style={{ marginTop: section.title ? '18px' : '4px' }}>
            {section.title && collapsed && (
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.14)', margin: '0 8px 8px' }} />
            )}
            {section.title && !collapsed && (
              <div
                style={{
                  fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.55)', padding: '0 12px 6px',
                }}
              >
                {section.title}
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <NavLink key={item.key} item={item} isActive={pathname.startsWith(item.href)} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User + sign out */}
      {collapsed ? (
        <div className="flex flex-col items-center gap-2" style={{ padding: '12px 0 18px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <Link
            href="/admin/change-password"
            title="Change password"
            aria-label="Change password"
            className="w-10 h-10 flex items-center justify-center rounded-lg"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            <MdLock size={18} />
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              title={`Sign out (${displayName})`}
              aria-label="Sign out"
              className="w-10 h-10 flex items-center justify-center rounded-lg"
              style={{ border: '1px solid rgba(255,255,255,0.35)', background: 'transparent', color: '#ffffff', cursor: 'pointer' }}
            >
              <MdLogout size={18} />
            </button>
          </form>
        </div>
      ) : (
        <div style={{ padding: '14px 16px 18px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
            <span
              style={{
                fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.85)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}
            >
              {displayName}{displayRole && <span style={{ color: 'rgba(255,255,255,0.55)' }}> · {displayRole}</span>}
            </span>
            <Link
              href="/admin/change-password"
              style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}
            >
              Change password
            </Link>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full h-9 rounded-lg transition-colors"
              style={{
                border: '1px solid rgba(255,255,255,0.35)', background: 'transparent', color: '#ffffff',
                fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              Sign out
            </button>
          </form>
        </div>
      )}
    </nav>
  );
}
