"use client";

import { useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { FiCpu, FiCode, FiDatabase, FiArrowUpRight } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

export default function ResumeSection() {
    const containerRef = useRef<HTMLElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    // State to track active section for dynamic content on the left
    const [activeSection, setActiveSection] = useState(0);

    const skills = [
        {
            title: "FULL STACK",
            description: "Building scalable, high-performance web applications with modern frameworks. From interactive user interfaces to robust backend architectures.",
            tech: ["React", "Next.js", "Node.js", "TypeScript"],
            icon: <FiCode className="w-6 h-6" />,

        },
        {
            title: "IoT Development",
            description: "Bridging the physical and digital worlds. Designing efficient firmware, custom PCBs, and real-time communication protocols for smart devices.",
            tech: ["C++", "ESP32", "Raspberry Pi", "Arduino"],
            icon: <FiCpu className="w-6 h-6" />,

        },
        {
            title: "ML / AI",
            description: "Leveraging data to create intelligent systems. Implementing computer vision, predictive models, and AI agents that solve real-world problems.",
            tech: ["Python", "TensorFlow", "YOLO", "Edge Impulse"],
            icon: <FiDatabase className="w-6 h-6" />,
        }
    ];

    useLayoutEffect(() => {
        if (containerRef.current) {
            gsap.set(containerRef.current, { clearProps: "all" });
        }

        const ctx = gsap.context(() => {
            const texts = gsap.utils.toArray<HTMLElement>(".value-text", containerRef.current);
            const visuals = gsap.utils.toArray<HTMLElement>(".bg-visual", bgRef.current);

            // Set initial states - Start everything slightly lower for "float up" entry
            gsap.set(texts, { opacity: 0, scale: 0.9, y: 50, filter: "blur(4px)" });
            gsap.set(visuals, { opacity: 0, scale: 0.8, y: 50 });

            // Initial Active State (0) - Float it into place
            gsap.set(texts[0], { opacity: 1, scale: 1.1, y: 0, filter: "blur(0px)", color: "#e6e6f0" });
            gsap.set(visuals[0], { opacity: 0.6, scale: 1, y: 0 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: triggerRef.current,
                    pin: true,
                    start: "top top",
                    end: "+=1500", // Increased distance for slower, floaty feel
                    scrub: 1, // Smooth scrubbing for weightless feel
                    onUpdate: (self) => {
                        // Update active index state based on progress for React rendering (Left side)
                        const progress = self.progress;
                        if (progress < 0.33) setActiveSection(0);
                        else if (progress < 0.66) setActiveSection(1);
                        else setActiveSection(2);
                    }
                }
            });

            // --- ANIMATION SEQUENCE ---
            // "Anti-Gravity" Logic: Elements float UP into view, stay, then float UP out of view.

            // Transition 0 -> 1
            // 0 floats up and out
            tl.to(texts[0], { opacity: 0, scale: 0.9, y: -50, filter: "blur(4px)", color: "#4b5563", duration: 1 })
                .to(visuals[0], { opacity: 0, scale: 0.8, y: -50, duration: 1 }, "<")

                // 1 floats up and in
                .to(texts[1], { opacity: 1, scale: 1.1, y: 0, filter: "blur(0px)", color: "#e6e6f0", duration: 1 }, "-=0.5")
                .to(visuals[1], { opacity: 0.6, scale: 1, y: 0, duration: 1 }, "<")

                // Hold Item 1
                .to({}, { duration: 0.5 })

                // Transition 1 -> 2
                // 1 floats up and out
                .to(texts[1], { opacity: 0, scale: 0.9, y: -50, filter: "blur(4px)", color: "#4b5563", duration: 1 })
                .to(visuals[1], { opacity: 0, scale: 0.8, y: -50, duration: 1 }, "<")

                // 2 floats up and in
                .to(texts[2], { opacity: 1, scale: 1.1, y: 0, filter: "blur(0px)", color: "#e6e6f0", duration: 1 }, "-=0.5")
                .to(visuals[2], { opacity: 0.6, scale: 1, y: 0, duration: 1 }, "<");

            // --- GRID PARALLAX ---
            // Animate grid background position relative to scroll progress
            tl.to(gridRef.current, {
                backgroundPositionY: "200px",
                ease: "none",
                duration: tl.duration() // Sync with the entire timeline length
            }, 0);


        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="bg-background w-full relative font-sans">
            <div
                id="resume"
                ref={triggerRef}
                className="w-full h-screen flex justify-center items-center px-6 min-[720px]:px-12 lg:px-16 py-8 relative z-20"
            >
                {/* Main Card Container */}
                <div className="w-full h-full max-w-[1920px] bg-[#1c1c2b] rounded-3xl flex flex-col md:flex-row relative overflow-hidden shadow-2xl">

                    {/* Background Grid & Visuals - Now clipped inside the card */}
                    <div ref={bgRef} className="absolute inset-0 pointer-events-none z-0">
                        {/* Base Grid */}
                        <div
                            ref={gridRef}
                            className="absolute inset-0 opacity-30"
                            style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                        >
                        </div>

                        {/* Visual 0: Full Stack (Abstract UI & Code Construction) */}
                        <div className="bg-visual absolute left-1/2 -translate-x-1/2 top-[30%] -translate-y-1/2 md:left-auto md:right-0 md:top-1/2 md:-translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] opacity-0 text-[#e6e6f0]/10 pointer-events-none">
                            <svg viewBox="0 0 400 400" className="w-full h-full stroke-[#e6e6f0]/40 fill-none stroke-1">
                                {/* Browser Frame */}
                                <rect x="40" y="60" width="320" height="240" rx="8" className="stroke-2" />
                                <circle cx="60" cy="80" r="3" className="fill-[#e6e6f0]/40 stroke-none" />
                                <circle cx="75" cy="80" r="3" className="fill-[#e6e6f0]/40 stroke-none" />
                                <circle cx="90" cy="80" r="3" className="fill-[#e6e6f0]/40 stroke-none" />
                                <line x1="40" y1="100" x2="360" y2="100" />

                                {/* Abstract UI Blocks */}
                                <rect x="60" y="120" width="80" height="160" rx="4" className="fill-[#e6e6f0]/5 stroke-none" />
                                <rect x="160" y="120" width="180" height="60" rx="4" className="fill-[#e6e6f0]/10 stroke-none" />
                                <rect x="160" y="195" width="50" height="50" rx="4" />
                                <rect x="225" y="195" width="50" height="50" rx="4" />
                                <rect x="290" y="195" width="50" height="50" rx="4" />

                                {/* Floating Code Symbols */}
                                <text x="320" y="320" className="text-4xl font-mono fill-[#e6e6f0]/20 stroke-none">{`</>`}</text>
                                <text x="50" y="350" className="text-2xl font-mono fill-[#e6e6f0]/20 stroke-none">{`{ }`}</text>
                                <text x="300" y="50" className="text-xl font-mono fill-[#e6e6f0]/20 stroke-none">{`npm i`}</text>
                            </svg>
                        </div>

                        {/* Visual 1: IoT (Processor & Connected Device Schematic) */}
                        <div className="bg-visual absolute left-1/2 -translate-x-1/2 top-[30%] -translate-y-1/2 md:left-auto md:right-0 md:top-1/2 md:-translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] opacity-0 pointer-events-none">
                            <svg viewBox="0 0 400 400" className="w-full h-full stroke-[#e6e6f0]/40 fill-none stroke-1">
                                {/* Central Processor */}
                                <rect x="150" y="150" width="100" height="100" rx="4" className="stroke-2 fill-[#e6e6f0]/5" />
                                <rect x="170" y="170" width="60" height="60" className="fill-[#e6e6f0]/10 stroke-none" />

                                {/* Traces to Peripherals - Top */}
                                <path d="M180,150 V130 H220 V150" />
                                <path d="M200,130 V110" />
                                <rect x="180" y="90" width="40" height="20" rx="2" className="fill-[#e6e6f0]/10 stroke-none" /> {/* Memory */}

                                {/* Traces to Peripherals - Bottom */}
                                <path d="M170,250 V280 H140" />
                                <circle cx="130" cy="280" r="10" className="fill-[#e6e6f0]/10" /> {/* Sensor A */}
                                <path d="M230,250 V280 H260" />
                                <circle cx="270" cy="280" r="10" className="fill-[#e6e6f0]/10" /> {/* Sensor B */}

                                {/* Traces to Peripherals - Left */}
                                <path d="M150,180 H120 V160" />
                                <rect x="90" y="150" width="30" height="20" rx="2" className="fill-[#e6e6f0]/10 stroke-none" /> {/* Power */}
                                <path d="M150,220 H120 V240" />
                                <rect x="90" y="230" width="30" height="20" rx="2" className="fill-[#e6e6f0]/10 stroke-none" /> {/* GPIO */}

                            </svg>
                        </div>

                        {/* Visual 2: ML (Deep Neural Network Lattice) */}
                        <div className="bg-visual absolute left-1/2 -translate-x-1/2 top-[30%] -translate-y-1/2 md:left-auto md:right-0 md:top-1/2 md:-translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] opacity-0 pointer-events-none">
                            <svg viewBox="0 0 500 500" className="w-full h-full fill-[#e6e6f0]/30">
                                {/* Layer 1 (Input) */}
                                {Array(5).fill(0).map((_, i) => (
                                    <circle key={`l1-${i}`} cx="50" cy={100 + i * 75} r="8" className="fill-[#e6e6f0]/60" />
                                ))}

                                {/* Layer 2 (Hidden) */}
                                {Array(6).fill(0).map((_, i) => (
                                    <circle key={`l2-${i}`} cx="200" cy={70 + i * 65} r="10" className="fill-[#e6e6f0]/40" />
                                ))}

                                {/* Layer 3 (Hidden) */}
                                {Array(6).fill(0).map((_, i) => (
                                    <circle key={`l3-${i}`} cx="350" cy={70 + i * 65} r="10" className="fill-[#e6e6f0]/40" />
                                ))}

                                {/* Layer 4 (Output) */}
                                {Array(3).fill(0).map((_, i) => (
                                    <circle key={`l4-${i}`} cx="450" cy={175 + i * 75} r="12" className="fill-[#e6e6f0]/80" />
                                ))}

                                {/* Connections L1 -> L2 */}
                                {Array(5).fill(0).map((_, i) => (
                                    Array(6).fill(0).map((_, j) => (
                                        <line key={`c1-${i}-${j}`} x1="50" y1={100 + i * 75} x2="200" y2={70 + j * 65} className="stroke-[#e6e6f0]/10 stroke-1" />
                                    ))
                                ))}

                                {/* Connections L2 -> L3 */}
                                {Array(6).fill(0).map((_, i) => (
                                    Array(6).fill(0).map((_, j) => (
                                        <line key={`c2-${i}-${j}`} x1="200" y1={70 + i * 65} x2="350" y2={70 + j * 65} className="stroke-[#e6e6f0]/10 stroke-1" />
                                    ))
                                ))}

                                {/* Connections L3 -> L4 */}
                                {Array(6).fill(0).map((_, i) => (
                                    Array(3).fill(0).map((_, j) => (
                                        <line key={`c3-${i}-${j}`} x1="350" y1={70 + i * 65} x2="450" y2={175 + j * 75} className="stroke-[#e6e6f0]/10 stroke-1" />
                                    ))
                                ))}
                            </svg>
                        </div>
                    </div>

                    {/* Left Side - Contextual Info */}
                    <div className="w-full md:w-1/2 h-[60%] md:h-full flex flex-col justify-center p-8 min-[720px]:p-16 lg:p-24 gap-6 md:gap-8 relative z-10 order-2 md:order-1">

                        {/* Dynamic Header */}
                        <div className="h-16 md:h-20"> {/* Fixed height to prevent layout shift */}
                            <div className="flex items-center gap-3 mb-2">
                                <span className="p-2 rounded-lg bg-[#050505] text-[#e6e6f0]">
                                    {skills[activeSection].icon}
                                </span>
                            </div>
                            <h2
                                className="text-2xl md:text-3xl lg:text-4xl font-bold transition-colors duration-300 text-[#e6e6f0]"
                            >
                                {skills[activeSection].title}
                            </h2>
                        </div>

                        {/* Dynamic Description */}
                        <div className="max-w-md h-24 md:h-32"> {/* Fixed height */}
                            <p className="text-gray-400 text-sm md:text-lg leading-relaxed transition-opacity duration-300">
                                {skills[activeSection].description}
                            </p>
                        </div>

                        {/* Tech Stack List */}
                        <div className="flex flex-wrap gap-2">
                            {skills[activeSection].tech.map((tech, i) => (
                                <span
                                    key={i}
                                    className="px-2 py-1 md:px-3 md:py-1 bg-[#1a1926] border border-gray-800 rounded text-xs md:text-sm text-gray-300 font-mono hover:border-[#e6e6f0]/40 transition-colors cursor-default"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>

                        {/* Resume Button */}
                        <div className="mt-4 md:mt-8">
                            <Link
                                href="/resume.pdf"
                                target="_blank"
                                className="group inline-flex items-center gap-2 px-6 py-2 md:px-8 md:py-3 bg-[#e6e6f0] text-[#1c1c2b] font-semibold rounded-full hover:bg-gray-200 transition-all hover:pr-10 text-sm md:text-base"
                            >
                                View Full Resume
                                <FiArrowUpRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Side - Hero Text Animation */}
                    <div
                        ref={textRef}
                        className="w-full md:w-1/2 h-[40%] md:h-full flex flex-col justify-center items-center gap-2 md:gap-4 relative order-1 md:order-2 translate-y-25 md:translate-y-0"
                    >
                        {/* Map through skills to create the massive text elements */}
                        {skills.map((skill, index) => (
                            <h2
                                key={index}
                                className="value-text text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter origin-center transition-colors will-change-transform cursor-default"
                                style={{ color: "#4b5563" }} // Default inactive color
                            >
                                {skill.title === "IoT Development" ? "IoT" : skill.title} {/* Shorten for big text */}
                            </h2>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
