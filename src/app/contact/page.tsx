import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/home/Contact";
import DuctWaves from "@/components/common/DuctWaves";
import ContactInfoCards from "@/components/contact/ContactInfoCards";

export const metadata = {
  title: "Contact - NTS Ltd",
  description:
    "Get in touch with NTS Ltd for your HVAC and mechanical service needs.",
};

export default function Contact() {
  return (
    // No backgroundImage / bg-white — the site-wide <EngineeringBackground />
    // (mounted in layout.tsx) shows through transparent sections.
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* ====================================================
            HERO — dark gradient + DuctWaves animation
            ==================================================== */}
        <section className="relative isolate flex min-h-[560px] items-center overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 px-6 pt-24 pb-32 sm:py-32 sm:pb-36 lg:px-8 lg:pt-24">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <DuctWaves />
          </div>

          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#4caf50]/35 bg-[#4caf50]/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#a5d6a7]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4caf50] shadow-[0_0_8px_#4caf50]" />
              Available — replies within 24h
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Get In Touch
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Contact us today for a free consultation or quote — our engineers
              will scope out the work with no obligation.
            </p>
          </div>
        </section>

        {/* ====================================================
            FLOATING CONTACT CARDS — overlap hero bottom edge
            ==================================================== */}
        <ContactInfoCards />

        {/* ====================================================
            FORM SECTION — two columns, watermark shows through
            ==================================================== */}
        <section className="relative px-6 py-24 lg:px-8">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 lg:grid-cols-[1fr_1.4fr] lg:items-start">
            {/* LEFT: intro + stats + accreditations — in white card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-[0_20px_60px_rgba(13,21,48,0.08)]">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#4caf50]">
                Contact form
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0d1530] sm:text-4xl">
                Send us the details, we&apos;ll handle the rest.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-600">
                Whether you need a one-off ventilation survey or a full
                commercial HVAC programme, our engineers are ready to scope it
                out with you. No obligation, no hard sell.
              </p>

              {/* Stats card */}
              <div className="mt-8 rounded-2xl bg-gradient-to-br from-[#0d1530] to-[#1a2f6e] p-6 text-white">
                <div className="mb-4 text-sm font-semibold opacity-85">
                  Trusted by businesses across Yorkshire
                </div>
                <div className="grid grid-cols-2 gap-5">
                  {[
                    ["45+", "Years in Business"],
                    ["3000+", "Projects Completed"],
                    ["25+", "Qualified Engineers"],
                    ["Always", "24/7 Support"],
                  ].map(([v, k]) => (
                    <div key={k}>
                      <div className="text-2xl font-extrabold tracking-tight text-[#4caf50]">
                        {v}
                      </div>
                      <div className="mt-0.5 text-xs opacity-70">{k}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accreditation strip */}
              <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white/60 p-3 backdrop-blur-sm">
                {["Gas Safe", "F-Gas", "CHAS", "SafeContractor"].map((b) => (
                  <div
                    key={b}
                    className="rounded-md bg-gray-100 px-2.5 py-1.5 text-[10px] font-semibold tracking-wide text-gray-700"
                  >
                    {b}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Trust message, call button, and ContactForm */}
            <div className="space-y-6">
              {/* Trust Message */}
              <div className="rounded-lg border-l-4 border-[#4caf50] bg-[#f0f9ff] p-4">
                <p className="flex items-center gap-2 font-medium text-gray-700">
                  <span className="text-[#4caf50] text-xl">✓</span>
                  We respond within 24 hours
                </p>
              </div>

              {/* Large Call Button */}
              <div className="text-center">
                <a
                  href="tel:01482838080"
                  className="inline-block rounded-lg bg-[#4caf50] px-8 py-4 font-bold text-lg text-white transition-colors hover:bg-green-700"
                >
                  📞 Call Now: 01482 838080
                </a>
              </div>

              {/* Contact Form */}
              <div className="rounded-2xl border border-gray-200 bg-white p-1 shadow-[0_20px_60px_rgba(13,21,48,0.08)]">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
