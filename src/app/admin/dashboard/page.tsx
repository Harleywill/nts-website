'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/admin/StatCard';
import { FolderOpen, FileText, Mail, Users } from 'lucide-react';

interface Stats {
  publishedProjects: number;
  draftProjects: number;
  newEnquiries: number;
  teamMembers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    publishedProjects: 0,
    draftProjects: 0,
    newEnquiries: 0,
    teamMembers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, enquiriesRes, usersRes] = await Promise.all([
          fetch('/api/projects', { credentials: 'include' }),
          fetch('/api/contact-submissions', { credentials: 'include' }),
          fetch('/api/users', { credentials: 'include' }),
        ]);

        const projects = (await projectsRes.json()) || [];
        const enquiries = (await enquiriesRes.json()) || [];
        const users = (await usersRes.json()) || [];

        const projectsArray = Array.isArray(projects) ? projects : projects.projects || [];
        const enquiriesArray = Array.isArray(enquiries) ? enquiries : enquiries.submissions || [];
        const usersArray = Array.isArray(users) ? users : users.users || [];

        setStats({
          publishedProjects: projectsArray.filter((p: any) => p.status === 'published').length,
          draftProjects: projectsArray.filter((p: any) => p.status === 'draft').length,
          newEnquiries: enquiriesArray.filter((e: any) => !e.isRead).length,
          teamMembers: usersArray.length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="mepm-h2 text-navy-700">Dashboard</h1>
        <p className="mepm-spec mt-1 text-slate-500">Welcome to NTS admin panel</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <span className="font-mono text-slate-400">Loading…</span>
        </div>
      ) : (
        <>
          {/* Stat Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '18px',
            marginBottom: '36px',
          }}>
            <StatCard
              value={stats.publishedProjects}
              label="Published Projects"
              icon={<FolderOpen size={20} />}
            />
            <StatCard
              value={stats.draftProjects}
              label="Draft Projects"
              icon={<FileText size={20} />}
            />
            <StatCard
              value={stats.newEnquiries}
              label="New Enquiries"
              icon={<Mail size={20} />}
            />
            <StatCard
              value={stats.teamMembers}
              label="Team Members"
              icon={<Users size={20} />}
            />
          </div>

          {/* Placeholder sections for future expansion */}
          <div style={{
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed #e5e7eb',
            background: '#f9fafb',
            textAlign: 'center',
            color: 'var(--slate-500)',
            marginTop: '36px',
          }}>
            <p style={{ margin: 0 }}>Recent updates and featured content sections coming soon</p>
          </div>
        </>
      )}
    </div>
  );
}
