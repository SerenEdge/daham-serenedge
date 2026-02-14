"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiChevronDown, FiArrowUpRight } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Portfolio() {
    const sectionRef = useRef<HTMLElement>(null);
    const projectsContainerRef = useRef<HTMLDivElement>(null);
    const [hoveredProject, setHoveredProject] = useState<number | null>(null);
    const [hoveredMiniCard, setHoveredMiniCard] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const miniProjectsRef = useRef<HTMLDivElement>(null);

    // Refresh ScrollTrigger when height changes (due to accordion)
    useEffect(() => {
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 550); // Wait for the 500ms transition to finish
        return () => clearTimeout(timer);
    }, [hoveredProject]);

    // Responsive breakpoint detection
    useLayoutEffect(() => {
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

    // "Anti-Gravity" Scroll Animations - Reveal all projects when section enters view
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Main projects animation
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%", // Trigger earlier
                    toggleActions: "play none none reverse"
                }
            });

            // Animate projects container with more dramatic movement
            tl.from(projectsContainerRef.current, {
                y: 100,
                opacity: 0,
                duration: 1.8,
                ease: "power4.out"
            });

            // Separate animation for Mini Projects with its own trigger
            gsap.from(miniProjectsRef.current, {
                y: 150, // Much larger offset for visibility
                opacity: 0,
                duration: 2, // Longer duration
                ease: "power4.out",
                scrollTrigger: {
                    trigger: miniProjectsRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const mainProjects = [
        {
            title: "SoterCare",
            subtitle: "(2nd Year Project)",
            description: "IoT & ML Based Elderly Care Monitoring System.",
            longDescription: "SoterCare is an innovative IoT and Machine Learning-driven elderly care monitoring system designed to provide proactive, dignified safety. Unlike traditional reactive SOS buttons, it predicts falls and detects urinary incontinence in real-time. By integrating wearable sensor nodes with a dedicated edge gateway, the system ensures continuous vitals monitoring and automated emergency alerts, offering a comprehensive safety net for seniors while maintaining their independence.",
            tech: ["IoT", "Raspberry Pi", "React Native", "C++", "NestJS", "Python", "PostgreSQL", "Edge Impulse"],
            link: "https://sotercare.com",
            image: "/images/projects/sotercare.png"
        },
        {
            title: "ReImage Agent",
            subtitle: "(Under Dev)",
            description: "Transform portraits into AI-powered image generation.",
            longDescription: "ReImage Agent is a streamlined web service designed to transform personal photos into vibrant, cartoon-style portraits. By leveraging generative AI models, the agent processes user-uploaded images to generate high-quality stylized avatars against a clean, professional background. It aims to provide an accessible, chat-driven interface for instant creative transformation, making personalized digital art generation seamless and intuitive for everyday users.",
            tech: ["Next.js", "FastAPI", "LangChain", "Gemini (Nano Banana)"],
            link: "https://github.com/DahamDissanayake/ReImage-Agent",
            image: "/images/projects/reimage.png"
        },
        {
            title: "Apple Home ESP32 Automation",
            subtitle: "",
            description: "Home Automation System.",
            longDescription: "This is a native HomeKit-integrated IoT switch that enables direct voice control over high-voltage home electronics. By implementing the Apple HomeKit Accessory Protocol (HAP) on an ESP32, the project allows for seamless pairing with the Apple Home app via QR code. Users can trigger a physical relay to toggle appliances—such as lamps or fans—using Siri commands or automated scenes, all while maintaining local, bridge-free communication for low latency and enhanced privacy.",
            tech: ["ESP32", "C++", "IoT"],
            link: "https://github.com/DahamDissanayake/apple-home-auto32",
            image: "/images/projects/home-automation.png"
        },
        {
            title: "Expressions Detection System",
            subtitle: "",
            description: "YOLO Based human expression detection.",
            longDescription: "This is a real-time facial expression recognition system that utilizes a customized YOLO architecture to identify and categorize human emotions with high precision. By training on diverse datasets of facial landmarks, the model detects subtle micro-expressions—such as happiness, anger, and surprise—directly within a video stream. This project bridges the gap between raw visual data and emotional intelligence, providing an efficient, low-latency solution for human-computer interaction, sentiment analysis, and user experience monitoring.",
            tech: ["YOLOv8", "PyTorch", "OpenCV"],
            link: "https://github.com/DahamDissanayake/expression-yolo",
            image: "/images/projects/expressions.png"
        }
    ];

    const miniProjects = [
        {
            title: "Imposter Game",
            description: "Built using React and Vite, this custom Imposter Game is my answer to the trend of paywalled gaming apps. I created this project to provide a completely free, feature-rich alternative where users can enjoy all modes without payment. Hosted on GitHub Pages, it ensures a seamless and accessible experience for everyone to play together.",
            link: "https://github.com/DahamDissanayake/Imposter-Game-But-Customized-V2"
        },
        {
            title: "Flood-Watch [NullProduct]",
            description: "Flood-Watch is a real-time, offline-capable flood warning system designed to protect vulnerable communities in Sri Lanka. Winning runners-up at the Vertex'25 IoT competition, we built it using Edge Computing on ESP32 Magicbit and Ultrasonic Sensors to detect flash floods instantly. It ensures life-saving alerts even when internet connectivity fails.",
            link: "https://github.com/DahamDissanayake/NullProduct-VERTEX25"
        },
        {
            title: "Keyboard Macro Writer",
            description: "I developed this Python-based Keystroke Simulator to automate data entry with a human touch. Utilizing pynput for precise keyboard control and tkinter for an intuitive GUI, the tool lets me pre-record text and replay it with randomized delays. My goal was to create a seamless way to mimic natural typing patterns, making automated inputs indistinguishable from manual keystrokes.",
            link: "https://github.com/DahamDissanayake/keyboard-macro-writer"
        },
        {
            title: "Apple Photo Sorter",
            description: "I developed this Python and Tkinter application because copying photos from an iPhone often results in a messy, disorganized file structure. This tool solves that by automating the backup process: it scans the chaotic source folders and neatly sorts every image into clean, year-based directories at your chosen destination, ensuring a structured archive.",
            link: "https://github.com/DahamDissanayake/Apple-Photo-Sorter"
        },
        {
            title: "VibeCheck [Chrome Extension]",
            description: "I created the VibeCheck Layout Assistant to streamline “vibe coding,” effectively bridging the gap between spotting visual bugs and fixing them. By allowing users to overlay a grid, lock onto elements, and click to mark friction points, it automatically generates structured prompts. This tool makes communicating precise layout adjustments to your AI coding assistant both effortless and efficient.",
            link: "https://github.com/DahamDissanayake/web-design-prompt-extension"
        },
        {
            title: "Visionslide",
            description: "I built VisionSlide to navigate presentations hands-free, eliminating the need for a physical clicker. It uses a webcam to translate hand gestures into slide commands. The project is built with Python, utilizing OpenCV for motion tracking, PyAutoGUI for input simulation, and CustomTkinter for the interface.",
            link: "https://github.com/DahamDissanayake/vision-slide"
        }
    ];

    return (
        <section
            id="portfolio"
            ref={sectionRef}
            className="relative w-full min-h-screen bg-background text-secondary px-6 md:px-12 lg:px-16"
        >
            <div className="max-w-[1920px] mx-auto">
                <div className="flex flex-col lg:flex-row lg:gap-20">
                    {/* Sticky Sidebar (Header) */}
                    <div className="lg:w-1/3 lg:h-screen lg:sticky lg:top-0 flex flex-col justify-start lg:justify-center pt-24 pb-8 lg:py-0 z-20">
                        <div className="flex flex-col items-start border-b border-gray-200 lg:border-none pb-4 lg:pb-0 w-full">
                            <h1 className="text-5xl md:text-8xl lg:text-9xl font-medium tracking-tight text-secondary leading-[0.8] mb-4 lg:mb-8">
                                Portfolio
                            </h1>
                            <div className="flex items-center gap-4 text-tertiary">
                                <span className="h-[1px] w-12 bg-tertiary/50 hidden lg:block"></span>
                                <span className="text-sm lg:text-base font-mono uppercase tracking-wider">
                                    Selected Works
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Scrolling Content (Main Projects) */}
                    <div className="lg:w-2/3 pb-24 md:py-32">
                        <div ref={projectsContainerRef} className="flex flex-col">
                            {mainProjects.map((project, index) => (
                                <div
                                    key={index}
                                    className={`project-card group relative border-b border-gray-200 cursor-pointer transition-all duration-500 ${hoveredProject !== null && hoveredProject !== index ? 'opacity-30 blur-[2px]' : 'opacity-100'
                                        }`}
                                    onMouseEnter={() => !isMobile && setHoveredProject(index)}
                                    onMouseLeave={() => !isMobile && setHoveredProject(null)}
                                    onClick={() => isMobile && setHoveredProject(hoveredProject === index ? null : index)}
                                >
                                    {/* Project Header - Always visible */}
                                    <div className="py-8 lg:py-16 flex flex-col gap-6 relative z-10">
                                        <div className="flex items-baseline justify-between w-full">
                                            <div className="flex items-baseline gap-4 lg:gap-8">
                                                <span className="text-lg lg:text-xl font-medium text-tertiary font-mono">0{index + 1}</span>
                                                <h3 className="text-4xl md:text-5xl font-medium tracking-tight group-hover:translate-x-4 transition-transform duration-500 ease-out">
                                                    {project.title}
                                                    {isMobile && (
                                                        <FiChevronDown
                                                            className={`inline-block ml-2 text-2xl text-tertiary transition-transform duration-300 ${hoveredProject === index ? 'rotate-180' : 'rotate-0'}`}
                                                        />
                                                    )}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="pl-0 lg:pl-[calc(2rem+20px)]">
                                            <p className="text-lg lg:text-xl text-tertiary font-medium max-w-xl">{project.description}</p>
                                        </div>
                                    </div>

                                    {/* Project Details Section - Smooth reveal and close */}
                                    <div
                                        className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
                                        style={{
                                            maxHeight: hoveredProject === index
                                                ? (isMobile ? '1200px' : '900px')
                                                : '0px',
                                            opacity: hoveredProject === index ? 1 : 0
                                        }}
                                    >
                                        <div className="pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pl-0 lg:pl-[calc(2rem+20px)]">
                                            {/* Image - now takes up more space */}
                                            <div className="lg:col-span-12 xl:col-span-7">
                                                <div className={`relative overflow-hidden rounded-2xl bg-gray-100 shadow-2xl ${isMobile ? 'h-64' : 'h-[400px]'}`}>
                                                    <Image
                                                        src={project.image}
                                                        alt={project.title}
                                                        fill
                                                        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                                                        sizes="(max-width: 768px) 100vw, 60vw"
                                                    />
                                                </div>
                                            </div>

                                            {/* Description and Details */}
                                            <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-between">
                                                <div>
                                                    <h4 className="text-xl font-medium mb-4">About the project</h4>
                                                    {project.subtitle && <p className="text-tertiary mb-4 font-mono text-sm uppercase tracking-wider">{project.subtitle}</p>}
                                                    <p className="text-secondary text-lg leading-relaxed mb-8">
                                                        {project.longDescription}
                                                    </p>
                                                    <Link
                                                        href={project.link}
                                                        target="_blank"
                                                        className="group/link inline-flex items-center gap-2 text-xl font-medium text-primary hover:opacity-70 transition-opacity mb-8"
                                                    >
                                                        View More
                                                        <FiArrowUpRight className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                                                    </Link>
                                                    <div className="mb-8">
                                                        <h5 className="text-sm font-medium uppercase tracking-widest text-tertiary mb-4">Technologies</h5>
                                                        <div className="flex flex-wrap gap-2">
                                                            {project.tech.map((tech, i) => (
                                                                <span key={i} className="px-3 py-1.5 border border-gray-200 text-secondary rounded-full text-sm hover:border-gray-400 transition-colors cursor-default">
                                                                    {tech}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


                {/* Mini Projects */}
                <div ref={miniProjectsRef} className="py-6">
                    <div className="mb-12">
                        <h2 className="text-3xl md:text-4xl font-medium mb-2">Mini Projects</h2>
                        <p className="text-lg text-tertiary">Small tools built to simplify tasks</p>
                    </div>

                    {/* Stacked Cards - Responsive layout */}
                    <div className={`relative flex items-center ${isMobile
                        ? 'w-full flex-col py-8'
                        : 'justify-center'
                        } ${isTablet ? 'h-[400px]' : isMobile ? 'h-auto' : 'h-[600px]'}`}>
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
                                                className="mini-project-card flex-shrink-0 w-[85vw] max-w-[100%] max-w-md h-[520px] bg-[#1c1c2b] text-white rounded-3xl p-8 snap-center"
                                            >
                                                <div className="flex flex-col h-full justify-between">
                                                    <div>
                                                        <h3 className="text-2xl font-medium mb-4">{project.title}</h3>
                                                        <p className="text-gray-300 text-base leading-relaxed">{project.description}</p>
                                                    </div>
                                                    <Link
                                                        href={project.link}
                                                        target="_blank"
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
                            // Tablet & Desktop: Tilted stack (Restored)
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
                                        // Stable Container for Hover Detection
                                        <div
                                            key={index}
                                            className={`absolute cursor-pointer ${isTablet ? 'w-80 h-[380px]' : 'w-96 h-[450px]'}`}
                                            style={{
                                                transform: `translateX(${translateX}px) rotate(${rotation}deg)`,
                                                zIndex: isHovered ? 50 : zIndex, // Z-Index stays on the wrapper
                                            }}
                                            onMouseEnter={() => setHoveredMiniCard(index)}
                                            onMouseLeave={() => setHoveredMiniCard(null)}
                                        >
                                            {/* Animated Visual Card - File Style */}
                                            <div
                                                className={`mini-project-card relative w-full h-full bg-[#1c1c2b] text-white rounded-b-3xl rounded-tr-3xl rounded-tl-none p-8 transition-all duration-300 ease-out`}
                                                style={{
                                                    transform: isHovered
                                                        ? `translateY(-80px) rotate(${-rotation}deg) scale(1.1)` // Counter-rotate to 0, move up
                                                        : `translateY(0px) rotate(0deg) scale(1)`,
                                                    boxShadow: isHovered
                                                        ? '0 30px 60px rgba(0, 0, 0, 0.5)'
                                                        : '0 20px 40px rgba(0, 0, 0, 0.3)',
                                                }}
                                            >
                                                {/* File Tab */}
                                                <div
                                                    className="absolute -top-8 left-0 w-32 h-8 bg-[#1c1c2b] rounded-t-2xl"
                                                    style={{ content: '""' }}
                                                />

                                                {isHovered ? (
                                                    <div className="flex flex-col h-full justify-between animate-in fade-in duration-300 relative z-10">
                                                        <div>
                                                            <h3 className="text-2xl font-medium mb-4">{project.title}</h3>
                                                            <p className="text-gray-300 text-base leading-relaxed">{project.description}</p>
                                                        </div>
                                                        <Link
                                                            href={project.link}
                                                            target="_blank"
                                                            className="inline-block text-white underline underline-offset-4 hover:text-gray-300 transition-colors self-start"
                                                        >
                                                            View More →
                                                        </Link>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-end h-full pr-4 relative z-10">
                                                        <h3
                                                            className="text-xl font-medium"
                                                            style={{ writingMode: 'vertical-lr', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
                                                        >
                                                            {project.title}
                                                        </h3>
                                                    </div>
                                                )}
                                            </div>
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
