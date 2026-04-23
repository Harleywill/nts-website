import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutPageContent from "@/components/about/AboutPageContent";

export const metadata = {
  title: "About NTS Ltd",
  description: "Learn about NTS Ltd, our values, team, and commitment to excellence in HVAC and mechanical services.",
};

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        <AboutPageContent />
      </main>
      <Footer />
    </div>
  );
}
