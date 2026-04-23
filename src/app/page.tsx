import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";
import ServicesBento from "@/components/home/ServicesBento";
import AccreditationsStrip from "@/components/home/AccreditationsStrip";
import LatestProjects from "@/components/home/LatestProjects";
import Testimonials from "@/components/home/Testimonials";
import QuickEnquiry from "@/components/home/QuickEnquiry";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <AboutSection />
        <ServicesBento />
        <AccreditationsStrip />
        <LatestProjects />
        <Testimonials />
        <QuickEnquiry />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
