'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdDashboard, MdWork, MdArticle, MdFolder, MdMailOutline, MdPeople, MdSettings, MdLogout } from 'react-icons/md';

// Navigation items with optional permission requirements
// TODO: Wire up userRole from auth cookie to filter visibility
const navItems = [
  { icon: MdDashboard, label: 'Dashboard', href: '/admin/dashboard', key: 'dashboard', requiredRole: 'EDITOR' as const },
  { icon: MdWork, label: 'Careers', href: '/admin/careers', key: 'careers', requiredRole: 'MANAGER' as const },
  { icon: MdFolder, label: 'Projects', href: '/admin/projects', key: 'projects', requiredRole: 'EDITOR' as const },
  { icon: MdArticle, label: 'News', href: '/admin/news', key: 'news', requiredRole: 'EDITOR' as const },
  { icon: MdMailOutline, label: 'Contact', href: '/admin/contact-submissions', key: 'contact', requiredRole: 'MANAGER' as const },
  { icon: MdPeople, label: 'Users', href: '/admin/users', key: 'users', requiredRole: 'ADMIN' as const },
  { icon: MdSettings, label: 'Settings', href: '/admin/settings', key: 'settings', requiredRole: 'ADMIN' as const },
];

export function IconRail() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 h-screen w-16 bg-adm-rail border-r border-adm-border flex flex-col items-center py-4 gap-2">
      {/* Nav Items */}
      <div className="flex-1 flex flex-col items-center gap-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`relative w-12 h-12 flex items-center justify-center rounded-lg transition-all group
                ${isActive
                  ? 'bg-adm-panelAlt text-nts-green'
                  : 'text-adm-textMut hover:text-adm-textBody hover:bg-adm-panelAlt/50'
                }`}
              title={item.label}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-nts-green rounded-r" />
              )}
              <item.icon size={20} />
            </Link>
          );
        })}
      </div>

      {/* Logout at bottom */}
      <form action="/api/auth/logout" method="POST" className="w-full flex justify-center">
        <button
          type="submit"
          className="w-12 h-12 flex items-center justify-center rounded-lg text-adm-textMut hover:text-adm-textBody hover:bg-adm-panelAlt/50 transition-all"
          title="Logout"
        >
          <MdLogout size={20} />
        </button>
      </form>
    </nav>
  );
}
