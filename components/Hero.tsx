"use client";

import { useRef, useLayoutEffect, useState, useEffect } from "react";
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
    const roleRef = useRef<HTMLSpanElement>(null);
    const periodRef = useRef<HTMLSpanElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [currentRole, setCurrentRole] = useState("CS Undergrad");
    const [currentPeriod, setCurrentPeriod] = useState("Present");
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

    // Role and Period Animation Loop
    useEffect(() => {
        const roles = [
            "CS Undergrad",
            "IoT Enthusiast",
            "ML Practitioner",
            "Web Developer",
            "Freelancer",
            "Photographer",
            "DX Toolmaker"
        ];

        let roleIndex = 0;
        let isPresent = true;

        const interval = setInterval(() => {
            const roleEl = roleRef.current;
            const periodEl = periodRef.current;

            let nextRole = "";
            let nextPeriod = "";
            let periodWillChange = false;

            if (isPresent) {
                if (roleIndex < roles.length - 1) {
                    roleIndex++;
                    nextRole = roles[roleIndex];
                    nextPeriod = "Present";
                } else {
                    isPresent = false;
                    nextRole = "Who Knows!";
                    nextPeriod = "Future";
                    periodWillChange = true;
                }
            } else {
                isPresent = true;
                roleIndex = 0;
                nextRole = roles[roleIndex];
                nextPeriod = "Present";
                periodWillChange = true;
            }

            // GSAP 3D Dice Roll - Out
            const targets = periodWillChange ? [roleEl, periodEl] : [roleEl];

            gsap.to(targets, {
                rotateX: -90,
                opacity: 0,
                y: -10,
                duration: 0.4,
                ease: "power2.in",
                onComplete: () => {
                    setCurrentRole(nextRole);
                    setCurrentPeriod(nextPeriod);

                    // GSAP 3D Dice Roll - In
                    gsap.fromTo(targets,
                        { rotateX: 90, opacity: 0, y: 10 },
                        {
                            rotateX: 0,
                            opacity: 1,
                            y: 0,
                            duration: 0.4,
                            ease: "power2.out",
                            delay: 0.1
                        }
                    );
                }
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section id="home" ref={containerRef} className="relative w-full h-screen flex flex-col p-6 md:p-12 bg-background">
            {/* Navigation */}
            <Navbar />

            {/* Main Content Grid */}
            <div className="flex-1 w-full grid grid-cols-12 relative min-h-0 max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 pb-20 md:pb-0">
                {/* 1. Sidebar Timeline (Leftmost Column) */}
                <div className="col-span-2 md:col-span-1 flex flex-col justify-center items-center gap-14 md:gap-14 lg:gap-18 pl-2 md:pl-0 [perspective:1000px]">
                    <span ref={roleRef} className="-rotate-90 text-tertiary text-xs md:text-base lg:text-base tracking-wider whitespace-nowrap inline-block transform-gpu">
                        {currentRole}
                    </span>
                    <div className="w-[1px] h-[12vh] md:h-[28vh] lg:h-[38vh] bg-gray-300"></div>
                    <span ref={periodRef} className="-rotate-90 text-tertiary text-xs md:text-base lg:text-base tracking-wider whitespace-nowrap inline-block transform-gpu">
                        {currentPeriod}
                    </span>
                </div>

                {/* 2. Text Content (Middle/Left) */}
                <div className="col-span-10 md:col-span-6 lg:col-span-5 flex flex-col z-10 pl-6 md:pl-20 lg:pl-32 xl:pl-48 h-full relative">
                    <div className="flex-1 flex flex-col justify-center">
                        <div>
                            <h1 className="text-[min(25vw,300px)] md:text-[min(14vw,200px)] leading-[0.8] tracking-tighter text-primary font-regular origin-left whitespace-nowrap">
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
                    <div ref={scrollRef} className="hidden md:block pb-12">
                        <span className="text-base text-tertiary block font-mono">Scroll Down ↓</span>
                    </div>
                </div>

                {/* 3. Hero Image (Right) */}
                <div className="col-span-12 min-[720px]:col-span-6 lg:col-span-6 h-full pointer-events-none">
                    {/* Parallax Container */}
                    <div
                        ref={parallaxRef}
                        className="absolute bottom-0 -mb-6 left-0 right-0 w-full md:mb-0 md:fixed md:left-auto md:right-0 md:w-[60vw] md:h-[130vh] flex items-end justify-end origin-bottom md:origin-bottom-right"
                    >
                        {/* Static Transform Container - Handles Desktop Offset Only */}
                        <div
                            className="w-full flex items-end justify-center origin-bottom scale-120 md:justify-end md:scale-95 md:h-full md:translate-y-12"
                        >
                            <Image
                                src="/images/DAMAPortraitfinal2.webp"
                                alt="Daham Dissanayake - ComputerScience Undergraduate"
                                width={1000}
                                height={1200}
                                className="w-full h-auto md:h-full object-contain object-bottom md:object-right-bottom"
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
