'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import StatCard from '@/components/admin/StatCard';
import { FolderOpen, FileText, Mail, Users, TrendingUp, ArrowRight, Star } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0, featuredProjects: 0, newEnquiries: 0,
    teamMembers: 0, totalTestimonials: 0, totalNews: 0, totalReviews: 0,
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [projects, enquiriesData, users, testimonials, news, reviews] = await Promise.all([
          fetch('/api/projects').then(r => r.json()).catch(() => []),
          fetch('/api/contact-submissions').then(r => r.json()).catch(() => []),
          fetch('/api/users').then(r => r.json()).catch(() => []),
          fetch('/api/testimonials').then(r => r.json()).catch(() => []),
          fetch('/api/news').then(r => r.json()).catch(() => []),
          fetch('/api/admin/reviews', { credentials: 'include' }).then(r => r.json()).catch(() => ({ reviews: [] })),
        ]);

        const projectsArr = Array.isArray(projects) ? projects : [];
        const enquiriesArr = Array.isArray(enquiriesData) ? enquiriesData : (enquiriesData?.submissions ?? []);
        const usersArr = Array.isArray(users) ? users : (users?.users ?? []);
        const testimonialsArr = Array.isArray(testimonials) ? testimonials : [];
        const newsArr = Array.isArray(news) ? news : [];
        const reviewsArr = Array.isArray(reviews?.reviews) ? reviews.reviews : [];

        setStats({
          totalProjects: projectsArr.length,
          featuredProjects: projectsArr.filter((p: any) => p.featured).length,
          newEnquiries: enquiriesArr.filter((e: any) => e.status === 'UNREAD' || (!e.status && !e.read)).length,
          teamMembers: usersArr.length,
          totalTestimonials: testimonialsArr.length,
          totalNews: newsArr.length,
          totalReviews: reviewsArr.length,
        });

        setRecentProjects(
          projectsArr
            .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 4)
        );
        setFeaturedProjects(projectsArr.filter((p: any) => p.featured).slice(0, 3));
        setEnquiries(enquiriesArr.slice(0, 5));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div style={{ padding: '24px', color: 'var(--slate-400)' }}>Loading…</div>;

  return (
    <div style={{ padding: '24px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--green-700)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{ width: '22px', height: '2px', background: 'var(--green-600)' }}></span>NTS Dashboard
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '34px', letterSpacing: '-.02em', color: 'var(--navy-800)', margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--slate-600)', margin: '10px 0 0', maxWidth: 560 }}>Welcome to NTS admin panel</p>
      </div>

      {/* Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '18px', marginBottom: '24px' }}>
        <Link href="/admin/projects" style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <StatCard value={stats.totalProjects} label="Total Projects" icon={<FolderOpen size={22} />} tone="navy" />
        </Link>
        <Link href="/admin/projects" style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <StatCard value={stats.featuredProjects} label="Featured" icon={<TrendingUp size={22} />} tone="amber" />
        </Link>
        <Link href="/admin/news" style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <StatCard value={stats.totalNews} label="Blog Posts" icon={<FileText size={22} />} tone="green" />
        </Link>
        <Link href="/admin/reviews" style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <StatCard value={stats.totalReviews} label="Reviews" icon={<Star size={22} />} tone="amber" />
        </Link>
        <Link href="/admin/testimonials" style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <StatCard value={stats.totalTestimonials} label="Testimonials" icon={<Mail size={22} />} tone="slate" />
        </Link>
        <Link href="/admin/contact-submissions" style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <StatCard value={stats.newEnquiries} label="New Enquiries" icon={<Mail size={22} />} tone="green" />
        </Link>
        <Link href="/admin/users" style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <StatCard value={stats.teamMembers} label="Team Members" icon={<Users size={22} />} tone="slate" />
        </Link>
      </div>

      {/* Recently Updated & Latest Enquiries */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', alignItems: 'start', marginBottom: '20px' }}>
        {/* Recently Updated */}
        <SectionCard title="Recently updated" action={<LinkButton href="/admin/projects">All projects <ArrowRight size={14} /></LinkButton>}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recentProjects.map((p, i) => (
              <button key={p.id} onClick={() => window.location.href = `/admin/projects/${p.id}/edit`} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 0', borderTop: i ? '1px solid var(--border)' : 'none', background: 'none', border: 'none', borderTopWidth: i ? 1 : 0, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: 'var(--radius-sm)', flex: 'none', background: 'var(--navy-50)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.imageUrl ? <img src={p.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FileText size={17} style={{ color: 'var(--navy-300)' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: 'var(--navy-800)' }}>{p.title}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: 'var(--slate-400)', marginTop: '2px' }}>{p.category} · {new Date(p.updatedAt).toLocaleDateString()}</div>
                </div>
              </button>
            ))}
            {recentProjects.length === 0 && <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--slate-500)', margin: 0 }}>No projects yet</p>}
          </div>
        </SectionCard>

        {/* Latest Enquiries */}
        <SectionCard title="Latest enquiries" action={<LinkButton href="/admin/contact-submissions">Inbox <ArrowRight size={14} /></LinkButton>}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {enquiries.map((e, i) => {
              const isUnread = e.status === 'UNREAD' || (!e.status && !e.read);
              return (
                <button key={e.id} onClick={() => window.location.href = '/admin/contact-submissions'} style={{ display: 'flex', gap: '12px', padding: '13px 0', borderTop: i ? '1px solid var(--border)' : 'none', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', marginTop: '6px', flex: 'none' }}>
                    {isUnread && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green-600)', display: 'block' }}></span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontWeight: isUnread ? 700 : 600, fontSize: '14px', color: 'var(--navy-800)' }}>{e.name}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--slate-500)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.email}</div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-400)', flex: 'none' }}>{new Date(e.createdAt).toLocaleDateString()}</span>
                </button>
              );
            })}
            {enquiries.length === 0 && <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--slate-500)', margin: 0 }}>No enquiries yet</p>}
          </div>
        </SectionCard>
      </div>

      {/* Featured on Homepage */}
      <SectionCard title="Featured on homepage" sub={`${featuredProjects.length} of 3 slots used`} action={<LinkButton href="/admin/projects">Preview <ArrowRight size={14} /></LinkButton>}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {[0, 1, 2].map((i) => {
            const p = featuredProjects[i];
            if (!p) return (
              <div key={i} style={{ height: '92px', borderRadius: 'var(--radius-md)', border: '1.5px dashed var(--navy-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-300)', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.06em' }}>EMPTY SLOT</div>
            );
            return (
              <button key={p.id} onClick={() => window.location.href = `/admin/projects/${p.id}/edit`} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--slate-50)', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', flex: 'none', background: p.imageUrl ? '#000' : 'var(--navy-100)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.imageUrl ? <img src={p.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FileText size={18} style={{ color: 'var(--navy-300)' }} />}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14.5px', color: 'var(--navy-800)' }}>{p.title}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-400)', marginTop: '3px' }}>{p.category}</div>
                </div>
              </button>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

function SectionCard({ title, sub, action, children }: { title: string; sub?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xs)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '17px', color: 'var(--navy-800)', margin: 0 }}>{title}</h3>
          {sub && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-400)', marginTop: '3px' }}>{sub}</div>}
        </div>
        {action}
      </div>
      <div style={{ padding: '8px 22px 18px' }}>{children}</div>
    </div>
  );
}

function LinkButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13.5px', color: 'var(--navy-700)', textDecoration: 'none' }}>
      {children}
    </Link>
  );
}
