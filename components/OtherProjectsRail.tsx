"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { FiArrowUpRight, FiGrid, FiMinimize2 } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { OtherProject } from "@/types/projects";
import { useLenis } from "@/components/SmoothScroll";
import SliderNav from "@/components/SliderNav";

gsap.registerPlugin(ScrollTrigger);

const pad = (n: number) => String(n).padStart(2, "0");

function FolderCard({ project, index, compact }: { project: OtherProject; index: number; compact?: boolean }) {
    return (
        <Link
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`group/card pointer-events-auto relative mt-5 flex flex-col rounded-b-2xl rounded-tr-2xl bg-[#222222] p-6 text-white [interpolate-size:allow-keywords] transition-[transform,background-color,height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:bg-[#2a2a2a] ${
                compact
                    ? "min-h-[220px]"
                    : "h-[240px] hover:h-auto focus-visible:h-auto hover:z-10 w-[78vw] sm:w-[320px] shrink-0 snap-start"
            }`}
            title={`Open ${project.title} on ${project.link.includes("github.com") ? "GitHub" : "the web"}`}
        >
            {/* Folder tab */}
            <span className="absolute -top-5 left-0 h-5 w-24 rounded-t-xl bg-[#222222] transition-[width,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:w-32 group-hover/card:bg-[#2a2a2a]" />

            <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-xs tabular-nums text-gray-500">{pad(index + 1)}</span>
                <FiArrowUpRight className="text-gray-500 transition-all duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 group-hover/card:text-white" />
            </div>
            <h3 className="mt-4 shrink-0 text-xl font-medium leading-tight tracking-tight">{project.title}</h3>
            {/* Clamped at rest; on hover/focus the card grows to show the full text */}
            <p
                className={`mt-3 text-sm leading-relaxed text-gray-400 transition-colors duration-300 group-hover/card:text-gray-200 group-focus-visible/card:text-gray-200 ${
                    compact
                        ? ""
                        : "line-clamp-3 group-hover/card:line-clamp-none group-focus-visible/card:line-clamp-none"
                }`}
            >
                {project.description}
            </p>
            <span className="mt-auto shrink-0 pt-4 text-xs font-medium uppercase tracking-widest text-gray-500 transition-colors group-hover/card:text-white">
                {project.link.includes("github.com") ? "GitHub" : "Visit"}
            </span>
        </Link>
    );
}

/**
 * Compact single-row rail of folder cards (scroll-snap, arrows, progress),
 * with a toggle that expands it into a full grid and collapses it back.
 */
export default function OtherProjectsRail({ projects }: { projects: OtherProject[] }) {
    const [expanded, setExpanded] = useState(false);
    const [progress, setProgress] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);
    const railRef = useRef<HTMLDivElement>(null);
    const lenis = useLenis();

    useLayoutEffect(() => {
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            gsap.from(".opr-head > *, .opr-body", {
                y: 20,
                opacity: 0,
                duration: 0.7,
                ease: "power2.out",
                stagger: 0.08,
                scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
            });
        });
        return () => mm.revert();
    }, []);

    const scrollRail = (dir: 1 | -1) => {
        const rail = railRef.current;
        if (!rail) return;
        const card = rail.children[0] as HTMLElement | undefined;
        const step = card ? card.offsetWidth + 16 : 320;
        rail.scrollBy({ left: dir * step, behavior: "smooth" });
    };

    const toggle = () => {
        setExpanded((v) => !v);
        if (expanded && sectionRef.current) {
            // Collapsing shortens the page; bring the section back into view
            lenis?.scrollTo(sectionRef.current, { offset: -24 });
        }
        requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    if (projects.length === 0) return null;

    return (
        <section
            ref={sectionRef}
            id="other-projects"
            className="relative z-40 bg-[#141414] text-white px-6 md:px-12 lg:px-16 pt-16 pb-10 md:pt-28 md:pb-20"
        >
            <div className="max-w-[1920px] mx-auto">
                <div className="opr-head mb-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-medium tracking-tight">Other projects</h2>
                        <p className="mt-2 text-gray-400">
                            {pad(projects.length)} projects outside the featured selection
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={toggle}
                            aria-expanded={expanded}
                            className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-[#141414] transition-opacity hover:opacity-85"
                        >
                            {expanded ? <FiMinimize2 size={15} /> : <FiGrid size={15} />}
                            {expanded ? "Collapse" : `Show all ${projects.length}`}
                        </button>
                        <Link
                            href="/projects"
                            className="group/all inline-flex h-11 items-center gap-2 px-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
                        >
                            View all projects
                            <FiArrowUpRight className="transition-transform group-hover/all:translate-x-0.5 group-hover/all:-translate-y-0.5" />
                        </Link>
                    </div>
                </div>

                <div className="opr-body">
                    {expanded ? (
                        <div key="grid" className="pf-fade grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {projects.map((project, i) => (
                                <FolderCard key={project.id ?? i} project={project} index={i} compact />
                            ))}
                        </div>
                    ) : (
                        <div key="rail" className="pf-fade">
                            <div
                                ref={railRef}
                                className="relative z-10 -mx-6 md:-mx-12 lg:-mx-16 flex items-start snap-x snap-mandatory overscroll-x-contain touch-pan-x touch-pan-y gap-4 overflow-x-auto scrollbar-hide px-6 md:px-12 lg:px-16 scroll-px-6 md:scroll-px-12 lg:scroll-px-16 pt-1 pb-4 [@media(hover:hover)_and_(pointer:fine)]:snap-none [@media(hover:hover)_and_(pointer:fine)]:pointer-events-none [@media(hover:hover)_and_(pointer:fine)]:-mb-[220px] [@media(hover:hover)_and_(pointer:fine)]:pb-[236px]"
                                onScroll={(e) => {
                                    const el = e.currentTarget;
                                    const max = el.scrollWidth - el.clientWidth;
                                    setProgress(max > 0 ? el.scrollLeft / max : 0);
                                }}
                            >
                                {projects.map((project, i) => (
                                    <FolderCard key={project.id ?? i} project={project} index={i} />
                                ))}
                            </div>
                            <SliderNav
                                className="mt-6"
                                tone="dark"
                                label="projects"
                                current={Math.round(progress * (projects.length - 1)) + 1}
                                total={projects.length}
                                progress={progress}
                                onPrev={() => scrollRail(-1)}
                                onNext={() => scrollRail(1)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
