'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MdSearch, MdClose } from 'react-icons/md';

interface Command {
  id: string;
  label: string;
  description?: string;
  category: string;
  href?: string;
  action?: () => void;
  icon?: string;
}

const commands: Command[] = [
  // Navigation
  { id: 'nav-dashboard', label: 'Dashboard', category: 'Navigation', href: '/admin/dashboard', icon: '📊' },
  { id: 'nav-projects', label: 'Projects', category: 'Navigation', href: '/admin/projects', icon: '📁' },
  { id: 'nav-news', label: 'News', category: 'Navigation', href: '/admin/news', icon: '📰' },
  { id: 'nav-testimonials', label: 'Testimonials', category: 'Navigation', href: '/admin/testimonials', icon: '⭐' },
  { id: 'nav-users', label: 'Users', category: 'Navigation', href: '/admin/users', icon: '👥' },
  { id: 'nav-contact', label: 'Contact Submissions', category: 'Navigation', href: '/admin/contact-submissions', icon: '📧' },
  { id: 'nav-careers', label: 'Job Applications', category: 'Navigation', href: '/admin/careers/applications', icon: '💼' },
  { id: 'nav-settings', label: 'Settings', category: 'Navigation', href: '/admin/settings', icon: '⚙️' },

  // Create
  { id: 'create-project', label: 'New Project', category: 'Create', href: '/admin/projects/new', icon: '➕' },
  { id: 'create-news', label: 'New News Article', category: 'Create', href: '/admin/news/new', icon: '➕' },
  { id: 'create-testimonial', label: 'New Testimonial', category: 'Create', href: '/admin/testimonials/new', icon: '➕' },
  { id: 'create-user', label: 'New User', category: 'Create', href: '/admin/users/new', icon: '➕' },
  { id: 'create-job', label: 'New Job', category: 'Create', href: '/admin/careers/new', icon: '➕' },

  // Quick Actions
  { id: 'action-logout', label: 'Logout', category: 'Actions', href: '/api/auth/logout', icon: '🚪' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Group by category
  const grouped = filtered.reduce((acc, cmd) => {
    const cat = cmd.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  // Open on Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(!open);
        setSearch('');
        setSelectedIndex(0);
      }

      if (open && e.key === 'Escape') {
        setOpen(false);
      }

      if (open && e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
      }

      if (open && e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      }

      if (open && e.key === 'Enter') {
        e.preventDefault();
        const selected = filtered[selectedIndex];
        if (selected?.href) {
          router.push(selected.href);
          setOpen(false);
        } else if (selected?.action) {
          selected.action();
          setOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, filtered, selectedIndex, router]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-adm-textMut bg-adm-panel border border-adm-border rounded-lg hover:text-adm-textBody transition-colors"
        title="Press Cmd+K"
      >
        <MdSearch size={16} />
        <span className="hidden sm:inline">Search commands...</span>
        <span className="ml-auto text-xs text-adm-textFnt">⌘K</span>
      </button>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={() => setOpen(false)}
      />

      {/* Command Palette */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl">
        <div className="bg-adm-app border border-adm-border rounded-lg shadow-xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-adm-border bg-adm-panel">
            <MdSearch size={18} className="text-adm-textMut" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a command or search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedIndex(0);
              }}
              className="flex-1 bg-transparent outline-none text-adm-textPri placeholder-adm-textMut font-mono text-sm"
            />
            <button
              onClick={() => setOpen(false)}
              className="text-adm-textMut hover:text-adm-textBody transition-colors"
            >
              <MdClose size={18} />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-adm-textMut text-sm font-mono">No commands found</p>
              </div>
            ) : (
              Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <div className="px-4 py-2 text-xs font-mono text-adm-textMut uppercase tracking-wide bg-adm-panelAlt/50">
                    {category}
                  </div>
                  {items.map((cmd, idx) => {
                    const globalIndex = filtered.indexOf(cmd);
                    const isSelected = globalIndex === selectedIndex;
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => {
                          if (cmd.href) router.push(cmd.href);
                          setOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors ${
                          isSelected
                            ? 'bg-nts-green text-white'
                            : 'text-adm-textBody hover:bg-adm-panelAlt'
                        }`}
                      >
                        {cmd.icon && <span className="text-lg">{cmd.icon}</span>}
                        <div className="flex-1">
                          <div className="text-sm font-medium">{cmd.label}</div>
                          {cmd.description && (
                            <div className="text-xs text-adm-textMut">{cmd.description}</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-adm-border bg-adm-panel/50 text-xs text-adm-textMut font-mono flex items-center justify-between">
            <div className="flex gap-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>ESC Close</span>
            </div>
            <span>{filtered.length} results</span>
          </div>
        </div>
      </div>
    </>
  );
}
