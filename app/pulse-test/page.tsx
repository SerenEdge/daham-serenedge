import DevPulseCard from "@/components/DevPulseCard";

export default function TestPage() {
    return (
        <div className="min-h-screen bg-[#f8f8f8] p-20 flex flex-col items-center justify-center gap-12">
            <h1 className="text-4xl font-medium text-[#1c1c2b] mb-8">DevPulse Component Test</h1>

            <div className="w-full flex justify-center">
                <DevPulseCard username="DahamDissanayake" />
            </div>

            <p className="text-tertiary font-mono uppercase tracking-[0.2em] mt-12">
                Style: SerenEdge Premium Dark
            </p>
        </div>
    );
}
