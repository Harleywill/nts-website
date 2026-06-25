'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const STATUS_CONFIG: Record<string, { label: string; description: string; color: string; bg: string; step: number }> = {
  NEW:       { label: 'Received',  description: 'We have received your application and it is in our queue for review.', color: '#1a2f6e', bg: '#EEF4FA', step: 1 },
  REVIEWING: { label: 'Reviewing', description: 'A member of our team is currently reviewing your application.', color: '#854D0E', bg: '#FEF9C3', step: 2 },
  INTERVIEW: { label: 'Interview', description: 'Great news — we would like to invite you for an interview. We will be in touch shortly.', color: '#1E40AF', bg: '#DBEAFE', step: 3 },
  OFFER:     { label: 'Offer',     description: 'We are preparing an offer for you. Expect to hear from us very soon.', color: '#166534', bg: '#DCFCE7', step: 4 },
  HIRED:     { label: 'Hired',     description: 'Welcome to the team! We look forward to working with you.', color: '#166534', bg: '#DCFCE7', step: 5 },
  REJECTED:  { label: 'Unsuccessful', description: 'Unfortunately on this occasion your application has been unsuccessful. We encourage you to apply again in the future.', color: '#991B1B', bg: '#FEE2E2', step: 0 },
};

const PIPELINE = ['NEW', 'REVIEWING', 'INTERVIEW', 'OFFER', 'HIRED'];

interface TrackResult {
  reference: string;
  fullName: string;
  status: string;
  submittedAt: string;
  updatedAt: string;
  job: { title: string; location: string; department: string };
}

function TrackContent() {
  const searchParams = useSearchParams();
  const [reference, setReference] = useState(searchParams.get('ref') ?? '');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(
        `/api/careers/track?ref=${encodeURIComponent(reference.trim().toUpperCase())}&email=${encodeURIComponent(email.trim())}`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please check your details and try again.');
      } else {
        setResult(data);
      }
    } catch {
      setError('Unable to reach the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const cfg = result ? (STATUS_CONFIG[result.status] ?? STATUS_CONFIG['NEW']) : null;
  const currentStep = cfg?.step ?? 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50 px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-2xl">

          {/* Header */}
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
              NTS Ltd
            </p>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Track your application
            </h1>
            <p className="text-gray-500 text-base">
              Enter your reference number and the email address you applied with.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm mb-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="reference" className="block text-sm font-semibold text-gray-700 mb-2">
                  Application reference
                </label>
                <input
                  id="reference"
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. APP-2026-001"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="The email you applied with"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              {error && (
                <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-colors disabled:opacity-60"
              >
                {loading ? 'Checking…' : 'Check status'}
              </button>
            </form>
          </div>

          {/* Result */}
          {result && cfg && (
            <div className="space-y-4">
              {/* Status card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
                      Application status
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900">{result.fullName}</h2>
                    <p className="text-sm text-gray-500 mt-1">{result.job.title} · {result.job.location}</p>
                  </div>
                  <span
                    className="inline-block px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide"
                    style={{ background: cfg.bg, color: cfg.color }}
                  >
                    {cfg.label}
                  </span>
                </div>

                {/* Progress pipeline — hide for rejected */}
                {result.status !== 'REJECTED' && (
                  <div className="mb-6">
                    <div className="flex items-center gap-0">
                      {PIPELINE.map((step, i) => {
                        const stepCfg = STATUS_CONFIG[step];
                        const isComplete = stepCfg.step < currentStep;
                        const isCurrent = stepCfg.step === currentStep;
                        const isLast = i === PIPELINE.length - 1;
                        return (
                          <div key={step} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all"
                                style={{
                                  background: isComplete || isCurrent ? '#4caf50' : '#e5e7eb',
                                  color: isComplete || isCurrent ? '#fff' : '#9ca3af',
                                  boxShadow: isCurrent ? '0 0 0 3px #bbf7d0' : 'none',
                                }}
                              >
                                {isComplete ? '✓' : i + 1}
                              </div>
                              <span className="text-xs text-center text-gray-500 leading-tight px-1" style={{ fontWeight: isCurrent ? 700 : 400, color: isCurrent ? '#1a2f6e' : '#6b7280' }}>
                                {stepCfg.label}
                              </span>
                            </div>
                            {!isLast && (
                              <div className="h-0.5 flex-none w-4 mb-4" style={{ background: isComplete ? '#4caf50' : '#e5e7eb' }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Status message */}
                <div
                  className="rounded-xl px-5 py-4 text-sm"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  {cfg.description}
                </div>
              </div>

              {/* Meta info */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Reference</p>
                    <p className="font-mono font-bold text-gray-900">{result.reference}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Submitted</p>
                    <p className="text-gray-700">{new Date(result.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Last updated</p>
                    <p className="text-gray-700">{new Date(result.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Department</p>
                    <p className="text-gray-700">{result.job.department}</p>
                  </div>
                </div>
              </div>

              {/* Help */}
              <div className="px-5 py-4 border border-dashed border-gray-300 rounded-xl bg-gray-50 text-center">
                <p className="text-xs text-gray-500">
                  Questions?{' '}
                  <a href="mailto:info@nevilletuckerservices.co.uk" className="text-green-600 font-semibold hover:underline">
                    Email info@nevilletuckerservices.co.uk
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="mt-8 text-center">
            <Link href="/careers" className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to careers
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense>
      <TrackContent />
    </Suspense>
  );
}
