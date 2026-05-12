import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";
import ServicesBento from "@/components/home/ServicesBento";
import ServicesGrid from "@/components/home/ServicesGrid";
import AccreditationsStrip from "@/components/home/AccreditationsStrip";
import LatestProjects from "@/components/home/LatestProjects";
import Testimonials from "@/components/home/Testimonials";
import FeaturedNews from "@/components/home/FeaturedNews";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <AboutSection />
        {/* Mobile: ServicesBento (dark, interactive). Desktop/Tablet: ServicesGrid (light, static) */}
        <div className="block md:hidden">
          <ServicesBento />
        </div>
        <div className="hidden md:block">
          <ServicesGrid />
        </div>
        <AccreditationsStrip />
        <LatestProjects />
        <Testimonials />
        <FeaturedNews />
      </main>
      <Footer />
    </div>
  );
}
