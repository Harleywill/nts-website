import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroMobile from "@/components/home/HeroMobile";
import HeroDesktop from "@/components/home/HeroDesktop";
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
      <main className="flex-grow pb-14 md:pb-0">
        {/* Hero: Mobile version with 2 buttons vs Desktop version with stats and links */}
        <div className="block md:hidden">
          <HeroMobile />
        </div>
        <div className="hidden md:block">
          <HeroDesktop />
        </div>
        <AboutSection />
        {/* Services: Bento layout on mobile, Grid on desktop */}
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
