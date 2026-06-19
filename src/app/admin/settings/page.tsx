'use client';

import { useEffect, useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';

interface SettingsData {
  phone?: string;
  email?: string;
  address?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

interface ContentStats {
  projects: number;
  posts: number;
  enquiries: number;
  teamMembers: number;
  testimonials: number;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    socialLinks: {},
  });
  const [stats, setStats] = useState<ContentStats>({
    projects: 0,
    posts: 0,
    enquiries: 0,
    teamMembers: 0,
    testimonials: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [userRole, setUserRole] = useState<string>('viewer');

  useEffect(() => {
    // Fetch user role
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setUserRole(data.role || 'viewer'))
      .catch(() => setUserRole('viewer'));

    // Fetch settings
    fetch('/api/settings', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings(data.settings);
        }
      })
      .catch((error) => console.error('Failed to fetch settings:', error));

    // Fetch stats
    Promise.all([
      fetch('/api/projects', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/news', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/contact-submissions', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/users', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/testimonials', { credentials: 'include' }).then((r) => r.json()),
    ])
      .then(([projects, posts, enquiries, users, testimonials]) => {
        const projectsArray = Array.isArray(projects) ? projects : projects.projects || [];
        const postsArray = Array.isArray(posts) ? posts : posts.posts || posts.news || [];
        const enquiriesArray = Array.isArray(enquiries) ? enquiries : enquiries.submissions || [];
        const usersArray = Array.isArray(users) ? users : users.users || [];
        const testimonialsArray = Array.isArray(testimonials) ? testimonials : testimonials.testimonials || [];

        setStats({
          projects: projectsArray.length,
          posts: postsArray.length,
          enquiries: enquiriesArray.length,
          teamMembers: usersArray.length,
          testimonials: testimonialsArray.length,
        });
      })
      .catch((error) => console.error('Failed to fetch stats:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (userRole !== 'administrator') {
      setMessage({ type: 'error', text: 'Only administrators can modify settings' });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings' });
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setMessage({ type: 'error', text: 'Error saving settings' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="mepm-h2 text-navy-700">Settings</h1>
        <p className="mepm-spec mt-1 text-slate-500">Site configuration and statistics</p>
      </div>

      {/* Message Alert */}
      {message && (
        <div style={{
          marginBottom: '24px',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start',
          background: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${message.type === 'success' ? '#dcfce7' : '#fee2e2'}`,
        }}>
          <AlertCircle
            size={16}
            style={{
              marginTop: '2px',
              color: message.type === 'success' ? '#16a34a' : '#dc2626',
              flexShrink: 0,
            }}
          />
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: message.type === 'success' ? '#166534' : '#7f1d1d',
            margin: 0,
          }}>
            {message.text}
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <span className="font-mono text-slate-400">Loading…</span>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Left Column: Content Stats */}
          <div style={{
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #e5e7eb',
            padding: '24px',
            background: '#fff',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--navy-800)',
              margin: '0 0 18px 0',
            }}>
              Content Overview
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { label: 'Projects', value: stats.projects },
                { label: 'Blog Posts', value: stats.posts },
                { label: 'Enquiries', value: stats.enquiries },
                { label: 'Team Members', value: stats.teamMembers },
                { label: 'Testimonials', value: stats.testimonials },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--navy-50)',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '.03em',
                    color: 'var(--slate-500)',
                    margin: '0 0 4px 0',
                  }}>
                    {label}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '24px',
                    fontWeight: 700,
                    color: 'var(--navy-800)',
                    margin: 0,
                  }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Edit Settings */}
          <div style={{
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #e5e7eb',
            padding: '24px',
            background: '#fff',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--navy-800)',
              margin: '0 0 18px 0',
            }}>
              Contact Details
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              <div>
                <label style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '.03em',
                  color: 'var(--slate-600)',
                  display: 'block',
                  marginBottom: '6px',
                }}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={settings.phone || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, phone: e.target.value })
                  }
                  disabled={userRole !== 'administrator'}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #e5e7eb',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    opacity: userRole !== 'administrator' ? 0.6 : 1,
                    cursor: userRole !== 'administrator' ? 'not-allowed' : 'text',
                    boxSizing: 'border-box',
                  }}
                  placeholder="e.g., 01482 838080"
                />
              </div>

              <div>
                <label style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '.03em',
                  color: 'var(--slate-600)',
                  display: 'block',
                  marginBottom: '6px',
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={settings.email || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                  disabled={userRole !== 'administrator'}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #e5e7eb',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    opacity: userRole !== 'administrator' ? 0.6 : 1,
                    cursor: userRole !== 'administrator' ? 'not-allowed' : 'text',
                    boxSizing: 'border-box',
                  }}
                  placeholder="e.g., info@nts-services.com"
                />
              </div>

              <div>
                <label style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '.03em',
                  color: 'var(--slate-600)',
                  display: 'block',
                  marginBottom: '6px',
                }}>
                  Address
                </label>
                <textarea
                  value={settings.address || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, address: e.target.value })
                  }
                  disabled={userRole !== 'administrator'}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #e5e7eb',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    minHeight: '64px',
                    resize: 'vertical',
                    opacity: userRole !== 'administrator' ? 0.6 : 1,
                    cursor: userRole !== 'administrator' ? 'not-allowed' : 'text',
                    boxSizing: 'border-box',
                  }}
                  placeholder="Full address"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving || userRole !== 'administrator'}
                style={{
                  marginTop: '8px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: userRole !== 'administrator' ? '#ccc' : 'var(--green-600)',
                  color: '#fff',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: userRole !== 'administrator' || saving ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: userRole !== 'administrator' ? 0.6 : 1,
                }}
              >
                <Save size={16} /> {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Social Links Section - Below Main Grid */}
      {!loading && userRole === 'administrator' && (
        <div style={{
          marginTop: '24px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #e5e7eb',
          padding: '24px',
          background: '#fff',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--navy-800)',
            margin: '0 0 18px 0',
          }}>
            Social Links
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
          }}>
            {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
              <div key={social}>
                <label style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  letterSpacing: '.03em',
                  color: 'var(--slate-600)',
                  display: 'block',
                  marginBottom: '6px',
                }}>
                  {social}
                </label>
                <input
                  type="url"
                  value={settings.socialLinks?.[social as keyof typeof settings.socialLinks] || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: {
                        ...settings.socialLinks,
                        [social]: e.target.value,
                      },
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #e5e7eb',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                  placeholder={`https://${social}.com/yourpage`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
