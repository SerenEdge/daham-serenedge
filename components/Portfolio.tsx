"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function Portfolio() {
    const sectionRef = useRef<HTMLElement>(null);
    const [hoveredProject, setHoveredProject] = useState<number | null>(null);
    const [hoveredMiniCard, setHoveredMiniCard] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    // Responsive breakpoint detection
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 720);
            setIsTablet(width >= 720 && width < 1024);
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                                className="relative border-b border-gray-300 pb-8 mb-8 cursor-pointer"
                                onMouseEnter={() => !isMobile && setHoveredProject(index)}
                                onMouseLeave={() => !isMobile && setHoveredProject(null)}
                                onClick={() => isMobile && setHoveredProject(hoveredProject === index ? null : index)}
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

                                {/* Project Details Section - Smooth reveal and close */}
                                <div
                                    className="overflow-hidden transition-all duration-500 ease-out"
                                    style={{
                                        maxHeight: hoveredProject === index
                                            ? (isMobile ? '800px' : isTablet ? '700px' : '600px')
                                            : '0px',
                                        opacity: hoveredProject === index ? 1 : 0
                                    }}
                                >
                                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Image Placeholder - Responsive size */}
                                        <div className={`bg-gray-200 rounded-2xl flex items-center justify-center ${isMobile ? 'h-48' : isTablet ? 'h-56' : 'h-64'
                                            }`}>
                                            <span className="text-gray-400 text-lg font-medium">Project Image</span>
                                        </div>

                                        {/* Description and Tech Stack */}
                                        <div className="flex flex-col gap-6">
                                            {/* Long Description */}
                                            <div>
                                                <p className="text-tertiary text-base leading-relaxed">
                                                    {project.title === "ReImage Agent"
                                                        ? "The ReImage Agent is a specialized tool that transforms personal photos into vibrant, cartoon-style portraits. Built with a FastAPI backend for efficient image processing and Next.js for a seamless, responsive user experience, this project showcases the integration of AI-powered image transformation with modern web technologies. Users can upload their photos and receive professionally styled cartoon versions in seconds."
                                                        : "This is a comprehensive project that demonstrates advanced development skills and modern best practices. The application features a robust architecture, clean code organization, and seamless user experience. Built with cutting-edge technologies and optimized for performance, scalability, and maintainability."}
                                                </p>
                                            </div>

                                            {/* Tech Stack */}
                                            <div>
                                                <h4 className="text-xl font-medium mb-3">Tech Stack</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.title === "ReImage Agent" ? (
                                                        <>
                                                            <span className="px-4 py-2 bg-[#1c1c2b] text-white rounded-lg text-sm font-medium">FastAPI</span>
                                                            <span className="px-4 py-2 bg-[#1c1c2b] text-white rounded-lg text-sm font-medium">Next.js</span>
                                                            <span className="px-4 py-2 bg-[#1c1c2b] text-white rounded-lg text-sm font-medium">Python</span>
                                                            <span className="px-4 py-2 bg-[#1c1c2b] text-white rounded-lg text-sm font-medium">AI/ML</span>
                                                            <span className="px-4 py-2 bg-[#1c1c2b] text-white rounded-lg text-sm font-medium">TypeScript</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="px-4 py-2 bg-[#1c1c2b] text-white rounded-lg text-sm font-medium">React</span>
                                                            <span className="px-4 py-2 bg-[#1c1c2b] text-white rounded-lg text-sm font-medium">TypeScript</span>
                                                            <span className="px-4 py-2 bg-[#1c1c2b] text-white rounded-lg text-sm font-medium">Node.js</span>
                                                            <span className="px-4 py-2 bg-[#1c1c2b] text-white rounded-lg text-sm font-medium">Tailwind CSS</span>
                                                        </>
                                                    )}
                                                </div>
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

                    {/* Stacked Cards - Responsive layout */}
                    <div className={`relative flex items-center ${isMobile
                        ? 'w-full flex-col py-8'
                        : 'justify-center'
                        } ${isTablet ? 'h-[400px]' : isMobile ? 'h-auto' : 'h-[500px]'}`}>
                        {isMobile ? (
                            // Mobile: Horizontal scrollable carousel
                            <>
                                <div
                                    ref={carouselRef}
                                    className="w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                                    onScroll={(e) => {
                                        const container = e.currentTarget;
                                        // Approximate card width (85vw) + gap (16px)
                                        const cardWidth = window.innerWidth * 0.85 + 16;
                                        const scrollLeft = container.scrollLeft;
                                        const index = Math.round(scrollLeft / cardWidth);
                                        setActiveCardIndex(index);
                                    }}
                                >
                                    <div className="flex gap-4 px-6 w-max">
                                        {miniProjects.map((project, index) => (
                                            <div
                                                key={index}
                                                className="flex-shrink-0 w-[85vw] max-w-md h-[420px] bg-[#1c1c2b] text-white rounded-3xl p-8 snap-center"
                                            >
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
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Scroll Indicators */}
                                <div className="flex justify-center gap-2 mt-6">
                                    {miniProjects.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${index === activeCardIndex
                                                ? 'w-8 bg-[#1c1c2b]'
                                                : 'w-1.5 bg-[#1c1c2b]/40'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            // Tablet & Desktop: Tilted stack
                            <>
                                {miniProjects.map((project, index) => {
                                    const isHovered = hoveredMiniCard === index;
                                    const totalCards = miniProjects.length;
                                    const centerOffset = (totalCards - 1) / 2;
                                    const spacing = isTablet ? 80 : 150;
                                    const translateX = (index - centerOffset) * spacing;
                                    const rotation = isTablet ? 8 : 12;
                                    const zIndex = miniProjects.length - index;

                                    return (
                                        <div
                                            key={index}
                                            className={`absolute bg-[#1c1c2b] text-white rounded-3xl p-8 transition-all duration-200 cursor-pointer ${isTablet ? 'w-80 h-[380px]' : 'w-96 h-[450px]'
                                                }`}
                                            style={{
                                                transform: isHovered
                                                    ? `translateX(${translateX}px) translateY(-80px) rotate(0deg) scale(1.05)`
                                                    : `translateX(${translateX}px) translateY(0px) rotate(${rotation}deg) scale(1)`,
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
                                                    <h3
                                                        className="text-xl font-medium"
                                                        style={{ writingMode: 'vertical-lr', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
                                                    >
                                                        {project.title}
                                                    </h3>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
