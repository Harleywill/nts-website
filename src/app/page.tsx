import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroMobile from "@/components/home/HeroMobile";
import HeroDesktop from "@/components/home/HeroDesktop";
import AboutSection from "@/components/home/AboutSection";
import ServicesBento from "@/components/home/ServicesBento";
import ServicesGrid from "@/components/home/ServicesGrid";
import AccreditationsSection from "@/components/home/AccreditationsSection";
import LatestProjects from "@/components/home/LatestProjects";
import Testimonials from "@/components/home/Testimonials";
import FeaturedNews from "@/components/home/FeaturedNews";

export default function Home() {
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
      <main className="flex-grow pb-14 md:pb-0">
        {/* Hero: Mobile version with 2 buttons vs Desktop version with stats and links */}
        <div className="block md:hidden">
          <HeroMobile />
        </div>
        <div className="hidden md:block">
          <HeroDesktop />
        </div>
        <AccreditationsSection />
        <AboutSection />
        {/* Services: Bento layout on mobile, Grid on desktop */}
        <div className="block md:hidden">
          <ServicesBento />
        </div>
        <div className="hidden md:block">
          <ServicesGrid />
        </div>
        <LatestProjects />
        <Testimonials />
        <FeaturedNews />
      </main>
      <Footer />
    </div>
  );
}
