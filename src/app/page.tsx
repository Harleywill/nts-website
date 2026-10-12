import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroMobile from "@/components/home/HeroMobile";
import HeroDesktop from "@/components/home/HeroDesktop";
import FeaturedNewsCard from "@/components/home/FeaturedNewsCard";
import AccreditationsSection from "@/components/home/AccreditationsSection";
import AboutSection from "@/components/home/AboutSection";
import ServicesBento from "@/components/home/ServicesBento";
import ServicesGrid from "@/components/home/ServicesGrid";
import LatestProjects from "@/components/home/LatestProjects";
import Testimonials from "@/components/home/Testimonials";
import FeaturedNews from "@/components/home/FeaturedNews";
import LiveStats from "@/components/home/LiveStats";
import { getLiveStats } from "@/lib/live-stats";

// The live figures come from the database, so refresh the page every 10 minutes.
export const revalidate = 600;

export default async function Home() {
  const liveStats = await getLiveStats();
  return (
    <div className="flex flex-col min-h-screen "
      
    >
      <Navbar />
      <main className="flex-grow pb-14 md:pb-0">
        {/* Hero: Mobile version with 2 buttons vs Desktop version with stats and links */}
        <div className="block md:hidden">
          <HeroMobile />
        </div>
        <div className="hidden md:block">
          <HeroDesktop liveStats={liveStats} />
        </div>

        {/* Featured News Card - Below Hero */}
        <FeaturedNewsCard />

        {/* On desktop the live figures sit in the hero; phones have no hero stats, so they get the strip. */}
        <div className="block md:hidden">
          <LiveStats />
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
