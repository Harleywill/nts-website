import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SAMPLE_TESTIMONIALS } from "@/lib/constants";
import { FaStar } from "react-icons/fa";

export const metadata = {
  title: "Testimonials - NTS Ltd",
  description: "Read what our satisfied customers say about our HVAC and mechanical services.",
};

export default function Testimonials() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 px-6 py-32 sm:py-40 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              What Our Clients Say
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Real feedback from satisfied customers across the UK
            </p>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {SAMPLE_TESTIMONIALS.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex flex-col rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} size={16} style={{ color: "#4caf50" }} />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
                    "{testimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="border-t border-gray-200 pt-4">
                    <p className="font-semibold text-gray-900" style={{ color: "#1a2f6e" }}>
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-16 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Ready to Experience Our Service?
              </h2>
              <a
                href="/contact"
                className="rounded-md px-8 py-3 font-semibold text-white transition-colors hover:opacity-90 inline-block"
                style={{ backgroundColor: "#4caf50" }}
              >
                Get in Touch Today
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
