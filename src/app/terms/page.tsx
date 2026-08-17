import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import DuctWaves from "@/components/common/DuctWaves";
import LegalList from "@/components/common/LegalList";
import { TERMS_SECTIONS, TERMS_INTRO, TERMS_LAST_UPDATED } from "@/lib/terms-content";

export const metadata = {
  title: "Terms of Service - NTS Ltd",
  description: "Our terms of service and conditions of use.",
};

const PDF_URL = "/documents/nts-terms-of-service.pdf";

export default function Terms() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 px-6 pt-28 pb-20 lg:px-8">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <DuctWaves opacity={0.5} showPulses={false} />
          </div>
          <div className="mx-auto max-w-3xl text-center">
            <span
              className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white"
              style={{ backgroundColor: "#4caf50" }}
            >
              Legal
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Terms of Service
            </h1>
            <p className="mt-5 text-lg text-gray-300 leading-relaxed">
              {TERMS_INTRO}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <span className="inline-flex items-center gap-2 text-sm text-gray-400">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#4caf50" }} />
                Last updated: {TERMS_LAST_UPDATED}
              </span>
              <a
                href={PDF_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
                style={{ backgroundColor: "#4caf50" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v6.638l1.96-2.158a.75.75 0 1 1 1.11 1.01l-3.25 3.575a.75.75 0 0 1-1.11 0L6.22 9.24a.75.75 0 1 1 1.11-1.01l1.96 2.158V3.75A.75.75 0 0 1 10 3Z" clipRule="evenodd" />
                  <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                </svg>
                Download PDF
              </a>
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="px-6 py-16 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[240px_1fr] lg:gap-14">
            {/* Sticky table of contents */}
            <aside className="hidden lg:block">
              <nav className="sticky top-24">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
                  On this page
                </p>
                <ol className="space-y-2.5 border-l border-gray-200">
                  {TERMS_SECTIONS.map((section, i) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="block -ml-px border-l-2 border-transparent pl-4 text-sm text-gray-500 transition-colors hover:border-brand-green-500 hover:text-brand-green-600"
                      >
                        {i + 1}. {section.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            {/* Content */}
            <div className="mt-12 lg:mt-0 max-w-3xl">
              {TERMS_SECTIONS.map((section, i) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 border-b border-gray-100 pb-10 mb-10 last:border-b-0"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <span
                      className="flex h-9 w-9 flex-none items-center justify-center rounded-lg text-sm font-bold text-white"
                      style={{ backgroundColor: "#1a2f6e" }}
                    >
                      {i + 1}
                    </span>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                      {section.heading}
                    </h2>
                  </div>

                  {section.paragraphs?.map((para, j) => (
                    <p key={j} className="text-gray-600 leading-relaxed mb-4">
                      {para}
                    </p>
                  ))}

                  {section.list && <LegalList items={section.list} />}
                </section>
              ))}

              {/* Privacy link */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="font-semibold text-gray-900">Looking for our Privacy Policy?</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Learn how we collect, use, and protect your information.
                  </p>
                </div>
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-2 text-brand-green-600 hover:text-green-700 font-semibold whitespace-nowrap"
                >
                  View Privacy Policy →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
