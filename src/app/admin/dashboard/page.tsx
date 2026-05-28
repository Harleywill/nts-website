'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BoldPanel } from '@/components/admin/ui/BoldPanel';
import { StatusPill } from '@/components/admin/ui/StatusPill';
import { BoldButton } from '@/components/admin/ui/BoldButton';
import { Avatar } from '@/components/admin/ui/Avatar';
import { Sparkline } from '@/components/admin/ui/Sparkline';

interface Stats {
  users: number;
  projects: number;
  news: number;
  testimonials: number;
  contactSubmissions: number;
  applications: number;
}

interface SparklineData {
  users: number[];
  projects: number[];
  news: number[];
  testimonials: number[];
  submissions: number[];
  applications: number[];
}

interface ActivityEntry {
  timestamp: string;
  action: string;
  resource: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    users: 0,
    projects: 0,
    news: 0,
    testimonials: 0,
    contactSubmissions: 0,
    applications: 0,
  });
  const [sparklines, setSparklines] = useState<SparklineData>({
    users: [],
    projects: [],
    news: [],
    testimonials: [],
    submissions: [],
    applications: [],
  });
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [time, setTime] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Update time every second
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, projectsRes, newsRes, testimonialsRes, contactRes, applicationsRes, usersHistoryRes, projectsHistoryRes, newsHistoryRes, testimonialsHistoryRes, submissionsHistoryRes, applicationsHistoryRes] = await Promise.all([
          fetch('/api/users', { credentials: 'include' }),
          fetch('/api/projects', { credentials: 'include' }),
          fetch('/api/news', { credentials: 'include' }),
          fetch('/api/testimonials', { credentials: 'include' }),
          fetch('/api/contact-submissions', { credentials: 'include' }),
          fetch('/api/admin/applications', { credentials: 'include' }),
          fetch('/api/admin/stats/history?type=users', { credentials: 'include' }),
          fetch('/api/admin/stats/history?type=projects', { credentials: 'include' }),
          fetch('/api/admin/stats/history?type=news', { credentials: 'include' }),
          fetch('/api/admin/stats/history?type=testimonials', { credentials: 'include' }),
          fetch('/api/admin/stats/history?type=submissions', { credentials: 'include' }),
          fetch('/api/admin/stats/history?type=applications', { credentials: 'include' }),
        ]);

        if (
          !usersRes.ok ||
          !projectsRes.ok ||
          !newsRes.ok ||
          !testimonialsRes.ok ||
          !contactRes.ok ||
          !applicationsRes.ok
        ) {
          throw new Error('Failed to fetch stats');
        }

        const users = await usersRes.json();
        const projects = await projectsRes.json();
        const news = await newsRes.json();
        const testimonials = await testimonialsRes.json();
        const contact = await contactRes.json();
        const applications = await applicationsRes.json();

        setStats({
          users: Array.isArray(users) ? users.length : 0,
          projects: Array.isArray(projects) ? projects.length : 0,
          news: Array.isArray(news) ? news.length : 0,
          testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
          contactSubmissions: Array.isArray(contact) ? contact.length : 0,
          applications: Array.isArray(applications) ? applications.length : 0,
        });

        // Fetch sparkline data (don't fail the entire dashboard if history fails)
        let usersHistory: number[] = [];
        let projectsHistory: number[] = [];
        let newsHistory: number[] = [];
        let testimonialsHistory: number[] = [];
        let submissionsHistory: number[] = [];
        let applicationsHistory: number[] = [];

        if (usersHistoryRes.ok) usersHistory = await usersHistoryRes.json();
        if (projectsHistoryRes.ok) projectsHistory = await projectsHistoryRes.json();
        if (newsHistoryRes.ok) newsHistory = await newsHistoryRes.json();
        if (testimonialsHistoryRes.ok) testimonialsHistory = await testimonialsHistoryRes.json();
        if (submissionsHistoryRes.ok) submissionsHistory = await submissionsHistoryRes.json();
        if (applicationsHistoryRes.ok) applicationsHistory = await applicationsHistoryRes.json();

        setSparklines({
          users: usersHistory && usersHistory.length > 0 ? usersHistory : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          projects: projectsHistory && projectsHistory.length > 0 ? projectsHistory : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          news: newsHistory && newsHistory.length > 0 ? newsHistory : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          testimonials: testimonialsHistory && testimonialsHistory.length > 0 ? testimonialsHistory : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          submissions: submissionsHistory && submissionsHistory.length > 0 ? submissionsHistory : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          applications: applicationsHistory && applicationsHistory.length > 0 ? applicationsHistory : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        });

        // Fetch recent activity
        try {
          const activityRes = await fetch('/api/admin/activity', { credentials: 'include' });
          if (activityRes.ok) {
            const activityData = await activityRes.json();
            setActivity(activityData);
          }
        } catch (err) {
          console.error('Failed to fetch activity:', err);
        }
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-adm-textPri">COMMAND CENTER</h1>
          <p className="text-sm text-adm-textMut mt-1">NTS Ltd Administration Dashboard</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-mono font-bold text-nts-green">{time}</div>
          <div className="text-xs text-adm-textMut mt-1">Live Clock</div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Users */}
          <BoldPanel title="Total Users">
            <div className="space-y-3">
              <div className="text-3xl font-mono font-bold text-nts-green">{stats.users}</div>
              <Sparkline data={sparklines.users} color="text-nts-green" height={40} />
              <Link
                href="/admin/users"
                className="text-xs text-adm-textMut hover:text-nts-green transition-colors"
              >
                View all →
              </Link>
            </div>
          </BoldPanel>

          {/* Total Projects */}
          <BoldPanel title="Total Projects">
            <div className="space-y-3">
              <div className="text-3xl font-mono font-bold text-nts-info">{stats.projects}</div>
              <Sparkline data={sparklines.projects} color="text-nts-info" height={40} />
              <Link
                href="/admin/projects"
                className="text-xs text-adm-textMut hover:text-nts-info transition-colors"
              >
                View all →
              </Link>
            </div>
          </BoldPanel>

          {/* News Articles */}
          <BoldPanel title="News Articles">
            <div className="space-y-3">
              <div className="text-3xl font-mono font-bold text-nts-warn">{stats.news}</div>
              <Sparkline data={sparklines.news} color="text-nts-warn" height={40} />
              <Link
                href="/admin/news"
                className="text-xs text-adm-textMut hover:text-nts-warn transition-colors"
              >
                View all →
              </Link>
            </div>
          </BoldPanel>

          {/* Testimonials */}
          <BoldPanel title="Testimonials">
            <div className="space-y-3">
              <div className="text-3xl font-mono font-bold text-nts-purple">{stats.testimonials}</div>
              <Sparkline data={sparklines.testimonials} color="text-nts-purple" height={40} />
              <Link
                href="/admin/testimonials"
                className="text-xs text-adm-textMut hover:text-nts-purple transition-colors"
              >
                View all →
              </Link>
            </div>
          </BoldPanel>
        </div>
      )}

      {/* Queue Panel & Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Contact Submissions */}
        <BoldPanel title="Recent Messages">
          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <div className="text-3xl font-mono font-bold text-nts-danger">{stats.contactSubmissions}</div>
              <StatusPill status="NEW" />
            </div>
            <Sparkline data={sparklines.submissions} color="text-nts-danger" height={30} />
            <p className="text-sm text-adm-textBody">Contact form submissions awaiting review</p>
            <Link href="/admin/contact-submissions">
              <BoldButton size="sm" variant="secondary" className="w-full">
                View Messages →
              </BoldButton>
            </Link>
          </div>
        </BoldPanel>

        {/* Job Applications */}
        <BoldPanel title="Job Applications">
          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <div className="text-3xl font-mono font-bold text-nts-green">{stats.applications}</div>
              <StatusPill status="NEW" />
            </div>
            <Sparkline data={sparklines.applications} color="text-nts-green" height={30} />
            <p className="text-sm text-adm-textBody">Applications across all open positions</p>
            <Link href="/admin/careers/applications">
              <BoldButton size="sm" variant="secondary" className="w-full">
                View Applications →
              </BoldButton>
            </Link>
          </div>
        </BoldPanel>
      </div>

      {/* Activity Log */}
      <BoldPanel title="Recent Activity" cornerBrackets>
        <div className="space-y-2">
          <div className="text-xs text-adm-textMut grid grid-cols-3 gap-4 pb-3 border-b border-adm-border">
            <div>TIMESTAMP</div>
            <div>ACTION</div>
            <div>RESOURCE</div>
          </div>
          {activity.length > 0 ? (
            activity.map((entry, i) => (
              <div key={i} className="text-xs grid grid-cols-3 gap-4 py-2 border-b border-adm-border/50 text-adm-textBody hover:bg-adm-panelAlt/50 px-2 rounded transition-colors">
                <div className="font-mono">{entry.timestamp}</div>
                <div>{entry.action}</div>
                <div className="text-adm-textMut">{entry.resource}</div>
              </div>
            ))
          ) : (
            <div className="text-xs text-adm-textMut py-4 text-center">No recent activity</div>
          )}
        </div>
      </BoldPanel>

      {/* Quick Actions */}
      <BoldPanel title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link href="/admin/users/new">
            <BoldButton variant="secondary" size="md" className="w-full">
              + Create User
            </BoldButton>
          </Link>
          <Link href="/admin/projects/new">
            <BoldButton variant="secondary" size="md" className="w-full">
              + New Project
            </BoldButton>
          </Link>
          <Link href="/admin/news/new">
            <BoldButton variant="secondary" size="md" className="w-full">
              + News Article
            </BoldButton>
          </Link>
          <Link href="/admin/testimonials/new">
            <BoldButton variant="secondary" size="md" className="w-full">
              + Testimonial
            </BoldButton>
          </Link>
          <Link href="/admin/careers/new">
            <BoldButton variant="secondary" size="md" className="w-full">
              + Job Posting
            </BoldButton>
          </Link>
          <Link href="/admin/contact-submissions">
            <BoldButton variant="secondary" size="md" className="w-full">
              📋 Messages
            </BoldButton>
          </Link>
        </div>
      </BoldPanel>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="text-adm-textMut font-mono">INITIALIZING DASHBOARD...</div>
        </div>
      )}
    </div>
  );
}
