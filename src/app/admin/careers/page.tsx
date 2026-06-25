'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  status: string;
  description: string;
  createdAt: string;
}

export default function CareersPage() {
  const router = useRouter();
  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [activeTab, setActiveTab] = useState<'listings' | 'applications'>('listings');

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res = await fetch('/api/careers', { credentials: 'include' });
        const data = await res.json();
        const careersArr = Array.isArray(data) ? data : [];
        setCareers(careersArr);
        if (careersArr.length > 0 && selectedId === null) {
          setSelectedId(careersArr[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch careers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCareers();
  }, []);

  const selected = careers.find((c) => c.id === selectedId);

  const toggleStatus = async () => {
    if (!selected) return;
    setToggling(true);
    try {
      const newStatus = selected.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      const res = await fetch(`/api/careers/${selected.id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setCareers((prev) =>
          prev.map((c) => (c.id === selected.id ? { ...c, status: newStatus } : c))
        );
      }
    } catch (error) {
      console.error('Failed to toggle status:', error);
    } finally {
      setToggling(false);
    }
  };

  if (loading) return <div style={{ padding: '24px', color: 'var(--slate-400)' }}>Loading…</div>;

  return (
    <div>
      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '0',
        borderBottom: '1px solid var(--border)',
        marginBottom: '24px',
      }}>
        <div
          style={{
            padding: '12px 24px',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--navy-900)',
            borderBottom: '2px solid var(--green-600)',
            cursor: 'pointer',
          }}
        >
          Job Listings
        </div>
        <button
          onClick={() => router.push('/admin/careers/applications')}
          style={{
            padding: '12px 24px',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--slate-600)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Applications
        </button>
      </div>

      {/* Job Listings Content */}
      <div style={{ display: 'flex', gap: '0', height: 'calc(100vh - 100px)', background: '#fff' }}>
      {/* List Column */}
      <div
        style={{
          flex: '0 0 380px',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--navy-800)', margin: 0 }}>
              Careers
            </h2>
            <button
              onClick={() => router.push('/admin/careers/new')}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--green-600)',
                color: '#fff',
                border: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
              }}
            >
              + Add
            </button>
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-500)', margin: 0, textTransform: 'uppercase', letterSpacing: '.04em' }}>
            {careers.length} position{careers.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {careers.length === 0 ? (
            <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--slate-500)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
              No careers posted yet
            </div>
          ) : (
            careers.map((career) => (
              <button
                key={career.id}
                onClick={() => setSelectedId(career.id)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--border)',
                  background: selectedId === career.id ? 'var(--navy-50)' : '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                  borderLeft: selectedId === career.id ? '3px solid var(--green-600)' : '3px solid transparent',
                  opacity: career.status === 'DRAFT' ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (selectedId !== career.id) {
                    (e.currentTarget as HTMLElement).style.background = 'var(--slate-50)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedId !== career.id) {
                    (e.currentTarget as HTMLElement).style.background = '#fff';
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--navy-800)' }}>
                    {career.title}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-sm)',
                      background: career.status === 'PUBLISHED' ? 'var(--green-100)' : 'var(--slate-200)',
                      color: career.status === 'PUBLISHED' ? 'var(--green-700)' : 'var(--slate-600)',
                      textTransform: 'uppercase',
                      letterSpacing: '.02em',
                    }}
                  >
                    {career.status}
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-500)', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '.03em' }}>
                  {career.department}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--slate-500)' }}>
                  {career.location}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detail Column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {selected ? (
          <>
            {/* Detail Header */}
            <div
              style={{
                padding: '20px 28px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '24px', color: 'var(--navy-800)', margin: '0 0 6px 0' }}>
                  {selected.title}
                </h2>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                  {selected.department} · {selected.location}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={toggleStatus}
                  disabled={toggling}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: selected.status === 'PUBLISHED' ? 'var(--green-100)' : 'var(--slate-100)',
                    color: selected.status === 'PUBLISHED' ? 'var(--green-700)' : 'var(--slate-600)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: toggling ? 'default' : 'pointer',
                    opacity: toggling ? 0.6 : 1,
                  }}
                >
                  {toggling ? 'Updating…' : selected.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => router.push(`/admin/careers/${selected.id}/edit`)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    background: '#fff',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--slate-600)',
                  }}
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${selected.title}"?`)) {
                      // Handle delete
                    }
                  }}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    background: '#fff',
                    cursor: 'pointer',
                    color: 'var(--slate-400)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                  }}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Detail Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
              {/* Status Indicator */}
              <div style={{ marginBottom: '24px', padding: '12px', borderRadius: 'var(--radius-md)', background: selected.status === 'PUBLISHED' ? 'var(--green-50)' : 'var(--slate-50)', border: `1px solid ${selected.status === 'PUBLISHED' ? 'var(--green-200)' : 'var(--slate-200)'}` }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: selected.status === 'PUBLISHED' ? 'var(--green-700)' : 'var(--slate-600)' }}>
                  Status: {selected.status === 'PUBLISHED' ? '✓ Published' : '● Draft'}
                </div>
              </div>

              {/* Employment Type */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--slate-600)', marginBottom: '8px' }}>
                  Employment Type
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--navy-800)' }}>
                  {selected.employmentType}
                </div>
              </div>

              {/* Location */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--slate-600)', marginBottom: '8px' }}>
                  Location
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--navy-800)' }}>
                  {selected.location}
                </div>
              </div>

              {/* Department */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--slate-600)', marginBottom: '8px' }}>
                  Department
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--navy-800)' }}>
                  {selected.department}
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--slate-600)', marginBottom: '8px' }}>
                  Description
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    color: 'var(--navy-800)',
                    whiteSpace: 'pre-wrap',
                    background: 'var(--slate-50)',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {selected.description}
                </div>
              </div>

              {/* Posted Date */}
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--slate-600)', marginBottom: '8px' }}>
                  Posted Date
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--slate-500)' }}>
                  {new Date(selected.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--slate-500)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
            }}
          >
            Select a career to view details
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
