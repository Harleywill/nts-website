import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Gallery - NTS Ltd",
  description: "View our gallery of installations, projects, and team in action.",
};

export default function Gallery() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 px-6 py-32 sm:py-40 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Our Gallery
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              See Our Work in Action
            </p>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Gallery Coming Soon
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We're building our photo gallery to showcase our installations and projects. Check back soon to see our team's work.
            </p>
            <a
              href="/"
              className="rounded-md px-6 py-3 font-semibold text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: "#4caf50" }}
            >
              Return Home
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
