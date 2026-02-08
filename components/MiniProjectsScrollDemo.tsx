"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MiniProjectsScrollDemo() {
    const sectionRef = useRef<HTMLElement>(null);
    const [hoveredProject, setHoveredProject] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const miniProjectsRef = useRef<HTMLDivElement>(null);

    // Responsive breakpoint detection
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 720);
            setIsTablet(width >= 720 && width < 1024);
            setIsDesktop(width >= 1024);
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // GSAP ScrollTrigger for Mini Projects (Desktop Only > 1024px)
    useLayoutEffect(() => {
        if (!isDesktop || !miniProjectsRef.current) return;

        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray<HTMLElement>(".desktop-card", miniProjectsRef.current);

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: miniProjectsRef.current,
                    pin: true,
                    start: "top top",
                    end: "+=2000", // Short fast scroll
                    scrub: 0, // Instant response (no lag)
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    fastScrollEnd: true,
                    preventOverlaps: true,
                    refreshPriority: 1
                }
            });

            cards.forEach((card, index) => {
                const content = card.querySelector(".card-full-content");
                const spine = card.querySelector(".card-spine");

                const totalCards = cards.length;
                const centerOffset = (totalCards - 1) / 2;
                const spacing = 150;
                const translateX = (index - centerOffset) * spacing;
                const rotation = 12;
                const zIndex = totalCards - index;

                // Animation Sequence
                tl.to(card, {
                    x: 0,
                    y: -50,
                    rotation: 0,
                    scale: 1.3,
                    zIndex: 100,
                    duration: 0.5,
                    ease: "power2.inOut"
                })
                    .to(spine, { opacity: 0, duration: 0.2 }, "<0.2")
                    .to(content, { opacity: 1, duration: 0.2 }, "<")
                    .to(card, { duration: 0.5 })
                    .to(content, { opacity: 0, duration: 0.2 })
                    .to(spine, { opacity: 1, duration: 0.2 }, "<")
                    .to(card, {
                        x: translateX,
                        y: 0,
                        rotation: rotation,
                        scale: 1,
                        zIndex: zIndex,
                        duration: 0.5,
                        ease: "power2.inOut"
                    });
            });

        }, miniProjectsRef);

        return () => ctx.revert();
    }, [isDesktop]);

    const miniProjects = [
        {
            title: "Imposter Game",
            description: "The trending multiplayer game with customized and all features are free to play."
        },
        {
            title: "Weather App",
            description: "Real-time weather tracking with beautiful UI and forecasts."
        },
        {
            title: "Task Manager",
            description: "Organize your daily tasks with ease and efficiency."
        },
        {
            title: "Chat Bot",
            description: "AI-powered conversational assistant for quick answers."
        },
        {
            title: "Portfolio Builder",
            description: "Create stunning portfolios in minutes with templates."
        },
        {
            title: "Code Snippet Manager",
            description: "Save and organize your favorite code snippets."
        }
    ];

    return (
        <section className="min-h-screen bg-background text-secondary py-20">
            {/* Mini Projects */}
            <div ref={miniProjectsRef} id="mini-projects-pinned" className="min-h-screen flex flex-col justify-center py-12 bg-background relative z-20">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl min-[720px]:text-4xl font-medium mb-2">Mini Projects (Scroll Animation)</h2>
                    <p className="text-tertiary text-lg">Scroll down to see the animation</p>
                </div>

                {/* Stacked Cards - Desktop Layout */}
                <div className="w-full h-[600px] flex items-center justify-center relative">
                    {miniProjects.map((project, index) => {
                        const totalCards = miniProjects.length;
                        const centerOffset = (totalCards - 1) / 2;
                        const spacing = 150;
                        const translateX = (index - centerOffset) * spacing;
                        const rotation = 12;
                        const zIndex = totalCards - index;

                        return (
                            <div
                                key={index}
                                className="desktop-card absolute bg-[#1c1c2b] text-white rounded-3xl p-8 shadow-2xl origin-bottom"
                                style={{
                                    width: '384px',
                                    height: '450px',
                                    transform: `translateX(${translateX}px) translateY(0px) rotate(${rotation}deg) scale(1)`,
                                    zIndex: zIndex,
                                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                                }}
                            >
                                {/* Full Content (Hidden Initially) */}
                                <div className="card-full-content flex flex-col h-full justify-between opacity-0 absolute inset-0 p-8">
                                    <div>
                                        <h3 className="text-2xl font-medium mb-4">{project.title}</h3>
                                        <p className="text-gray-300 text-base leading-relaxed">{project.description}</p>
                                    </div>
                                    <Link
                                        href="#"
                                        className="inline-block text-white underline underline-offset-4 hover:text-gray-300 transition-colors self-start"
                                    >
                                        View More →
                                    </Link>
                                </div>

                                {/* Vertical Spine (Visible Initially) */}
                                <div className="card-spine absolute inset-0 flex items-center justify-end pr-8 opacity-100">
                                    <h3
                                        className="text-xl font-medium text-white/80"
                                        style={{ writingMode: 'vertical-lr', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
                                    >
                                        {project.title}
                                    </h3>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
