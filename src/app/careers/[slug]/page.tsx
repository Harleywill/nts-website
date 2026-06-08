import Link from "next/link";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DuctWaves from "@/components/common/DuctWaves";
import { ApplyButton } from "@/components/careers/ApplyButton";

interface JobDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: JobDetailPageProps) {
  const { slug } = await params;
  const job = await prisma.job.findUnique({
    where: { slug },
  });

  if (!job) {
    return { title: "Job Not Found - NTS Ltd" };
  }

  return {
    title: `${job.title} - Careers - NTS Ltd`,
    description: `Apply for the ${job.title} position at NTS Ltd`,
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params;

  const job = await prisma.job.findUnique({
    where: { slug },
  });

  if (!job || job.status !== "PUBLISHED") {
    notFound();
  }

  const responsibilities = job.responsibilities
    .split("\n")
    .filter((r) => r.trim());
  const requirements = job.requirements.split("\n").filter((r) => r.trim());

  const isApplicationOpen = new Date(job.closesAt) > new Date();
  const closesDate = new Date(job.closesAt).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 px-6 pt-24 pb-14 sm:py-20 lg:px-8">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <DuctWaves />
          </div>
          <div className="absolute inset-0 -z-10 h-24 bg-gradient-to-b from-gray-900/70 to-transparent pointer-events-none" />

          <div className="mx-auto max-w-7xl relative">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-5">
              <Link href="/careers" className="hover:text-gray-300">Careers</Link>
              <span>/</span>
              <span className="text-white">{job.title}</span>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Department + Status */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#4caf50' }}>
                    {job.department}
                  </span>
                  <span className="px-3 py-1 rounded-full border text-xs font-semibold" style={{ backgroundColor: 'rgba(76, 175, 80, 0.15)', borderColor: 'rgba(76, 175, 80, 0.3)', color: '#4caf50' }}>
                    Accepting applications
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white leading-tight mb-8" style={{ letterSpacing: '-0.02em' }}>
                  {job.title}
                </h1>

                {/* Meta Pills */}
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "LOCATION", value: job.location },
                    { label: "TYPE", value: job.employmentType.replace(/_/g, " ") },
                    job.salaryRange ? { label: "SALARY", value: job.salaryRange } : null,
                    job.experience ? { label: "EXPERIENCE", value: job.experience } : null,
                    { label: "CLOSES", value: closesDate },
                  ]
                    .filter(Boolean)
                    .map((meta) => meta && (
                      <div
                        key={meta.label}
                        className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur"
                      >
                        <div className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(76, 175, 80, 0.85)' }}>
                          {meta.label}
                        </div>
                        <div className="text-sm font-semibold text-white">
                          {meta.value}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Right Column CTA */}
              <div>
                <ApplyButton slug={slug} isOpen={isApplicationOpen} closesDate={closesDate} />
              </div>
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="relative px-6 py-20 sm:py-24 lg:px-8 bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-[1fr_340px] gap-12 lg:gap-16">
              {/* Content */}
              <div className="space-y-12">
                {/* About the Role */}
                <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 About the role
                  </h2>
                  <div className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap space-y-4">
                    {job.description}
                  </div>
                </div>

                {/* What You'll Do */}
                {responsibilities.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">✓ What you'll do
                    </h2>
                    <ul className="space-y-3">
                      {responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-4">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full text-white flex-shrink-0 mt-0.5 font-bold text-sm" style={{ backgroundColor: '#4caf50' }}>
                            ✓
                          </span>
                          <span className="text-base text-gray-700 leading-relaxed">
                            {resp}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* What We're Looking For */}
                {requirements.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 What we're looking for
                    </h2>
                    <ul className="space-y-3">
                      {requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-4">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full text-white flex-shrink-0 mt-0.5 font-bold text-sm" style={{ backgroundColor: '#4caf50' }}>
                            ✓
                          </span>
                          <span className="text-base text-gray-700 leading-relaxed">
                            {req}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Accessibility Callout */}
                <div className="p-6 bg-white border border-gray-200 rounded-xl flex items-start gap-4">
                  <span className="text-2xl flex-shrink-0">♿</span>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    NTS Ltd is committed to equal opportunities. If you need adjustments at any stage of the application process, just let us know on the form or call us on 01482 838080.
                  </p>
                </div>
              </div>

              {/* Sticky Sidebar */}
              <aside className="lg:sticky lg:top-6 space-y-6">
                {/* Apply Card */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <ApplyButton slug={slug} isOpen={isApplicationOpen} closesDate={closesDate} />
                </div>

                {/* Closes Date Card */}
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <p className="text-xs font-semibold text-amber-900 uppercase tracking-wider mb-1">
                    Closing date
                  </p>
                  <p className="text-sm font-semibold text-amber-900">
                    {closesDate}
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
