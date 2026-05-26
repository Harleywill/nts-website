import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/home/Contact";
import DuctWaves from "@/components/common/DuctWaves";

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
            <DuctWaves />
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
