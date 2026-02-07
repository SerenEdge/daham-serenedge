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
                                <div className="relative overflow-hidden" style={{ height: hoveredProject === index ? '300px' : '0px', transition: 'height 0.7s ease-out' }}>
                                    {/* Hover Card - Slides from behind border line */}
                                    <div
                                        className="absolute right-0 bg-[#1c1c2b] text-white rounded-t-2xl shadow-2xl overflow-visible transition-all duration-700 ease-out"
                                        style={{
                                            width: '55%',
                                            bottom: hoveredProject === index ? '0px' : '-350px',
                                            opacity: 1,
                                            zIndex: 20
                                        }}
                                    >
                                        {/* Tab/Edge at top */}
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#1c1c2b] rounded-t-lg border-t-4 border-x-4 border-[rgba(255,255,255,0.1)]"></div>

                                        <div className="flex gap-6 p-8">
                                            {/* Image Section */}
                                            <div className="w-1/2 bg-gray-200 rounded-xl flex items-center justify-center min-h-[200px]">
                                                <span className="text-gray-400 text-lg">Image Placeholder</span>
                                            </div>

                                            {/* Content Section */}
                                            <div className="w-1/2 flex flex-col justify-between py-2">
                                                <p className="text-gray-300 text-base leading-relaxed">
                                                    {project.title === "ReImage Agent"
                                                        ? "The ReImage Agent is a specialized tool that transforms personal photos into vibrant, cartoon-style portraits, utilizing a FastAPI backend and Next.js for a seamless user experience."
                                                        : project.description}
                                                </p>
                                                <Link
                                                    href="#"
                                                    className="inline-block text-white underline underline-offset-4 hover:text-gray-300 transition-colors self-start"
                                                >
                                                    View More →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
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

                    {/* Stacked Cards */}
                    <div className="relative h-[400px] flex items-center justify-center">
                        {miniProjects.map((project, index) => {
                            const isHovered = hoveredMiniCard === index;
                            const rotation = (index - 2.5) * 8; // Spread cards in a fan
                            const translateX = (index - 2.5) * 60;

                            return (
                                <div
                                    key={index}
                                    className="absolute w-80 h-96 bg-[#1c1c2b] text-white rounded-2xl p-8 transition-all duration-500 cursor-pointer"
                                    style={{
                                        transform: isHovered
                                            ? `rotate(0deg) translateX(0px) translateY(-50px)`
                                            : `rotate(${rotation}deg) translateX(${translateX}px) translateY(0px)`,
                                        zIndex: isHovered ? 50 : 10 - Math.abs(index - 2.5),
                                    }}
                                    onMouseEnter={() => setHoveredMiniCard(index)}
                                    onMouseLeave={() => setHoveredMiniCard(null)}
                                >
                                    {isHovered ? (
                                        <div className="flex flex-col h-full justify-between">
                                            <div>
                                                <h3 className="text-2xl font-medium mb-4">{project.title}</h3>
                                                <p className="text-gray-300 text-base">{project.description}</p>
                                            </div>
                                            <Link
                                                href="#"
                                                className="inline-block text-white underline underline-offset-4 hover:text-gray-300 transition-colors"
                                            >
                                                View More →
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <h3 className="text-xl font-medium text-center">{project.title}</h3>
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
