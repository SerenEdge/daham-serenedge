"use client";

import { useRef, useLayoutEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { FiGithub, FiLinkedin, FiInstagram, FiMail } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useScale from "@/hooks/useScale";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const parallaxRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef(null);
    const mobileScrollRef = useRef(null);
    const roleRef = useRef<HTMLDivElement>(null);
    const periodRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [currentRole] = useState("CS Undergrad");
    const [currentPeriod] = useState("Present");
    const scale = useScale(720); // Base width for scaling

    useLayoutEffect(() => {
        setIsMobile(window.innerWidth < 720);
        const handleResize = () => setIsMobile(window.innerWidth < 720);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Parallax Scroll Effect (Outer Container)
            // Moves down slightly as you scroll down, creating depth
            gsap.to(parallaxRef.current, {
                y: 100,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });

            // Scroll Indicators Loop
            gsap.to([scrollRef.current, mobileScrollRef.current], {
                y: 10,
                repeat: -1,
                yoyo: true,
                duration: 1.5,
                ease: "sine.inOut"
            });

        }, containerRef);

        return () => ctx.revert();
    }, [isMobile]);

    return (
        <section id="home" ref={containerRef} className="relative w-full h-screen flex flex-col p-6 min-[720px]:p-12 bg-background">
            {/* Navigation */}
            <Navbar />

            {/* Main Content Grid */}
            <div className="flex-1 w-full grid grid-cols-12 relative min-h-0 max-w-[1920px] mx-auto px-6 min-[720px]:px-12 lg:px-16 pb-20 min-[720px]:pb-0">
                {/* 1. Sidebar Timeline (Leftmost Column) */}
                <div className="col-span-2 min-[720px]:col-span-1 flex flex-col justify-center items-center gap-14 min-[720px]:gap-14 lg:gap-18 pl-2 min-[720px]:pl-0">
                    <span className="-rotate-90 text-tertiary text-sm min-[720px]:text-base lg:text-lg tracking-wider whitespace-nowrap">
                        {currentRole}
                    </span>
                    <div className="w-[1px] h-[20vh] min-[720px]:h-[30vh] lg:h-[40vh] bg-gray-300"></div>
                    <span className="-rotate-90 text-tertiary text-sm min-[720px]:text-base lg:text-lg tracking-wider whitespace-nowrap">
                        {currentPeriod}
                    </span>
                </div>

                {/* 2. Text Content (Middle/Left) */}
                <div className="col-span-10 min-[720px]:col-span-5 lg:col-span-5 flex flex-col z-10 pl-4 min-[720px]:pl-20 lg:pl-50 h-full relative">
                    <div className="flex-1 flex flex-col justify-center">
                        <div>
                            <h1 className="text-[25vw] min-[720px]:text-[14vw] lg:text-[12vw] xl:text-[10vw] leading-[0.8] tracking-tighter text-primary font-regular origin-left">
                                Hello
                            </h1>
                        </div>
                        <div className="overflow-hidden mt-2">
                            <p className="text-xl min-[720px]:text-xl lg:text-xl text-secondary font-medium">
                                -It’s Daham Dissanayake
                            </p>
                        </div>
                        <div className="flex gap-6 text-tertiary text-xl min-[720px]:text-xl mt-4 overflow-hidden">
                            <div className="flex gap-6">
                                <Link href="https://github.com/DahamDissanayake" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><FiGithub /></Link>
                                <Link href="https://www.linkedin.com/in/daham-dissanayake/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><FiLinkedin /></Link>
                                <Link href="https://www.instagram.com/dhmdissanayake/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><FiInstagram /></Link>
                                <Link href="mailto:dahamdissanayake05@gmail.com" className="hover:text-primary transition-colors"><FiMail /></Link>
                            </div>
                        </div>
                    </div>
                    <div ref={scrollRef} className="hidden min-[720px]:block pb-12">
                        <span className="text-base text-tertiary block">Scroll Down ↓</span>
                    </div>
                </div>

                {/* 3. Hero Image (Right) */}
                <div className="col-span-12 min-[720px]:col-span-6 lg:col-span-6 h-full pointer-events-none">
                    {/* Parallax Container */}
                    <div
                        ref={parallaxRef}
                        className="absolute bottom-0 -mb-6 left-0 right-0 w-full min-[720px]:mb-0 min-[720px]:fixed min-[720px]:left-auto min-[720px]:right-0 min-[720px]:w-[60vw] min-[720px]:h-[130vh] flex items-end justify-end origin-bottom min-[720px]:origin-bottom-right"
                    >
                        {/* Static Transform Container - Handles Desktop Offset Only */}
                        <div
                            className="w-full flex items-end justify-center origin-bottom scale-150 min-[720px]:justify-end min-[720px]:scale-100 min-[720px]:h-full min-[720px]:translate-y-12"
                        >
                            <Image
                                src="/images/Dahamimagefornow-dark.png"
                                alt="Hero Image"
                                width={1200}
                                height={1400}
                                className="w-full h-auto min-[720px]:h-full object-contain object-bottom min-[720px]:object-right-bottom"
                                priority
                            />
                        </div>
                    </div>
                </div>

                {/* 4. Scroll Down Indicator (Centered Bottom for Mobile) */}
                <div ref={mobileScrollRef} className="min-[720px]:hidden absolute bottom-0 left-1/2 -translate-x-1/2 z-10 pb-8">
                    <span className="text-sm text-white block">Scroll Down ↓</span>
                </div>
            </div>
        </section>
    );
}
