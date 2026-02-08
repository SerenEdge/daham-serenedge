import Hero from "@/components/Hero";
import RealMe from "@/components/RealMe";
import Portfolio from "@/components/Portfolio";
import ResumeSection from "@/components/ResumeSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans w-full">
      <Hero />
      <RealMe />
      <Portfolio />
      <ResumeSection />
    </main>
  );
}
