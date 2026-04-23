import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service - NTS Ltd",
  description: "Our terms of service and conditions of use.",
};

export default function Terms() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 px-6 py-32 sm:py-40 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Terms of Service
            </h1>
          </div>
        </section>

        {/* Content Section */}
        <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="prose prose-lg prose-gray max-w-none">
              <p>
                Last updated: {new Date().getFullYear()}
              </p>

              <h2>Introduction</h2>
              <p>
                These Terms of Service ("Terms") constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and NTS Ltd ("we," "us," or "our"), concerning your access to and use of the website as well as any other media form, media channel, mobile website, or mobile application relating, linked, or otherwise connected thereto (collectively, the "Service").
              </p>

              <h2>Agreement to Terms</h2>
              <p>
                You agree that by accessing the Service, you have read, understood, and agree to be bound by all of these Terms of Service. If you do not agree with our Terms of Service, then you may not access and use the Service.
              </p>

              <h2>Intellectual Property Rights</h2>
              <p>
                Unless otherwise indicated, the Service is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Service (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
              </p>

              <h2>User Representations</h2>
              <p>
                By using the Service, you represent and warrant that:
              </p>
              <ul>
                <li>You have the legal capacity and you agree to comply with these Terms of Service</li>
                <li>You are not a minor in the jurisdiction in which you reside</li>
                <li>You will not access the Service through automated or non-human means</li>
                <li>You will not use the Service for any illegal or unauthorized purpose</li>
              </ul>

              <h2>User Content</h2>
              <p>
                You retain all rights to any content you submit, post or display on or through the Service. By submitting, posting or displaying content on or through the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate, and distribute it in any media.
              </p>

              <h2>Prohibited Activities</h2>
              <p>
                You may not access or use the Service for any purpose other than that for which we make the Service available. The Service may not be used in connection with any commercial endeavors except those specifically endorsed or approved by us.
              </p>

              <h2>Limitation of Liability</h2>
              <p>
                In no event shall NTS Ltd, nor its directors, employees, or agents, be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of or inability to use the materials on the Service.
              </p>

              <h2>Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless NTS Ltd and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses.
              </p>

              <h2>Modifications and Interruptions</h2>
              <p>
                We reserve the right to modify or discontinue, temporarily or permanently, the Service or any service to which it connects, with or without notice and without liability to you.
              </p>

              <h2>Governing Law</h2>
              <p>
                These Terms and Conditions are governed by and construed in accordance with the laws of the United Kingdom, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
              </p>

              <h2>Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <ul>
                <li>Email: info@ntsltd.co.uk</li>
                <li>Phone: 01482 838080</li>
              </ul>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <Link href="/privacy" className="text-green-600 hover:text-green-700 font-semibold">
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
