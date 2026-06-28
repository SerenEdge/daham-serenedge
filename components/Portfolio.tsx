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
    const [isMobile, setIsMobile] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
            // Next image
            setCurrentImageIndex(prev => prev === (projectImagesLength - 1) ? 0 : prev + 1);
        }
        if (isRightSwipe) {
            // Previous image
            setCurrentImageIndex(prev => prev === 0 ? projectImagesLength - 1 : prev - 1);
        }
    };

    // Refresh ScrollTrigger when height changes (due to accordion)
    useEffect(() => {
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 550); // Wait for the 500ms transition to finish
        setCurrentImageIndex(0); // Reset image slider when project changes
        return () => clearTimeout(timer);
    }, [hoveredProject]);

    // Responsive breakpoint detection
    useLayoutEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
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

            // Stagger-reveal the "Other projects" cards
            const otherCards = miniProjectsRef.current
                ? gsap.utils.toArray<HTMLElement>(".other-card", miniProjectsRef.current)
                : [];
            if (otherCards.length) {
                gsap.from(otherCards, {
                    y: 40,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power3.out",
                    stagger: 0.06,
                    scrollTrigger: {
                        trigger: miniProjectsRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                });
            }

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
                    {/* Sticky Sidebar (Header) */}
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

                                                            {/* Navigation Buttons */}
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

                                                            {/* Dots Indicator */}
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
                                </article>
                            ))}
                        </div>
                    </div>
                </div>


                {/* Other projects */}
                <div ref={miniProjectsRef} className="py-6">
                    <div className="mb-12">
                        <h2 className="text-3xl md:text-4xl font-medium mb-2">Other projects</h2>
                        <p className="text-lg text-tertiary">Small tools built to simplify tasks</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
                        {otherProjects.map((project, index) => (
                            <a
                                key={project.id ?? index}
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="other-card group relative flex flex-col justify-between bg-[#1c1c2b] text-white rounded-b-2xl rounded-tr-2xl rounded-tl-none p-6 min-h-[220px] transition-transform duration-300 ease-out hover:-translate-y-2 hover:rotate-[-1deg] shadow-[0_16px_32px_rgba(0,0,0,0.28)]"
                            >
                                {/* File tab */}
                                <span className="absolute -top-6 left-0 w-20 h-6 bg-[#1c1c2b] rounded-t-xl" />
                                <div className="relative z-10 overflow-hidden">
                                    <h3 className="text-lg md:text-xl font-medium mb-3">{project.title}</h3>
                                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-5">
                                        {project.description}
                                    </p>
                                </div>
                                <span className="relative z-10 mt-5 inline-flex items-center gap-1 text-sm text-white/90 underline underline-offset-4 group-hover:text-white">
                                    View More <span aria-hidden="true">→</span>
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
