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
    const introRef = useRef<HTMLDivElement>(null);
    const portraitRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
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

            // Hand-off to Real Me: the intro drifts up and fades as the hero scrolls away
            const mm = gsap.matchMedia();
            mm.add("(prefers-reduced-motion: no-preference)", () => {
                // The fixed portrait and the scroll hint fade out together,
                // so nothing is left floating over Real Me
                gsap.to([portraitRef.current, scrollRef.current, mobileScrollRef.current], {
                    opacity: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: "bottom 55%",
                        scrub: true,
                    },
                });
                gsap.to(introRef.current, {
                    y: -80,
                    opacity: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: "bottom 30%",
                        scrub: true,
                    },
                });
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
        <section id="home" ref={containerRef} className="relative w-full h-screen flex flex-col p-6 md:p-12 bg-background">
            {/* Navigation */}
            <Navbar />

            {/* Main Content Grid */}
            <div className="flex-1 w-full grid grid-cols-12 relative min-h-0 max-w-[1920px] mx-auto px-0 lg:px-16">
                {/* 2. Text Content (Middle/Left) */}
                <div className="col-span-12 lg:col-start-2 lg:col-span-5 flex flex-col z-10 lg:pl-20 xl:pl-24 h-full relative">
                    {/* Below lg: name block top-centred, portrait fills the space beneath */}
                    <div ref={introRef} className="flex-1 flex flex-col items-center text-center justify-start pt-[13svh] md:pt-[10svh] lg:items-start lg:text-left lg:justify-center lg:pt-0">
                        {/* -0.0625em cancels the D's left side-bearing in Aeonik at each size,
                            so the two D's line up exactly */}
                        <h1 className="text-primary font-medium tracking-tighter leading-[0.85]">
                            <span className="block lg:-ml-[0.0625em] text-[min(21vw,240px)] md:text-[min(17vw,180px)] lg:text-[min(11.5vw,180px)]">Daham</span>
                            <span className="block lg:-ml-[0.0625em] mt-1 text-[min(10vw,110px)] md:text-[min(8vw,90px)] lg:text-[min(5.6vw,86px)] text-tertiary">Dissanayake</span>
                        </h1>
                        <p className="mt-5 md:mt-6 max-w-md text-base md:text-lg text-secondary leading-snug">
                            Edge AI &amp; Robotics Researcher.
                        </p>
                        <div className="flex justify-center lg:justify-start gap-6 text-tertiary text-xl mt-5 overflow-hidden">
                            <div className="flex gap-6">
                                <Link href="https://github.com/DahamDissanayake" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="hover:text-primary transition-colors"><FiGithub /></Link>
                                <Link href="https://www.linkedin.com/in/daham-dissanayake/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="hover:text-primary transition-colors"><FiLinkedin /></Link>
                                <Link href="https://www.instagram.com/dhmdissanayake/" target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile" className="hover:text-primary transition-colors"><FiInstagram /></Link>
                                <Link href="mailto:dahamdissanayake05@gmail.com" aria-label="Send Email" className="hover:text-primary transition-colors"><FiMail /></Link>
                            </div>
                        </div>
                    </div>
                    <div ref={scrollRef} className="hidden lg:block pb-12">
                        <span className="text-base text-tertiary block font-mono">Scroll Down ↓</span>
                    </div>
                </div>

                {/* 3. Hero Image (Right) */}
                <div className="col-span-12 lg:col-span-6 h-full pointer-events-none">
                    {/* Parallax Container */}
                    <div
                        ref={parallaxRef}
                        className="absolute bottom-0 -mb-6 md:-mb-12 left-0 right-0 w-full h-[min(62svh,calc(100svh_-_330px))] md:h-[min(50svh,calc(100svh_-_440px))] lg:mb-0 lg:fixed lg:left-auto lg:right-0 lg:w-[60vw] lg:h-[130vh] flex items-end justify-center lg:justify-end origin-bottom lg:origin-bottom-right"
                    >
                        {/* Static Transform Container - Handles Desktop Offset Only */}
                        <div
                            ref={portraitRef}
                            className="h-full w-full flex items-end justify-center origin-bottom scale-[1.18] md:scale-110 lg:justify-end lg:scale-95 lg:translate-y-12"
                        >
                            <Image
                                src="/images/DAMAPortraitfinal2.webp"
                                alt="Daham Dissanayake - Full Stack Developer and Edge AI & Robotics Researcher"
                                width={1000}
                                height={1200}
                                className="h-full w-auto max-w-none object-contain object-bottom lg:max-w-full lg:w-full lg:object-right-bottom"
                                priority
                            />
                        </div>
                    </div>
                </div>

                {/* 4. Scroll Down Indicator (Centered Bottom for Mobile) */}
                <div ref={mobileScrollRef} className="lg:hidden absolute bottom-0 left-1/2 -translate-x-1/2 z-10 pb-2">
                    <span className="block whitespace-nowrap rounded-full bg-white/85 px-3.5 py-1.5 font-mono text-xs text-secondary shadow-[0_4px_16px_rgba(0,0,0,0.08)] backdrop-blur">Scroll Down ↓</span>
                </div>
            </div>
        </section>
    );
}
