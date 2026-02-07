import Hero from "@/components/Hero";
import RealMe from "@/components/RealMe";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans w-full">
      <Hero />
      <RealMe />
    </main>
  );
}
