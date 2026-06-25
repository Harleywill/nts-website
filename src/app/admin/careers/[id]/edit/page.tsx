'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface JobFormData {
  title: string;
  department: string;
  location: string;
  employmentType: string;
  salaryRange: string;
  experience: string;
  closesAt: string;
  description: string;
  responsibilities: string;
  requirements: string;
  status: string;
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  color: 'var(--navy-900)',
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box' as const,
};

const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '.04em',
  color: 'var(--slate-600)',
  marginBottom: '6px',
};

const sectionStyle = {
  background: '#fff',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '18px',
};

const sectionHeadingStyle = {
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  fontSize: '15px',
  color: 'var(--navy-900)',
  margin: '0 0 4px 0',
  paddingBottom: '12px',
  borderBottom: '1px solid var(--border)',
};

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [jobId, setJobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    department: '',
    location: '',
    employmentType: 'FULL_TIME',
    salaryRange: '',
    experience: '',
    closesAt: '',
    description: '',
    responsibilities: '',
    requirements: '',
    status: 'DRAFT',
  });

  useEffect(() => {
    params.then(({ id }) => setJobId(id));
  }, [params]);

  useEffect(() => {
    if (!jobId) return;
    fetch(`/api/admin/jobs/${jobId}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setFormData({
          title: data.title || '',
          department: data.department || '',
          location: data.location || '',
          employmentType: data.employmentType || 'FULL_TIME',
          salaryRange: data.salaryRange || '',
          experience: data.experience || '',
          closesAt: data.closesAt ? new Date(data.closesAt).toISOString().split('T')[0] : '',
          description: data.description || '',
          responsibilities: data.responsibilities || '',
          requirements: data.requirements || '',
          status: data.status || 'DRAFT',
        });
      })
      .catch(() => setError('Failed to load job'))
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to update job');
        setSubmitting(false);
        return;
      }

      router.push('/admin/careers');
    } catch {
      setError('An error occurred. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '24px', color: 'var(--slate-400)' }}>Loading…</div>;

  return (
    <div style={{ maxWidth: '800px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <button
          onClick={() => router.push('/admin/careers')}
          style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--slate-500)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '12px' }}
        >
          ← Back to Careers
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '28px', color: 'var(--navy-900)', margin: 0 }}>
          Edit Job
        </h1>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#dc2626', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Basic Info */}
        <div style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>Basic Information</h2>

          <div>
            <label style={labelStyle}>Job Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Department *</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Location *</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Employment Type *</label>
              <select name="employmentType" value={formData.employmentType} onChange={handleChange} style={inputStyle}>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="TEMPORARY">Temporary</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Salary Range</label>
              <input type="text" name="salaryRange" value={formData.salaryRange} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Experience Required</label>
              <input type="text" name="experience" value={formData.experience} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Closing Date *</label>
              <input type="date" name="closesAt" value={formData.closesAt} onChange={handleChange} required style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>Job Description</h2>
          <div>
            <label style={labelStyle}>Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows={5} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
        </div>

        {/* Responsibilities & Requirements */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>Responsibilities</h2>
            <textarea name="responsibilities" value={formData.responsibilities} onChange={handleChange} rows={7} style={{ ...inputStyle, resize: 'vertical', fontSize: '13px' }} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--slate-400)', margin: 0 }}>One item per line</p>
          </div>
          <div style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>Requirements</h2>
            <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows={7} style={{ ...inputStyle, resize: 'vertical', fontSize: '13px' }} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--slate-400)', margin: 0 }}>One item per line</p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', paddingBottom: '40px' }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '10px 28px',
              background: 'var(--green-600)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: submitting ? 'default' : 'pointer',
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? 'Saving…' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/careers')}
            style={{
              padding: '10px 24px',
              background: '#fff',
              color: 'var(--slate-600)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
