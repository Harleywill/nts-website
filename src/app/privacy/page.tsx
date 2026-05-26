import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import DuctWaves from "@/components/common/DuctWaves";

export const metadata = {
  title: "Privacy Policy - NTS Ltd",
  description: "Our privacy policy and data protection information.",
};

export default function Privacy() {
  return (
    <div className="flex flex-col min-h-screen ">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 px-6 pt-24 pb-24 sm:py-32 lg:px-8 lg:pt-24 min-h-[550px] flex items-center">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <DuctWaves opacity={0.5} showPulses={false} />
          </div>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Privacy Policy
            </h1>
          </div>
        </section>

        {/* Content Section */}
        <section className="relative isolate overflow-hidden  px-6 py-24 sm:py-32 lg:px-8"
          
        >
          <div className="mx-auto max-w-3xl">
            <div className="prose prose-lg prose-gray max-w-none">
              <p>
                Last updated: {new Date().getFullYear()}
              </p>

              <h2>Introduction</h2>
              <p>
                NTS Ltd ("we," "us," or "our") operates this website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service and the choices you have associated with that data.
              </p>

              <h2>Information Collection and Use</h2>
              <p>
                We collect several different types of information for various purposes to provide and improve our service to you.
              </p>

              <h3>Types of Data Collected:</h3>
              <ul>
                <li><strong>Personal Data:</strong> While using our service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include:
                  <ul>
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Address</li>
                    <li>Cookies and Usage Data</li>
                  </ul>
                </li>
                <li><strong>Usage Data:</strong> We may also collect information about how the service is accessed and used ("Usage Data"). This may include information such as your computer's IP address, browser type, browser version, the pages you visit, and other diagnostic data.</li>
              </ul>

              <h2>Use of Data</h2>
              <p>
                NTS Ltd uses the collected data for various purposes:
              </p>
              <ul>
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To allow you to participate in interactive features of our service when you choose to do so</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information so that we can improve our service</li>
                <li>To monitor the usage of our service</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>

              <h2>Security of Data</h2>
              <p>
                The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
              </p>

              <h2>Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <ul>
                <li>Email: info@ntsltd.co.uk</li>
                <li>Phone: 01482 838080</li>
              </ul>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <Link href="/terms" className="text-green-600 hover:text-green-700 font-semibold">
                  View Terms of Service →
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
