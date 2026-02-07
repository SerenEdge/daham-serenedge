"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { FiGithub, FiLinkedin, FiInstagram } from "react-icons/fi";
import gsap from "gsap";

export default function Hero() {
    const scrollRef = useRef(null);
    const mobileScrollRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Desktop Scroll Indicator Animation - Smoother Loop
            gsap.to(scrollRef.current, {
                y: 15,
                repeat: -1,
                yoyo: true,
                duration: 2,
                ease: "sine.inOut"
            });

            // Mobile Scroll Indicator Animation - Smoother Loop
            gsap.to(mobileScrollRef.current, {
                y: 15,
                repeat: -1,
                yoyo: true,
                duration: 2,
                ease: "sine.inOut"
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <section id="home" className="relative w-full h-screen flex flex-col p-6 min-[720px]:p-12 overflow-hidden bg-background">
            {/* Navigation */}
            <Navbar />

            {/* Main Content Grid */}
            <div className="flex-1 w-full grid grid-cols-12 relative min-h-0 max-w-[1920px] mx-auto px-6 min-[720px]:px-12 lg:px-16">
                {/* 1. Sidebar Timeline (Leftmost Column) */}
                <div className="col-span-2 min-[720px]:col-span-1 flex flex-col justify-center items-center gap-14 min-[720px]:gap-14 lg:gap-18 pl-2 min-[720px]:pl-0">
                    <span className="-rotate-90 text-tertiary text-sm min-[720px]:text-base lg:text-lg tracking-wider whitespace-nowrap">
                        CS Undergrad
                    </span>
                    <div className="w-[1px] h-[20vh] min-[720px]:h-[30vh] lg:h-[40vh] bg-gray-300"></div>
                    <span className="-rotate-90 text-tertiary text-sm min-[720px]:text-base lg:text-lg tracking-wider whitespace-nowrap">
                        Present
                    </span>
                </div>

                {/* 2. Text Content (Middle/Left) */}
                <div className="col-span-10 min-[720px]:col-span-5 lg:col-span-5 flex flex-col z-10 pl-4 min-[720px]:pl-20 lg:pl-50 h-full relative">
                    <div className="flex-1 flex flex-col justify-center">
                        <h1 className="text-[25vw] min-[720px]:text-[14vw] lg:text-[12vw] xl:text-[10vw] leading-[0.8] tracking-tighter text-primary font-regular">
                            Hello
                        </h1>
                        <p className="text-xl min-[720px]:text-xl lg:text-xl text-secondary font-medium mt-2">
                            -It’s Daham Dissanayake
                        </p>
                        <div className="flex gap-6 text-tertiary text-xl min-[720px]:text-xl mt-4">
                            <Link href="#" className="hover:text-primary transition-colors"><FiGithub /></Link>
                            <Link href="#" className="hover:text-primary transition-colors"><FiLinkedin /></Link>
                            <Link href="#" className="hover:text-primary transition-colors"><FiInstagram /></Link>
                        </div>
                    </div>
                    <div ref={scrollRef} className="hidden min-[720px]:block pb-12">
                        <span className="text-base text-tertiary block">Scroll Down ↓</span>
                    </div>
                </div>

                {/* 3. Hero Image (Right) */}
                <div className="col-span-12 min-[720px]:col-span-6 lg:col-span-6 relative h-full pointer-events-none min-[720px]:block">
                    <div className="absolute bottom-0 -right-8 min-[720px]:-right-32 w-[120%] h-[180%] min-[720px]:w-[150%] min-[720px]:h-[130%] flex items-end justify-end translate-y-6 min-[720px]:translate-y-12">
                        <Image
                            src="/images/Dahamimagefornow-dark.png"
                            alt="Hero Image"
                            width={1200}
                            height={1400}
                            className="w-full h-full object-contain object-bottom"
                            priority
                        />
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
