'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MdNotifications, MdClose } from 'react-icons/md';

interface Notification {
  id: string | number;
  type: 'submission' | 'application';
  name: string;
  title: string;
  createdAt: string;
}

interface NotificationData {
  unreadSubmissions: number;
  newApplications: number;
  totalCount: number;
  recent: Notification[];
}

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData>({
    unreadSubmissions: 0,
    newApplications: 0,
    totalCount: 0,
    recent: [],
  });
  const [loading, setLoading] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const seconds = Math.floor((now.getTime() - created.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-adm-textMut hover:text-adm-textBody hover:bg-adm-panel rounded-lg transition-colors relative"
        title="Notifications"
      >
        <MdNotifications size={18} />
        {notifications.totalCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-nts-danger rounded-full text-white text-xs font-bold flex items-center justify-center">
            {notifications.totalCount > 9 ? '9+' : notifications.totalCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-adm-panel border border-adm-border rounded-lg shadow-xl z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-adm-border flex items-center justify-between">
            <h3 className="text-sm font-mono font-semibold text-adm-textPri">
              NOTIFICATIONS
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-adm-textMut hover:text-adm-textBody"
            >
              <MdClose size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.totalCount === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-adm-textMut font-mono">No notifications</p>
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="px-4 py-3 border-b border-adm-border/50 grid grid-cols-2 gap-2">
                  {notifications.unreadSubmissions > 0 && (
                    <Link
                      href="/admin/contact-submissions"
                      onClick={() => setIsOpen(false)}
                      className="p-2 bg-adm-app rounded hover:bg-adm-panelAlt transition-colors"
                    >
                      <div className="text-xs text-adm-textMut font-mono">Submissions</div>
                      <div className="text-sm font-mono font-bold text-nts-green">
                        {notifications.unreadSubmissions}
                      </div>
                    </Link>
                  )}
                  {notifications.newApplications > 0 && (
                    <Link
                      href="/admin/careers/applications"
                      onClick={() => setIsOpen(false)}
                      className="p-2 bg-adm-app rounded hover:bg-adm-panelAlt transition-colors"
                    >
                      <div className="text-xs text-adm-textMut font-mono">Applications</div>
                      <div className="text-sm font-mono font-bold text-nts-green">
                        {notifications.newApplications}
                      </div>
                    </Link>
                  )}
                </div>

                {/* Recent Items */}
                <div className="divide-y divide-adm-border/30">
                  {notifications.recent.map((notif) => (
                    <Link
                      key={`${notif.type}-${notif.id}`}
                      href={
                        notif.type === 'submission'
                          ? '/admin/contact-submissions'
                          : '/admin/careers/applications'
                      }
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 hover:bg-adm-panelAlt transition-colors block"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="text-xs font-mono text-adm-textMut">
                          {notif.type === 'submission' ? '📬' : '📝'} {notif.title}
                        </div>
                        <span className="text-xs text-adm-textFnt">
                          {timeAgo(notif.createdAt)}
                        </span>
                      </div>
                      <div className="text-sm text-adm-textBody truncate">{notif.name}</div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {notifications.totalCount > 0 && (
            <div className="px-4 py-2 border-t border-adm-border/50 flex gap-2">
              <Link
                href="/admin/contact-submissions"
                onClick={() => setIsOpen(false)}
                className="flex-1 text-xs font-mono text-nts-info hover:text-cyan-300 transition-colors"
              >
                View All
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
