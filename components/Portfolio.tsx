"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiChevronDown, FiArrowUpRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import projectsData from "@/data/projects.json";
import type { ProjectsData } from "@/types/projects";

gsap.registerPlugin(ScrollTrigger);

const { portfolio: mainProjects, otherProjects } = projectsData as ProjectsData;

export default function Portfolio() {

    const sectionRef = useRef<HTMLElement>(null);
    const projectsContainerRef = useRef<HTMLDivElement>(null);
    const [hoveredProject, setHoveredProject] = useState<number | null>(null);
    const [hoveredMiniCard, setHoveredMiniCard] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const miniProjectsRef = useRef<HTMLDivElement>(null);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = (projectImagesLength: number) => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            setCurrentImageIndex(prev => prev === (projectImagesLength - 1) ? 0 : prev + 1);
        }
        if (isRightSwipe) {
            setCurrentImageIndex(prev => prev === 0 ? projectImagesLength - 1 : prev - 1);
        }
    };

    // Refresh ScrollTrigger when accordion height changes
    useEffect(() => {
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 550);
        setCurrentImageIndex(0);
        return () => clearTimeout(timer);
    }, [hoveredProject]);

    // Responsive breakpoint detection
    useLayoutEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setWindowWidth(width);
            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 1280);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Scroll animations
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });

            tl.from(projectsContainerRef.current, {
                y: 100,
                opacity: 0,
                duration: 1.8,
                ease: "power4.out"
            });

            gsap.from(miniProjectsRef.current, {
                y: 150,
                opacity: 0,
                duration: 2,
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

    return (
        <section
            id="portfolio"
            ref={sectionRef}
            className="relative w-full min-h-screen bg-background text-secondary px-6 md:px-12 lg:px-16"
        >
            <div className="max-w-[1920px] mx-auto">
                <div className="flex flex-col lg:flex-row lg:gap-20">
                    {/* Sticky Sidebar */}
                    <div className="lg:w-1/3 lg:h-screen lg:sticky lg:top-0 flex flex-col justify-start lg:justify-center pt-24 pb-8 lg:py-0 z-20">
                        <div className="flex flex-col items-start border-b border-gray-200 lg:border-none pb-4 lg:pb-0 w-full">
                            <h2 className="text-5xl md:text-8xl lg:text-9xl font-medium tracking-tight text-secondary leading-[0.8] mb-4 lg:mb-8">
                                Portfolio
                            </h2>
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
                                <article
                                    key={index}
                                    className={`project-card group relative border-b border-gray-200 cursor-pointer transition-all duration-500 ${hoveredProject !== null && hoveredProject !== index ? 'opacity-30 blur-[2px]' : 'opacity-100'}`}
                                    onMouseEnter={() => !isMobile && setHoveredProject(index)}
                                    onMouseLeave={() => !isMobile && setHoveredProject(null)}
                                    onClick={() => isMobile && setHoveredProject(hoveredProject === index ? null : index)}
                                >
                                    {/* Project Header */}
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

                                    {/* Project Details - Smooth reveal */}
                                    <div
                                        className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
                                        style={{
                                            maxHeight: hoveredProject === index ? (isMobile ? '1200px' : '900px') : '0px',
                                            opacity: hoveredProject === index ? 1 : 0
                                        }}
                                    >
                                        <div className="pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pl-0 lg:pl-[calc(2rem+20px)]">
                                            <div className="lg:col-span-12 xl:col-span-7">
                                                <div
                                                    className={`relative overflow-hidden rounded-2xl bg-gray-100 shadow-2xl ${isMobile ? 'h-64' : 'h-[400px]'} group/slider`}
                                                    onTouchStart={onTouchStart}
                                                    onTouchMove={onTouchMove}
                                                    onTouchEnd={() => onTouchEnd(project.images?.length || 1)}
                                                >
                                                    {project.images && project.images.length > 1 ? (
                                                        <>
                                                            <div
                                                                className="flex h-full transition-transform duration-500 ease-out"
                                                                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                                                            >
                                                                {project.images.map((img, i) => (
                                                                    <div key={i} className="relative min-w-full h-full">
                                                                        <Image
                                                                            src={img}
                                                                            alt={`${project.title} - Image ${i + 1}`}
                                                                            fill
                                                                            className="object-cover object-top"
                                                                            sizes="(max-width: 768px) 100vw, 60vw"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setCurrentImageIndex(prev => prev === 0 ? (project.images?.length || 1) - 1 : prev - 1);
                                                                }}
                                                                className={`absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg transition-opacity hover:bg-white text-secondary z-10 ${isMobile ? 'opacity-100' : 'opacity-0 group-hover/slider:opacity-100'}`}
                                                            >
                                                                <FiChevronLeft size={24} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setCurrentImageIndex(prev => prev === ((project.images?.length || 1) - 1) ? 0 : prev + 1);
                                                                }}
                                                                className={`absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg transition-opacity hover:bg-white text-secondary z-10 ${isMobile ? 'opacity-100' : 'opacity-0 group-hover/slider:opacity-100'}`}
                                                            >
                                                                <FiChevronRight size={24} />
                                                            </button>
                                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                                                {project.images.map((_, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className={`w-2 h-2 rounded-full transition-all ${i === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <Image
                                                            src={project.images[0] ?? ""}
                                                            alt={project.title}
                                                            fill
                                                            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                                                            sizes="(max-width: 768px) 100vw, 60vw"
                                                        />
                                                    )}
                                                </div>
                                            </div>

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
                                </article>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Other Projects — stacked card design */}
                <div ref={miniProjectsRef} className="py-6">
                    <div className="mb-12">
                        <h2 className="text-3xl md:text-4xl font-medium mb-2">Other projects</h2>
                        <p className="text-lg text-tertiary">Projects outside the featured selection</p>
                    </div>

                    <div className={`relative flex items-center ${isMobile
                        ? 'w-full flex-col py-8'
                        : 'justify-center'
                        } ${isTablet ? 'h-[500px] mb-12' : isMobile ? 'h-auto mb-8' : 'h-[650px] mb-20'}`}>

                        {isMobile ? (
                            // Mobile: horizontal scrollable carousel
                            <>
                                <div
                                    ref={carouselRef}
                                    className="w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                                    onScroll={(e) => {
                                        const container = e.currentTarget;
                                        const cardWidth = window.innerWidth * 0.85 + 16;
                                        const index = Math.round(container.scrollLeft / cardWidth);
                                        setActiveCardIndex(index);
                                    }}
                                >
                                    <div className="flex gap-4 px-6 w-max">
                                        {otherProjects.map((project, index) => (
                                            <div
                                                key={project.id ?? index}
                                                className="flex-shrink-0 w-[85vw] max-w-md h-[520px] bg-[#1c1c2b] text-white rounded-3xl p-8 snap-center"
                                            >
                                                <div className="flex flex-col h-full justify-between overflow-hidden">
                                                    <div className="overflow-y-auto scrollbar-hide mb-4">
                                                        <h3 className="text-2xl font-medium mb-4">{project.title}</h3>
                                                        <p className="text-gray-300 text-base leading-relaxed">{project.description}</p>
                                                    </div>
                                                    <Link
                                                        href={project.link}
                                                        target="_blank"
                                                        className="inline-block text-white underline underline-offset-4 hover:text-gray-300 transition-colors self-start flex-shrink-0"
                                                    >
                                                        View More →
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Scroll dots */}
                                <div className="flex justify-center gap-2 mt-6">
                                    {otherProjects.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${index === activeCardIndex ? 'w-8 bg-[#1c1c2b]' : 'w-1.5 bg-[#1c1c2b]/40'}`}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            // Tablet & Desktop: tilted stacked fan
                            <>
                                {otherProjects.map((project, index) => {
                                    const isHovered = hoveredMiniCard === index;
                                    const totalCards = otherProjects.length;
                                    const centerOffset = (totalCards - 1) / 2;

                                    const cardWidth = isTablet ? 320 : 384;
                                    // Account for page padding (lg:px-16 = 64px each side = 128px total)
                                    const containerWidth = (windowWidth || 1920) - 128;
                                    // Max spacing so all cards fit with 40px breathing room on each side
                                    const maxSpacing = (containerWidth - 80 - cardWidth) / Math.max(1, totalCards - 1);
                                    const spacing = Math.min(isTablet ? 75 : 110, maxSpacing);

                                    const translateX = (index - centerOffset) * spacing;
                                    const rotation = isTablet ? 8 : 12;
                                    const zIndex = totalCards - index;

                                    return (
                                        <div
                                            key={project.id ?? index}
                                            className={`absolute cursor-pointer ${isTablet ? 'w-80 h-[380px]' : 'w-96 h-[450px]'}`}
                                            style={{
                                                transform: `translateX(${translateX}px) rotate(${rotation}deg)`,
                                                zIndex: isHovered ? 50 : zIndex,
                                            }}
                                            onMouseEnter={() => setHoveredMiniCard(index)}
                                            onMouseLeave={() => setHoveredMiniCard(null)}
                                        >
                                            {/* Animated card */}
                                            <div
                                                className={`relative w-full h-full bg-[#1c1c2b] text-white rounded-b-3xl rounded-tr-3xl rounded-tl-none ${isTablet ? 'p-6' : 'p-8'} transition-all duration-300 ease-out`}
                                                style={{
                                                    transform: isHovered
                                                        ? `translateY(-80px) rotate(${-rotation}deg) scale(1.1)`
                                                        : `translateY(0px) rotate(0deg) scale(1)`,
                                                    boxShadow: isHovered
                                                        ? '0 30px 60px rgba(0, 0, 0, 0.5)'
                                                        : '0 20px 40px rgba(0, 0, 0, 0.3)',
                                                }}
                                            >
                                                {/* File tab */}
                                                <div className="absolute -top-8 left-0 w-32 h-8 bg-[#1c1c2b] rounded-t-2xl" />

                                                {isHovered ? (
                                                    <div className="flex flex-col h-full justify-between animate-in fade-in duration-300 relative z-10 overflow-hidden">
                                                        <div className="overflow-y-auto scrollbar-hide mb-4">
                                                            <h3 className={`font-medium mb-3 ${isTablet ? 'text-xl' : 'text-2xl'}`}>{project.title}</h3>
                                                            <p className={`text-gray-300 leading-relaxed ${isTablet ? 'text-sm' : 'text-base'}`}>{project.description}</p>
                                                        </div>
                                                        <Link
                                                            href={project.link}
                                                            target="_blank"
                                                            className={`inline-block text-white underline underline-offset-4 hover:text-gray-300 transition-colors self-start flex-shrink-0 ${isTablet ? 'text-sm' : 'text-base'}`}
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
