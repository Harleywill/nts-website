'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/jobs', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create job');
        setLoading(false);
        return;
      }

      router.push('/admin/careers');
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

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
          Post New Job
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

          {/* Title */}
          <div>
            <label style={labelStyle}>Job Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required style={inputStyle} placeholder="e.g. Senior HVAC Technician" />
          </div>

          {/* Department & Location */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Department *</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} required style={inputStyle} placeholder="e.g. HVAC" />
            </div>
            <div>
              <label style={labelStyle}>Location *</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required style={inputStyle} placeholder="e.g. Hull, UK" />
            </div>
          </div>

          {/* Employment Type & Salary */}
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
              <input type="text" name="salaryRange" value={formData.salaryRange} onChange={handleChange} style={inputStyle} placeholder="e.g. £25,000 – £35,000" />
            </div>
          </div>

          {/* Experience & Closing Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Experience Required</label>
              <input type="text" name="experience" value={formData.experience} onChange={handleChange} style={inputStyle} placeholder="e.g. 3+ years" />
            </div>
            <div>
              <label style={labelStyle}>Closing Date *</label>
              <input type="date" name="closesAt" value={formData.closesAt} onChange={handleChange} required style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>Job Description</h2>
          <div>
            <label style={labelStyle}>Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows={5} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Write a comprehensive description of the role…" />
          </div>
        </div>

        {/* Responsibilities & Requirements */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>Responsibilities</h2>
            <textarea name="responsibilities" value={formData.responsibilities} onChange={handleChange} rows={7} style={{ ...inputStyle, resize: 'vertical', fontSize: '13px' }} placeholder="One responsibility per line…" />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--slate-400)', margin: 0 }}>One item per line</p>
          </div>
          <div style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>Requirements</h2>
            <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows={7} style={{ ...inputStyle, resize: 'vertical', fontSize: '13px' }} placeholder="One requirement per line…" />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--slate-400)', margin: 0 }}>One item per line</p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', paddingBottom: '40px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 28px',
              background: 'var(--green-600)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Creating…' : 'Create Job'}
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
