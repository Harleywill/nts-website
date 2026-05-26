import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DuctWaves from "@/components/common/DuctWaves";
import JobCard from "@/components/careers/JobCard";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Careers - NTS Ltd",
  description:
    "Join the NTS Ltd team. Explore current job openings in HVAC and mechanical services.",
};

export default async function CareersPage() {
  const jobs = await prisma.job.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { applications: true } },
    },
  });

  const jobCount = jobs.length;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 px-6 pt-24 pb-32 sm:py-32 lg:px-8">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <DuctWaves />
          </div>
          <div className="absolute inset-0 -z-10 h-24 bg-gradient-to-b from-gray-900/70 to-transparent pointer-events-none" />
          <div className="mx-auto max-w-4xl text-center">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 border border-emerald-500/35 mb-6">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                {jobCount} {jobCount === 1 ? "open role" : "open roles"}
              </span>
            </div>
            
            <h1 className="text-6xl sm:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
              Build a career,<br />not just a job.
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
              NTS engineers stay with us — fifteen years and counting, on average. Here's why, and where we're hiring next.
            </p>
          </div>
        </section>

        {/* Open Positions */}
        <section className="relative px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-3">
                    Open positions
                  </div>
                  <h2 className="text-5xl font-bold tracking-tight text-gray-900">
                    Currently hiring
                  </h2>
                </div>
                <div className="text-sm text-gray-600 font-mono px-3 py-1.5 border border-gray-300 rounded bg-white">
                  {jobCount} active · updated weekly
                </div>
              </div>
            </div>

            {jobCount > 0 ? (
              <div className="space-y-3 mb-8">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-12 text-center">
                <p className="text-lg text-gray-600 mb-4">
                  No positions currently available. Check back soon!
                </p>
                <p className="text-sm text-gray-500">
                  Or get in touch via our <Link href="/contact" className="text-emerald-500 hover:text-emerald-600 font-medium">contact page</Link>.
                </p>
              </div>
            )}

            {/* Speculative Footer */}
            <div className="mt-8 p-5 bg-white/70 backdrop-blur border border-dashed border-gray-300 rounded-xl flex items-center justify-between gap-6">
              <div>
                <div className="font-semibold text-gray-900">
                  Don't see your role?
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  We're always interested in talented HVAC professionals. Drop us a line.
                </div>
              </div>
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-900 border border-gray-300 bg-white hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                Get in touch →
              </Link>
            </div>
          </div>
        </section>

        {/* Culture / Life at NTS */}
        <section className="relative bg-gray-950 text-white px-6 py-24 sm:py-32 lg:px-8 overflow-hidden">
          {/* Decorative radial gradient */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 via-emerald-500/5 to-transparent" />
          </div>

          <div className="mx-auto max-w-7xl relative">
            <div className="mb-12">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">
                Life at NTS
              </div>
              <h2 className="text-5xl font-bold tracking-tight text-white max-w-2xl">
                A team that's built to last.
              </h2>
              <p className="mt-4 text-lg text-gray-300 max-w-2xl">
                We're a 25-person engineering business in Hull. We do the work properly, we look after each other, and we've been doing it since 1981.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  title: "Work that matters",
                  desc: "Every job we take affects how someone lives or works. We don't cut corners — full stop.",
                },
                {
                  title: "Engineers who grow",
                  desc: "Apprentices become senior engineers here. We invest in qualifications and we promote from within.",
                },
                {
                  title: "A proper team",
                  desc: "Twenty-five people who've actually worked together for years. Nights out, depot lunches, the lot.",
                },
              ].map((value) => (
                <div key={value.title}>
                  <div className="w-11 h-11 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
                    <div className="w-4 h-4 rounded-sm bg-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>

            {/* Benefits Grid */}
            <div className="rounded-2xl p-8 bg-white/5 border border-white/10">
              <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-6">
                What you get
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-7">
                {[
                  ["Pay reviewed annually", "Above-market base salary"],
                  ["Company van + fuel card", "For field engineering roles"],
                  ["Funded qualifications", "We pay for the tickets — F-Gas, Gas Safe, the lot"],
                  ["25 days holiday + bank", "Plus your birthday off if you want it"],
                  ["Pension matched to 6%", "Auto-enrolled from day one"],
                  ["Private healthcare", "For you and your immediate family"],
                  ["Tools provided", "PPE, tablets, and a proper tool kit — yours to keep"],
                  ["Christmas closure", "Office and depot shut between Christmas and New Year"],
                ].map(([title, desc]) => (
                  <div key={title}>
                    <div className="flex items-start gap-2 mb-2">
                      <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-sm font-semibold text-white">{title}</span>
                    </div>
                    <p className="text-xs text-gray-400 ml-6 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
