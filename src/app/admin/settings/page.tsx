'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

interface SiteSettings {
  id?: number;
  companyName?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  logoVersion?: number;
}

interface Accreditation {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string | null;
  enabled: boolean;
  order: number;
}

const SLUG_TO_EXT: Record<string, string> = {
  honeywell: 'jpg', toshiba: 'png', fgr: 'jpg', oftec: 'jpg',
  mitsubishi: 'jpg', 'magic-box': 'jpg', fgas: 'jpg', cylon: 'jpg',
  chas: 'jpg', 'gas-safe': 'jpg', aphc: 'jpg', alcumus: 'jpg',
};

function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
      padding: '12px 18px', borderRadius: 'var(--radius-md)',
      background: type === 'success' ? 'var(--green-600)' : '#dc2626',
      color: '#fff', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }}>
      {message}
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [accreditations, setAccreditations] = useState<Accreditation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingAccreditations, setSavingAccreditations] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [newName, setNewName] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImagePreview, setNewImagePreview] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [addingAccred, setAddingAccred] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    Promise.all([
      fetch('/api/settings', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/accreditations', { credentials: 'include' }).then(r => r.json()),
    ]).then(([settingsData, accreditationsData]) => {
      setSettings(settingsData.settings || settingsData || {});
      setAccreditations(Array.isArray(accreditationsData) ? accreditationsData : []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSaveContact = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showToast('Contact details saved');
      } else {
        showToast('Failed to save', 'error');
      }
    } catch {
      showToast('Error saving', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoToggle = async (version: number) => {
    const prev = settings.logoVersion;
    setSettings(s => ({ ...s, logoVersion: version }));
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...settings, logoVersion: version }),
      });
      if (res.ok) {
        showToast(`Logo switched to ${version === 1 ? 'old' : 'new'}`);
      } else {
        setSettings(s => ({ ...s, logoVersion: prev }));
        showToast('Failed to update logo', 'error');
      }
    } catch {
      setSettings(s => ({ ...s, logoVersion: prev }));
    }
  };

  const handleToggleAccreditation = (slug: string) => {
    setAccreditations(prev =>
      prev.map(a => a.slug === slug ? { ...a, enabled: !a.enabled } : a)
    );
  };

  const handleSaveAccreditations = async () => {
    setSavingAccreditations(true);
    try {
      const res = await fetch('/api/accreditations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ updates: accreditations.map((a, i) => ({ slug: a.slug, enabled: a.enabled, order: i })) }),
      });
      if (res.ok) {
        showToast('Accreditations saved');
      } else {
        showToast('Failed to save accreditations', 'error');
      }
    } catch {
      showToast('Error saving accreditations', 'error');
    } finally {
      setSavingAccreditations(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const { url } = await res.json() as { url: string };
        setNewImageUrl(url);
        setNewImagePreview(url);
      } else {
        showToast('Upload failed', 'error');
      }
    } catch {
      showToast('Upload failed', 'error');
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  const handleAddAccreditation = async () => {
    if (!newName.trim()) { showToast('Name is required', 'error'); return; }
    setAddingAccred(true);
    try {
      const res = await fetch('/api/accreditations', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), imageUrl: newImageUrl || undefined }),
      });
      if (res.ok) {
        const created = await res.json() as Accreditation;
        setAccreditations(prev => [...prev, created]);
        setNewName('');
        setNewImageUrl('');
        setNewImagePreview('');
        showToast('Accreditation added');
      } else {
        showToast('Failed to add', 'error');
      }
    } catch {
      showToast('Error adding', 'error');
    } finally {
      setAddingAccred(false);
    }
  };

  const handleDeleteAccreditation = async (id: number) => {
    if (!confirm('Remove this accreditation?')) return;
    try {
      const res = await fetch(`/api/accreditations/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setAccreditations(prev => prev.filter(a => a.id !== id));
        showToast('Removed');
      } else {
        showToast('Failed to remove', 'error');
      }
    } catch {
      showToast('Error removing', 'error');
    }
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)', fontFamily: 'var(--font-body)',
    fontSize: '14px', color: 'var(--navy-800)', background: '#fff', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--slate-600)',
    display: 'block', marginBottom: '6px',
  };
  const cardStyle: React.CSSProperties = {
    background: '#fff', borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border)', padding: '24px', marginBottom: '24px',
  };
  const sectionHeading: React.CSSProperties = {
    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px',
    color: 'var(--navy-800)', margin: '0 0 6px 0',
  };
  const sectionSub: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-500)',
    textTransform: 'uppercase', letterSpacing: '.04em', margin: '0 0 20px 0',
  };

  if (loading) {
    return <div style={{ padding: '40px', color: 'var(--slate-400)', fontFamily: 'var(--font-body)' }}>Loading…</div>;
  }

  return (
    <div style={{ maxWidth: '860px' }}>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '28px', color: 'var(--navy-800)', margin: '0 0 4px 0' }}>
          Settings
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '.04em', margin: 0 }}>
          Site configuration
        </p>
      </div>

      {/* ── LOGO VERSION ── */}
      <div style={cardStyle}>
        <h2 style={sectionHeading}>Logo Version</h2>
        <p style={sectionSub}>Choose which logo is displayed on the public website</p>

        <div style={{ display: 'flex', gap: '16px' }}>
          {[
            { version: 1, label: 'New Logo', src: '/images/ntsLogo.png' },
            { version: 2, label: 'Old Logo', src: '/images/ntsLogo-old.png' },
          ].map(({ version, label, src }) => {
            const active = (settings.logoVersion ?? 1) === version;
            return (
              <button
                key={version}
                onClick={() => handleLogoToggle(version)}
                style={{
                  flex: 1, padding: '20px', borderRadius: 'var(--radius-md)',
                  border: `2px solid ${active ? 'var(--green-600)' : 'var(--border)'}`,
                  background: active ? 'var(--green-50)' : '#fff',
                  cursor: 'pointer', textAlign: 'center',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
              >
                <div style={{
                  height: '64px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', marginBottom: '12px',
                }}>
                  <Image src={src} alt={label} width={160} height={60} style={{ objectFit: 'contain', maxHeight: '60px' }} />
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600,
                  color: active ? 'var(--green-700)' : 'var(--slate-600)',
                }}>
                  {label}
                </div>
                {active && (
                  <div style={{
                    marginTop: '8px', display: 'inline-block',
                    fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '.04em',
                    padding: '2px 8px', borderRadius: 'var(--radius-sm)',
                    background: 'var(--green-100)', color: 'var(--green-700)',
                  }}>
                    Active
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── ACCREDITATIONS ── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ ...sectionHeading, marginBottom: '4px' }}>Accreditations</h2>
            <p style={{ ...sectionSub, margin: 0 }}>Toggle which logos appear in the accreditations strip</p>
          </div>
          <button
            onClick={handleSaveAccreditations}
            disabled={savingAccreditations}
            style={{
              padding: '8px 16px', borderRadius: 'var(--radius-md)', border: 'none',
              background: 'var(--green-600)', color: '#fff',
              fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600,
              cursor: savingAccreditations ? 'default' : 'pointer',
              opacity: savingAccreditations ? 0.6 : 1,
              flexShrink: 0,
            }}
          >
            {savingAccreditations ? 'Saving…' : 'Save'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
          {accreditations.map((a) => {
            const imgSrc = a.imageUrl ?? `/images/accreditations/${a.slug}.${SLUG_TO_EXT[a.slug] ?? 'jpg'}`;
            return (
              <div key={a.slug} style={{ position: 'relative' }}>
                <button
                  onClick={() => handleToggleAccreditation(a.slug)}
                  style={{
                    width: '100%', padding: '16px 12px', borderRadius: 'var(--radius-md)',
                    border: `2px solid ${a.enabled ? 'var(--green-600)' : 'var(--border)'}`,
                    background: a.enabled ? 'var(--green-50)' : 'var(--slate-50)',
                    cursor: 'pointer', textAlign: 'center',
                    transition: 'border-color 0.15s, background 0.15s',
                    opacity: a.enabled ? 1 : 0.5,
                  }}
                >
                  <div style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                    <Image
                      src={imgSrc}
                      alt={a.name}
                      width={80}
                      height={48}
                      style={{ objectFit: 'contain', maxHeight: '48px', filter: a.enabled ? 'none' : 'grayscale(1)' }}
                    />
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '.03em',
                    color: a.enabled ? 'var(--green-700)' : 'var(--slate-500)',
                  }}>
                    {a.name}
                  </div>
                </button>
                {/* Delete button */}
                <button
                  onClick={() => handleDeleteAccreditation(a.id)}
                  title="Remove"
                  style={{
                    position: 'absolute', top: '4px', right: '4px',
                    width: '20px', height: '20px', borderRadius: '50%',
                    border: 'none', background: '#dc2626', color: '#fff',
                    fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    lineHeight: 1, padding: 0,
                    opacity: 0.8,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        <p style={{ marginTop: '14px', fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--slate-500)' }}>
          {accreditations.filter(a => a.enabled).length} of {accreditations.length} enabled · Click a logo to toggle · × to remove
        </p>

        {/* ── Add new accreditation ── */}
        <div style={{
          marginTop: '20px', paddingTop: '20px',
          borderTop: '1px solid var(--border)',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '.04em',
            color: 'var(--slate-600)', marginBottom: '12px',
          }}>
            Add New Accreditation
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>

            {/* Logo upload */}
            <div>
              <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
              <button
                onClick={() => logoInputRef.current?.click()}
                disabled={uploadingLogo}
                style={{
                  width: '80px', height: '64px', borderRadius: 'var(--radius-md)',
                  border: `2px dashed ${newImagePreview ? 'var(--green-600)' : 'var(--border)'}`,
                  background: newImagePreview ? 'var(--green-50)' : 'var(--slate-50)',
                  cursor: uploadingLogo ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', padding: 0,
                  opacity: uploadingLogo ? 0.6 : 1,
                }}
              >
                {newImagePreview ? (
                  <img src={newImagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} />
                ) : (
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--slate-500)', textAlign: 'center', padding: '6px' }}>
                    {uploadingLogo ? '…' : '+ Logo'}
                  </span>
                )}
              </button>
            </div>

            {/* Name input */}
            <div style={{ flex: 1, minWidth: '160px' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--slate-600)', display: 'block', marginBottom: '5px' }}>
                Name
              </label>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddAccreditation(); }}
                placeholder="e.g. NICEIC"
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--navy-800)', background: '#fff', boxSizing: 'border-box' as const }}
              />
            </div>

            {/* Add button */}
            <button
              onClick={handleAddAccreditation}
              disabled={addingAccred || !newName.trim()}
              style={{
                padding: '8px 18px', height: '38px', borderRadius: 'var(--radius-md)',
                border: 'none', background: 'var(--green-600)', color: '#fff',
                fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600,
                cursor: addingAccred || !newName.trim() ? 'default' : 'pointer',
                opacity: addingAccred || !newName.trim() ? 0.5 : 1,
                flexShrink: 0,
              }}
            >
              {addingAccred ? 'Adding…' : '+ Add'}
            </button>
          </div>
        </div>
      </div>

      {/* ── CONTACT DETAILS ── */}
      <div style={cardStyle}>
        <h2 style={sectionHeading}>Contact Details</h2>
        <p style={sectionSub}>Shown in the footer and contact page</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Phone</label>
            <input
              type="tel"
              value={settings.phone ?? ''}
              onChange={e => setSettings(s => ({ ...s, phone: e.target.value }))}
              style={fieldStyle}
              placeholder="01482 838080"
            />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={settings.email ?? ''}
              onChange={e => setSettings(s => ({ ...s, email: e.target.value }))}
              style={fieldStyle}
              placeholder="info@nt.services"
            />
          </div>
          <div>
            <label style={labelStyle}>Address</label>
            <input
              type="text"
              value={settings.address ?? ''}
              onChange={e => setSettings(s => ({ ...s, address: e.target.value }))}
              style={fieldStyle}
              placeholder="Unit F2 Rotterdam Park"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>City</label>
              <input
                type="text"
                value={settings.city ?? ''}
                onChange={e => setSettings(s => ({ ...s, city: e.target.value }))}
                style={fieldStyle}
                placeholder="Hull"
              />
            </div>
            <div>
              <label style={labelStyle}>Postcode</label>
              <input
                type="text"
                value={settings.postalCode ?? ''}
                onChange={e => setSettings(s => ({ ...s, postalCode: e.target.value }))}
                style={fieldStyle}
                placeholder="HU7 0AN"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── SOCIAL LINKS ── */}
      <div style={cardStyle}>
        <h2 style={sectionHeading}>Social Links</h2>
        <p style={sectionSub}>URLs for social media icons in the footer</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[
            { key: 'facebookUrl', label: 'Facebook', placeholder: 'https://facebook.com/…' },
            { key: 'linkedinUrl', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/…' },
            { key: 'twitterUrl', label: 'X / Twitter', placeholder: 'https://x.com/…' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <input
                type="url"
                value={settings[key as keyof SiteSettings] as string ?? ''}
                onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                style={fieldStyle}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save contact + social button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-8px' }}>
        <button
          onClick={handleSaveContact}
          disabled={saving}
          style={{
            padding: '10px 24px', borderRadius: 'var(--radius-md)', border: 'none',
            background: 'var(--green-600)', color: '#fff',
            fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600,
            cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
