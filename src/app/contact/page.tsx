import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/home/Contact";

export const metadata = {
  title: "Contact - NTS Ltd",
  description: "Get in touch with NTS Ltd for your HVAC and mechanical service needs.",
};

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen bg-white"
      style={{
        backgroundColor: '#ffffff',
        backgroundImage: `
          conic-gradient(from 90deg at 1px 1px, #0000 25%, #e0e0e0 0),
          linear-gradient(45deg, #0000 calc(50% - 0.5px), #e0e0e0 0 calc(50% + 0.5px), #0000 0),
          linear-gradient(-45deg, #0000 calc(50% - 0.5px), #e0e0e0 0 calc(50% + 0.5px), #0000 0)
        `,
        backgroundSize: '1em 1em, 2em 2em, 2em 2em',
        backgroundPosition: '-0.5px -0.5px, 0 0, 0 0'
      }}
    >
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 px-6 pt-24 pb-24 sm:py-32 lg:px-8 lg:pt-24 min-h-[550px] flex items-center">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <svg aria-hidden="true" className="absolute top-0 left-[max(50%,25rem)] h-256 w-512 -translate-x-1/2 mask-[radial-gradient(64rem_64rem_at_top,white,transparent)] stroke-gray-800">
              <defs>
                <pattern id="pattern-contact" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
                  <path d="M100 200V.5M.5 .5H200" fill="none" />
                </pattern>
              </defs>
              <svg x="50%" y="-1" className="overflow-visible fill-gray-800/50">
                <path d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z" strokeWidth="0" />
              </svg>
              <rect width="100%" height="100%" fill="url(#pattern-contact)" strokeWidth="0" />
            </svg>
          </div>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Get In Touch
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Contact us today for a free consultation or quote
            </p>
          </div>
        </section>

        {/* Contact Form */}
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
