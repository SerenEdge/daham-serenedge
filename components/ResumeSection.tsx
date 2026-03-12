"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import { FiCpu, FiCode, FiDatabase, FiArrowUpRight } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const skills = [
    {
        id: "fullstack",
        title: "Full Stack",
        label: "WEB",
        description:
            "Building scalable, high-performance web applications with modern frameworks. From interactive user interfaces to robust backend architectures.",
        tech: ["React", "Next.js", "Node.js", "TypeScript"],
        icon: FiCode,
        accent: "#1c1c2b",
    },
    {
        id: "iot",
        title: "IoT Development",
        label: "IoT",
        description:
            "Bridging the physical and digital worlds. Designing efficient firmware, custom PCBs, and real-time communication protocols for smart devices.",
        tech: ["C++", "ESP32", "Raspberry Pi", "Arduino"],
        icon: FiCpu,
        accent: "#1c1c2b",
    },
    {
        id: "ml",
        title: "ML / AI",
        label: "ML",
        description:
            "Leveraging data to create intelligent systems. Implementing computer vision, predictive models, and AI agents that solve real-world problems.",
        tech: ["Python", "TensorFlow", "YOLO", "Edge Impulse"],
        icon: FiDatabase,
        accent: "#1c1c2b",
    },
];

export default function ResumeSection() {
    const [activeSkill, setActiveSkill] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    // Simple intersection observer for initial entry animation visibility
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // GSAP ScrollTrigger for Expertise Navigation
    useLayoutEffect(() => {
        const mm = gsap.matchMedia();

        mm.add({
            isDesktop: "(min-width: 1024px)",
            isMobile: "(max-width: 1023px)"
        }, (context) => {
            const { isDesktop } = context.conditions as { isDesktop: boolean };

            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: isDesktop ? "+=900" : "+=600",
                pin: true,
                scrub: 0.5, // Added slight scrub for smoothness
                onUpdate: (self) => {
                    const progress = self.progress;
                    if (progress < 0.33) setActiveSkill(0);
                    else if (progress < 0.66) setActiveSkill(1);
                    else setActiveSkill(2);
                }
            });
        }, sectionRef);

        return () => mm.revert();
    }, []);

    const active = skills[activeSkill];
    const ActiveIcon = active.icon;

    return (
        <section
            id="resume"
            ref={sectionRef}
            className="relative w-full min-h-screen lg:h-screen bg-background flex items-center overflow-hidden px-6 md:px-12 lg:px-16 py-20 lg:py-0"
        >
            {/* ── Subtle background accent blob ── */}
            <div
                className="pointer-events-none absolute inset-0 z-0"
                aria-hidden="true"
            >
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04] blur-3xl transition-colors duration-700"
                    style={{ backgroundColor: active.accent }}
                />
            </div>

            <div className="relative z-10 max-w-[1920px] mx-auto w-full flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-20">

                {/* ── LEFT: Section header (matches Portfolio layout) ── */}
                <div
                    className={`lg:w-[38%] flex flex-col gap-4 lg:gap-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    style={{ transitionDelay: "0ms" }}
                >
                    <h2 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-medium tracking-tight text-primary leading-[0.85]">
                        Resume
                    </h2>

                    <div className="flex items-center gap-4 text-tertiary">
                        <span className="h-[1px] w-12 bg-tertiary/50 hidden lg:block" />
                        <span className="text-sm font-mono uppercase tracking-wider">
                            Core Expertise
                        </span>
                    </div>

                    {/* Active skill detail panel */}
                    <div className="mt-4 flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                            <span
                                className="p-2.5 rounded-xl text-white shadow-lg transition-colors duration-500"
                                style={{ backgroundColor: active.accent }}
                            >
                                <ActiveIcon className="w-5 h-5" />
                            </span>
                            <h3 className="text-xl lg:text-2xl font-medium text-primary">
                                {active.title}
                            </h3>
                        </div>

                        <p
                            key={active.id}
                            className="text-tertiary text-base lg:text-lg leading-relaxed max-w-sm"
                            style={{
                                animation: "fadeSlideIn 0.35s ease forwards",
                            }}
                        >
                            {active.description}
                        </p>

                        {/* Tech tags */}
                        <div className="flex flex-wrap gap-2">
                            {active.tech.map((t) => (
                                <span
                                    key={t}
                                    className="px-2.5 py-1 lg:px-3 lg:py-1 rounded-full border border-gray-300 text-xs lg:text-sm text-secondary font-mono
                                               hover:border-primary/50 transition-colors cursor-default"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* ── View Full Resume CTA ── */}
                    <div className="mt-4 lg:mt-6">
                        <Link
                            href="/docs/DahamDissanayake-CV.pdf"
                            target="_blank"
                            className="group relative inline-flex items-center justify-center gap-4 lg:gap-6 overflow-hidden rounded-full bg-[#1c1c2b] px-8 py-4 lg:px-10 lg:py-5 text-white transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {/* Centered background expansion */}
                            <span className="absolute inset-0 z-0 bg-white/10 transition-transform duration-500 scale-x-0 group-hover:scale-x-100 origin-center" />

                            <span className="relative z-10 text-sm lg:text-base font-medium tracking-wide">
                                View Full Resume
                            </span>
                            <div className="relative z-10 flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/10 text-white transition-all duration-500 group-hover:rotate-45 group-hover:bg-white/20">
                                <FiArrowUpRight className="w-4 h-4 lg:w-5 lg:h-5" />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* ── RIGHT: Skill cards ── */}
                <div className="lg:w-[62%] flex flex-col gap-4">
                    {skills.map((skill, i) => {
                        const Icon = skill.icon;
                        const isActive = activeSkill === i;
                        return (
                            <button
                                key={skill.id}
                                onClick={() => setActiveSkill(i)}
                                className={`group w-full text-left rounded-2xl border transition-all duration-400 cursor-pointer
                                    ${isVisible
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-10"
                                    }
                                    ${isActive
                                        ? "bg-primary border-primary shadow-2xl"
                                        : "bg-white/60 border-gray-200 hover:border-gray-300 hover:shadow-md"
                                    }`}
                                style={{
                                    transitionDelay: isVisible ? `${100 + i * 100}ms` : "0ms",
                                    transitionProperty: "opacity, transform, background-color, border-color, box-shadow",
                                }}
                                aria-pressed={isActive}
                            >
                                <div className="flex items-center justify-between px-5 py-5 lg:px-7 lg:py-6">
                                    {/* Left: title */}
                                    <div className="flex items-center gap-5">
                                        <span
                                            className={`text-xl md:text-2xl lg:text-4xl font-medium tracking-tight transition-colors duration-300 ${isActive ? "text-white" : "text-primary"}`}
                                        >
                                            {skill.title}
                                        </span>
                                    </div>

                                    {/* Right: icon + label */}
                                    <div className="flex items-center gap-4">
                                        <span
                                            className={`hidden sm:block text-xs font-mono uppercase tracking-widest transition-colors duration-300 ${isActive ? "text-white/50" : "text-tertiary"}`}
                                        >
                                            {skill.label}
                                        </span>
                                        <span
                                            className="p-2 rounded-xl transition-all duration-300"
                                            style={{
                                                backgroundColor: isActive
                                                    ? `${skill.accent}33`
                                                    : "#f3f4f6",
                                                color: "#7b7b7b",
                                            }}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </span>

                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

        </section>
    );
}
