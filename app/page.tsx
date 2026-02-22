import Hero from "@/components/Hero";
import RealMe from "@/components/RealMe";
import Portfolio from "@/components/Portfolio";
import DevPulseCard from "@/components/DevPulseCard";
import ResumeSection from "@/components/ResumeSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans w-full flex flex-col">
      <div className="flex-grow">
        <Hero />
        <RealMe />
        <Portfolio pulseCard={<DevPulseCard username="DahamDissanayake" />} />
        <ResumeSection />
      </div>

      <Footer />
    </main>
  );
}
