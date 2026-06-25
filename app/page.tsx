import type { Metadata } from "next";
import Hero from "@/components/Hero";
import RealMe from "@/components/RealMe";
import Portfolio from "@/components/Portfolio";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Daham Dissanayake | Full Stack Developer & CS Undergraduate",
  description: "Portfolio of Daham Dissanayake — Computer Science Undergraduate at IIT Sri Lanka, Full Stack Developer, and IoT Enthusiast. Explore projects in web development, machine learning, and embedded systems.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans w-full flex flex-col">
      <div className="flex-grow">
        <Hero />
        <RealMe />
        <Portfolio />
      </div>

      <Footer />
    </main>
  );
}
