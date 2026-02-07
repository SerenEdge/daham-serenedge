"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function Portfolio() {
    const sectionRef = useRef<HTMLElement>(null);
    const [hoveredProject, setHoveredProject] = useState<number | null>(null);
    const [hoveredMiniCard, setHoveredMiniCard] = useState<number | null>(null);

    const mainProjects = [
        {
            title: "SoterCare",
            subtitle: "(2nd Year Project)",
            description: "IoT & ML Based Elderly Care Monitoring System.",
            image: "/images/projects/sotercare.png"
        },
        {
            title: "ReImage Agent",
            subtitle: "(Under Dev)",
            description: "Transform portraits into AI-powered image generation.",
            image: "/images/projects/reimage.png"
        },
        {
            title: "Apple Home ESP32 Automation",
            subtitle: "",
            description: "Home Automation System.",
            image: "/images/projects/home-automation.png"
        },
        {
            title: "Expressions Detection System",
            subtitle: "",
            description: "YOLO Based human expression detection.",
            image: "/images/projects/expressions.png"
        }
    ];

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
        <section
            id="portfolio"
            ref={sectionRef}
            className="relative w-full min-h-screen bg-background text-secondary px-6 min-[720px]:px-12 lg:px-16 py-20"
        >
            <div className="max-w-[1920px] mx-auto">
                {/* Title */}
                <h1 className="text-5xl min-[720px]:text-7xl font-regular mb-16">PORTFOLIO</h1>

                {/* Main Projects */}
                <div className="mb-32">
                    <div className="mb-12">
                        <h2 className="text-3xl min-[720px]:text-4xl font-medium mb-2">Main Projects</h2>
                        <p className="text-tertiary text-lg">Projects that took my sleep.</p>
                    </div>

                    <div className="space-y-8">
                        {mainProjects.map((project, index) => (
                            <div
                                key={index}
                                className="relative border-b border-gray-300 pb-8 mb-8"
                                onMouseEnter={() => setHoveredProject(index)}
                                onMouseLeave={() => setHoveredProject(null)}
                            >
                                {/* Project Info - Always visible */}
                                <div className="flex justify-between items-center mb-4 relative z-10">
                                    <div>
                                        <h3 className="text-2xl min-[720px]:text-3xl font-medium">
                                            {project.title} {project.subtitle && <span className="text-tertiary text-xl">{project.subtitle}</span>}
                                        </h3>
                                    </div>
                                    <p className="text-tertiary text-base min-[720px]:text-lg hidden min-[720px]:block">
                                        {project.description}
                                    </p>
                                </div>

                                {/* Hover Card Container - Creates reveal area */}
                                <div className="relative overflow-hidden" style={{ height: hoveredProject === index ? '300px' : '0px', transition: 'height 0.4s ease-out' }}>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mini Projects */}
                <div>
                    <div className="mb-12">
                        <h2 className="text-3xl min-[720px]:text-4xl font-medium mb-2">Mini Projects</h2>
                        <p className="text-tertiary text-lg">Small tools built to simplify tasks</p>
                    </div>

                    {/* Stacked Cards - Each card tilted 12deg individually */}
                    <div className="relative h-[500px] flex items-center justify-center">
                        {miniProjects.map((project, index) => {
                            const isHovered = hoveredMiniCard === index;
                            // Center the cards and spread them out
                            const totalCards = miniProjects.length;
                            const centerOffset = (totalCards - 1) / 2;
                            const translateX = (index - centerOffset) * 100; // Increased spacing from -80 to 100
                            const zIndex = miniProjects.length - index; // Back cards have lower z-index

                            return (
                                <div
                                    key={index}
                                    className="absolute w-96 h-[450px] bg-[#1c1c2b] text-white rounded-3xl p-8 transition-all duration-500 cursor-pointer"
                                    style={{
                                        transform: isHovered
                                            ? `translateX(${translateX}px) translateY(-80px) rotate(0deg) scale(1.05)`
                                            : `translateX(${translateX}px) translateY(0px) rotate(12deg) scale(1)`,
                                        zIndex: isHovered ? 100 : zIndex,
                                        boxShadow: isHovered
                                            ? '0 30px 60px rgba(0, 0, 0, 0.5)'
                                            : '0 20px 40px rgba(0, 0, 0, 0.3)',
                                    }}
                                    onMouseEnter={() => setHoveredMiniCard(index)}
                                    onMouseLeave={() => setHoveredMiniCard(null)}
                                >
                                    {isHovered ? (
                                        <div className="flex flex-col h-full justify-between">
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
                                    ) : (
                                        <div className="flex items-center justify-end h-full pr-4">
                                            <h3 className="text-xl font-medium" style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}>
                                                {project.title}
                                            </h3>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
