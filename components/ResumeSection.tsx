"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function ResumeSection() {
    const containerRef = useRef<HTMLElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const texts = gsap.utils.toArray<HTMLElement>(".value-text", containerRef.current);

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: triggerRef.current,
                    pin: true,
                    start: "top top",
                    end: "+=300", // Fixed pixel value for reliable short distance
                    scrub: 0, // Instant response, no lag
                },
            });

            // Initial state
            gsap.set(texts, { opacity: 0.2, scale: 1 });

            // Sequence - Compressed for faster transitions
            // Phase 1: PERFECTION on
            tl.to(texts[0], { opacity: 1, scale: 1.1, duration: 1, ease: "none" })
                // Phase 2: Switch to PASSION (Overlap completely with previous out)
                .to(texts[0], { opacity: 0.2, scale: 1, duration: 1, ease: "none" }, ">")
                .to(texts[1], { opacity: 1, scale: 1.1, duration: 1, ease: "none" }, "<")

                // Phase 3: Switch to CLEAN
                .to(texts[1], { opacity: 0.2, scale: 1, duration: 1, ease: "none" }, ">")
                .to(texts[2], { opacity: 1, scale: 1.1, duration: 1, ease: "none" }, "<");

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="resume" ref={containerRef} className="bg-background w-full relative font-inter">
            <div
                ref={triggerRef}
                className="w-full h-screen flex justify-center items-center p-4 md:p-8"
            >
                <div className="w-full h-full max-w-[1920px] bg-[#1a1926] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl">

                    {/* Left Side - Info */}
                    <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center p-8 md:p-16 lg:p-24 gap-8">
                        <div>
                            <h2 className="text-white/80 text-xl md:text-2xl font-medium tracking-wide">
                                Daham Dissanayake
                            </h2>
                        </div>

                        <div className="max-w-md">
                            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                                Crafting digital experiences that merge technical precision with aesthetic elegance.
                                Focused on building intuitive, high-performance interfaces that leave a lasting impression.
                            </p>
                        </div>

                        <div>
                            <Link
                                href="/resume.pdf"
                                target="_blank"
                                className="inline-block px-8 py-3 bg-white text-[#1a1926] font-semibold rounded-full hover:bg-gray-200 transition-colors"
                            >
                                Resume
                            </Link>
                        </div>
                    </div>

                    {/* Right Side - Values Animation */}
                    <div
                        ref={textRef}
                        className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center items-center gap-4 md:gap-8"
                    >
                        <h2 className="value-text text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter opacity-20 origin-center transition-transform will-change-transform">
                            PERFECTION
                        </h2>
                        <h2 className="value-text text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter opacity-20 origin-center transition-transform will-change-transform">
                            PASSION
                        </h2>
                        <h2 className="value-text text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter opacity-20 origin-center transition-transform will-change-transform">
                            CLEAN
                        </h2>
                    </div>

                </div>
            </div>
        </section>
    );
}
