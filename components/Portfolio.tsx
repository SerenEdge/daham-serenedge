"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import projectsData from "@/data/projects.json";
import { projectPath } from "@/lib/projects";
import type { PortfolioProject, ProjectsData } from "@/types/projects";
import ProjectGallery from "@/components/ProjectGallery";
import OtherProjectsRail from "@/components/OtherProjectsRail";
import SliderNav from "@/components/SliderNav";

gsap.registerPlugin(ScrollTrigger);

const { portfolio: mainProjects, otherProjects } = projectsData as ProjectsData;

const pad = (n: number) => String(n).padStart(2, "0");
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/** Text block shared by the desktop panel and the mobile slide. */
function ProjectDetails({ project, index }: { project: PortfolioProject; index: number }) {
    return (
        <div className="flex flex-col">
            <span className="font-mono text-base lg:text-sm text-tertiary">{pad(index + 1)}</span>
            <h3 className="mt-2 text-4xl lg:text-3xl xl:text-4xl font-medium tracking-tight text-secondary">
                {project.title}
            </h3>
            <p className="mt-2 text-lg lg:text-base xl:text-lg text-tertiary font-medium">{project.description}</p>

            <h4 className="mt-6 text-xl lg:text-lg font-medium text-secondary">About the project</h4>
            {project.subtitle && (
                <p className="mt-2 font-mono text-sm lg:text-xs uppercase tracking-wider text-tertiary">{project.subtitle}</p>
            )}
            <p className="mt-3 text-[17px] lg:text-[15px] xl:text-base leading-relaxed text-secondary/85">
                {project.longDescription}
            </p>

            {project.tech.length > 0 && (
                <div className="mt-6">
                    <h5 className="mb-3 text-sm lg:text-xs font-medium uppercase tracking-widest text-tertiary">Technologies</h5>
                    <div className="flex flex-wrap gap-1.5">
                        {project.tech.map((tech) => (
                            <span
                                key={tech}
                                className="rounded-full border border-gray-200 px-3 py-1.5 text-sm lg:px-2.5 lg:py-1 lg:text-xs text-secondary"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <Link
                href={projectPath(project)}
                className="group/link mt-6 inline-flex items-center gap-2 self-start text-lg font-medium text-primary transition-opacity hover:opacity-70"
            >
                View More
                <FiArrowUpRight className="transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
            </Link>
        </div>
    );
}

export default function Portfolio() {
    const sectionRef = useRef<HTMLElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);
    const [mobileIndex, setMobileIndex] = useState(0);
    const count = mainProjects.length;

    const go = (i: number) => setActive((i + count) % count);

    const scrollMobileTo = (i: number) => {
        const slider = sliderRef.current;
        const slide = slider?.children[i] as HTMLElement | undefined;
        if (slider && slide) slider.scrollTo({ left: slide.offsetLeft - slider.offsetLeft, behavior: "smooth" });
    };

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();
            mm.add("(prefers-reduced-motion: no-preference)", () => {
                const tl = gsap.timeline({
                    scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
                });
                tl.from(".pf-head > *", { y: 24, opacity: 0, duration: 0.7, ease: "power2.out", stagger: 0.08 })
                    .from(
                        ".pf-panel",
                        { y: 32, opacity: 0, duration: 0.7, ease: "power2.out", stagger: 0.07 },
                        0.15
                    )
                    .from(".pf-slider", { y: 24, opacity: 0, duration: 0.7, ease: "power2.out" }, 0.15);
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <>
            <section
                id="portfolio"
                ref={sectionRef}
                className="relative w-full bg-background text-secondary px-6 md:px-12 lg:px-16 pt-24 pb-16 md:pt-32 md:pb-24"
            >
                <div className="max-w-[1920px] mx-auto">
                    {/* Header */}
                    <div className="pf-head mb-10 md:mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-5xl md:text-8xl lg:text-9xl font-medium tracking-tight text-secondary leading-[0.8] mb-4 lg:mb-6">
                                Portfolio
                            </h2>
                            <div className="flex items-center gap-4 text-tertiary">
                                <span className="h-[1px] w-12 bg-tertiary/50 hidden lg:block" />
                                <span className="text-sm lg:text-base font-mono uppercase tracking-wider">Selected Works</span>
                            </div>
                        </div>
                    </div>

                    {/* Desktop: focus-slice panels */}
                    <div
                        className="hidden lg:flex gap-3 h-[640px] xl:h-[600px]"
                        role="tablist"
                        aria-label="Selected works"
                        onKeyDown={(e) => {
                            if (e.key === "ArrowRight") go(active + 1);
                            if (e.key === "ArrowLeft") go(active - 1);
                        }}
                    >
                        {mainProjects.map((project, i) => {
                            const isActive = i === active;
                            return (
                                <div
                                    key={project.id ?? i}
                                    className={`pf-panel relative overflow-hidden rounded-3xl transition-[flex-grow,background-color] duration-700 ${EASE} ${
                                        isActive
                                            ? "grow-[12] basis-0 bg-white border border-gray-200"
                                            : "grow basis-0 min-w-[84px] bg-[#141414] cursor-pointer"
                                    }`}
                                    onClick={() => !isActive && setActive(i)}
                                >
                                    {isActive ? (
                                        <div
                                            key={`open-${i}`}
                                            role="tabpanel"
                                            className="pf-fade grid h-full grid-cols-12 gap-8 p-6 xl:p-8 [animation-delay:200ms]"
                                        >
                                            <div className="col-span-7 flex flex-col justify-center">
                                                <ProjectGallery
                                                    images={project.images ?? []}
                                                    title={project.title}
                                                />
                                            </div>
                                            <div
                                                className="col-span-5 overflow-y-auto scrollbar-hide pr-1 pb-10 [mask-image:linear-gradient(to_bottom,black_88%,transparent)]"
                                                data-lenis-prevent
                                            >
                                                <ProjectDetails project={project} index={i} />
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            role="tab"
                                            aria-selected={false}
                                            aria-label={`Open ${project.title}`}
                                            className="group/slice absolute inset-0 flex flex-col items-center justify-between py-7 text-white"
                                        >
                                            {project.images?.[0] && (
                                                <Image
                                                    src={project.images[0]}
                                                    alt=""
                                                    fill
                                                    sizes="160px"
                                                    quality={40}
                                                    className="object-cover scale-125 blur-xl opacity-25 grayscale brightness-75 transition-opacity duration-500 group-hover/slice:opacity-40"
                                                />
                                            )}
                                            <span className="relative font-mono text-sm text-gray-400">{pad(i + 1)}</span>
                                            <span
                                                className="relative text-xl font-medium tracking-tight whitespace-nowrap"
                                                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                                            >
                                                {project.title}
                                            </span>
                                            <FiArrowUpRight className="relative text-lg text-gray-400 transition-colors group-hover/slice:text-white" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <SliderNav
                        className="mt-6 hidden lg:flex"
                        label="project"
                        current={active + 1}
                        total={count}
                        progress={(active + 1) / count}
                        onPrev={() => go(active - 1)}
                        onNext={() => go(active + 1)}
                    />

                    {/* Mobile/tablet: swipe slider */}
                    <div className="pf-slider lg:hidden">
                        <div className="mb-5 flex gap-2 overflow-x-auto scrollbar-hide">
                            {mainProjects.map((project, i) => (
                                <button
                                    key={project.id ?? i}
                                    type="button"
                                    onClick={() => scrollMobileTo(i)}
                                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                        i === mobileIndex
                                            ? "bg-[#141414] text-white"
                                            : "border border-gray-300 text-secondary"
                                    }`}
                                >
                                    {project.title}
                                </button>
                            ))}
                        </div>

                        <div
                            ref={sliderRef}
                            className="-mx-6 md:-mx-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-hide px-6 md:px-12 scroll-px-6 md:scroll-px-12"
                            onScroll={(e) => {
                                const el = e.currentTarget;
                                const first = el.children[0] as HTMLElement | undefined;
                                if (!first) return;
                                const i = Math.round(el.scrollLeft / (first.offsetWidth + 16));
                                if (i !== mobileIndex) setMobileIndex(Math.min(count - 1, Math.max(0, i)));
                            }}
                        >
                            {mainProjects.map((project, i) => (
                                <article
                                    key={project.id ?? i}
                                    className="w-[88vw] md:w-[80vw] max-w-2xl shrink-0 snap-start rounded-3xl border border-gray-200 bg-white p-5 md:p-7"
                                >
                                    <ProjectGallery images={project.images ?? []} title={project.title} />
                                    <div className="mt-6">
                                        <ProjectDetails project={project} index={i} />
                                    </div>
                                </article>
                            ))}
                        </div>

                        <SliderNav
                            className="mt-6"
                            label="project"
                            current={mobileIndex + 1}
                            total={count}
                            progress={(mobileIndex + 1) / count}
                            onPrev={() => scrollMobileTo(Math.max(0, mobileIndex - 1))}
                            onNext={() => scrollMobileTo(Math.min(count - 1, mobileIndex + 1))}
                        />
                    </div>
                </div>
            </section>

            <OtherProjectsRail projects={otherProjects} />
        </>
    );
}
