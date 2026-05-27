"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("ref") || "REF-NOT-FOUND";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50 px-6 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Checkmark Icon with Radial Gradient Halo */}
          <div className="mb-10 relative inline-flex items-center justify-center">
            {/* Radial gradient halo */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent blur-2xl w-32 h-32 -inset-8" />
            {/* Checkmark circle */}
            <div className="relative inline-flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 border-4 border-emerald-500">
              <svg
                className="h-10 w-10 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <polyline points="20 6 9 17 4 12" strokeWidth="2.5" />
              </svg>
            </div>
          </div>

          {/* Message */}
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">
            Application received
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Thanks for applying.
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            We've received your application and will review it carefully. You'll hear from us soon.
          </p>

          {/* Reference Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8 shadow-sm">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">
              Your application reference
            </p>
            <p className="text-3xl font-mono font-bold text-gray-900 break-all mb-3">
              {reference}
            </p>
            <p className="text-xs text-gray-500">
              Keep this reference number for your records
            </p>
          </div>

          {/* What Happens Now */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-12 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-8">
              What happens now
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl mb-2">📧</div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Confirmation
                </p>
                <p className="text-xs text-gray-600">
                  Email with your reference number
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">👀</div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Review
                </p>
                <p className="text-xs text-gray-600">
                  We'll check your application within 5 days
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📞</div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  We get back
                </p>
                <p className="text-xs text-gray-600">
                  If it's a fit, we'll call you to chat
                </p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/careers"
              className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 font-semibold transition-colors inline-block"
            >
              Browse other roles
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-semibold transition-colors inline-block"
            >
              Back to home
            </Link>
          </div>

          {/* Footer Note */}
          <div className="px-6 py-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
            <p className="text-xs text-gray-600">
              Want to update something or withdraw?{" "}
              <a
                href="mailto:info@nt.services"
                className="text-emerald-500 font-semibold hover:underline"
              >
                Email us at info@nt.services
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
