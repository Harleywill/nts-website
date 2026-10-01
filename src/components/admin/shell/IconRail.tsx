'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { IconType } from 'react-icons';
import { MdDashboard, MdWork, MdArticle, MdFolder, MdMailOutline, MdPeople, MdSettings, MdRateReview, MdPhotoLibrary, MdViewCarousel } from 'react-icons/md';

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

const NavLink = ({ item, isActive }: { item: NavItem; isActive: boolean }) => (
  <Link
    href={item.href}
    className="w-full h-10 flex items-center gap-3 px-3 rounded-lg transition-colors"
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
    <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: isActive ? 600 : 500 }}>
      {item.label}
    </span>
  </Link>
);

export function IconRail() {
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
      className="fixed left-0 top-0 h-screen w-64 flex flex-col"
      style={{ background: '#1a2f6e' }}
    >
      {/* Brand */}
      <Link
        href="/admin/dashboard"
        className="flex items-center gap-3 px-5 pt-5 pb-4"
        style={{ textDecoration: 'none' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/favicon.png" alt="" style={{ width: '36px', height: '36px', flex: 'none' }} />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
          NTS Ltd Admin
        </span>
      </Link>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {visibleSections.map((section, i) => (
          <div key={section.title ?? `section-${i}`} style={{ marginTop: section.title ? '18px' : '4px' }}>
            {section.title && (
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
                <NavLink key={item.key} item={item} isActive={pathname.startsWith(item.href)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User + sign out */}
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
    </nav>
  );
}
