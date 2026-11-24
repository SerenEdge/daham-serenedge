"use client";

import { useRef, useLayoutEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    SiPython, SiJavascript, SiTypescript, SiCplusplus, SiNextdotjs, SiReact,
    SiTailwindcss, SiFigma, SiHtml5, SiEspressif, SiRaspberrypi,
    SiPytorch, SiOpencv, SiTensorflow, SiEdgeimpulse, SiGit, SiDocker,
    SiMysql, SiGnubash,
} from "react-icons/si";
import { FaJava, FaBrain } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const lead = "I like taking things apart to see how they work, then building something new from the pieces.";
const LEAD_MUTED_FROM = 9; // "then…" onward is muted

const SOCIALS_URL = "https://www.instagram.com/dhmdissanayake/";
const PHOTOGRAPHY_URL = "https://500px.com/p/dahamdissanayake";

const linkCls =
    "text-secondary underline decoration-transparent underline-offset-[0.2em] transition-[text-decoration-color] duration-300 hover:decoration-secondary";

/* Unchanged: tech stack marquee list */
const technologies = [
    { name: "Python", icon: SiPython },
    { name: "JavaScript", icon: SiJavascript },
    { name: "TypeScript", icon: SiTypescript },
    { name: "Java", icon: FaJava },
    { name: "C++", icon: SiCplusplus },
    { name: "Next.js", icon: SiNextdotjs },
    { name: "React", icon: SiReact },
    { name: "Tailwind CSS", icon: SiTailwindcss },
    { name: "Figma", icon: SiFigma },
    { name: "HTML5 / CSS3", icon: SiHtml5 },
    { name: "ESP32", icon: SiEspressif },
    { name: "Raspberry Pi", icon: SiRaspberrypi },
    { name: "YOLO", icon: FaBrain }, // Using Brain icon for AI/ML as generic
    { name: "PyTorch", icon: SiPytorch },
    { name: "OpenCV", icon: SiOpencv },
    { name: "TensorFlow", icon: SiTensorflow },
    { name: "Edge Impulse", icon: SiEdgeimpulse },
    { name: "Git", icon: SiGit },
    { name: "Docker", icon: SiDocker },
    { name: "MySQL", icon: SiMysql },
    { name: "Bash", icon: SiGnubash },
];

export default function RealMe() {
    const containerRef = useRef<HTMLElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();
            mm.add("(prefers-reduced-motion: no-preference)", () => {
                const tl = gsap.timeline({
                    scrollTrigger: { trigger: containerRef.current, start: "top 70%", once: true },
                });
                tl.from(".rm-head > *", { y: 24, opacity: 0, duration: 0.7, ease: "power2.out", stagger: 0.08 })
                    .from(".rm-word", { yPercent: 100, duration: 0.6, ease: "power3.out", stagger: 0.025 }, 0.1)
                    .from(".rm-bio", { y: 20, opacity: 0, duration: 0.7, ease: "power2.out", stagger: 0.12 }, 0.5);
            });

            // Marquee Animation (Continuous Loop) — unchanged
            const marquee = marqueeRef.current;
            if (marquee) {
                const totalWidth = marquee.scrollWidth / 2; // Since we duplicated the list
                gsap.to(marquee, {
                    x: -totalWidth,
                    duration: 40, // Adjust speed here
                    ease: "none",
                    repeat: -1,
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="realme"
            ref={containerRef}
            className="w-full bg-background text-secondary px-6 md:px-12 lg:px-16 pt-10 md:pt-14 pb-40 relative z-20"
        >
            {/* Soft hand-off from the hero */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -top-40 h-40 bg-gradient-to-b from-transparent to-background"
            />

            <div className="max-w-[1920px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
                {/* Heading */}
                <div className="rm-head lg:col-span-4 flex flex-col items-start">
                    <h2 className="text-6xl md:text-8xl font-medium tracking-tight text-secondary leading-[0.8] mb-6 lg:mb-8">
                        Real Me
                    </h2>
                    <div className="flex items-center gap-4 text-tertiary">
                        <span className="h-[1px] w-12 bg-tertiary/50 hidden lg:block" />
                        <span className="text-sm lg:text-base font-mono uppercase tracking-wider">About me</span>
                    </div>
                </div>

                {/* Lead + bio */}
                <div className="lg:col-span-8">
                    <p className="text-3xl md:text-5xl xl:text-[3.4rem] font-medium tracking-tight leading-[1.12] text-secondary">
                        {lead.split(" ").map((word, i) => (
                            <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
                                <span className={`rm-word inline-block ${i >= LEAD_MUTED_FROM ? "text-tertiary" : ""}`}>
                                    {word}&nbsp;
                                </span>
                            </span>
                        ))}
                    </p>

                    <div className="mt-10 md:mt-14 flex flex-col gap-6 md:gap-8 max-w-3xl text-lg md:text-2xl leading-[1.6] md:leading-[1.55] text-tertiary">
                        <p className="rm-bio">
                            I&apos;m a Computer Science undergraduate at the University of Westminster through IIT Sri Lanka,
                            building{" "}
                            <Link href="/projects/sotercare" className={linkCls}>SoterCare</Link> and{" "}
                            <Link href="/projects/serenedge" className={linkCls}>SerenEdge (Pvt) Ltd</Link>, and working full
                            time as a research intern in edge AI and robotics.
                        </p>
                        <p className="rm-bio">
                            Most of what I build sits where hardware meets software: robotics, Raspberry Pi projects, a
                            self-hosted stack at home and models trained on GPUs. Away from code, I make{" "}
                            <Link href={SOCIALS_URL} target="_blank" rel="noopener noreferrer" className={linkCls}>vlogs</Link>{" "}
                            for my socials and share my{" "}
                            <Link href={PHOTOGRAPHY_URL} target="_blank" rel="noopener noreferrer" className={linkCls}>photography</Link>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Tech Stack Marquee — unchanged */}
            <div className="absolute bottom-0 left-0 w-full py-8 border-t border-gray-200/10 bg-background/50 backdrop-blur-sm overflow-hidden flex">
                <div ref={marqueeRef} className="flex gap-16 items-center whitespace-nowrap pl-16">
                    {[...technologies, ...technologies].map((tech, index) => (
                        <div key={index} className="flex items-center gap-3 text-tertiary">
                            <tech.icon className="text-2xl" />
                            <span className="text-lg font-mono uppercase tracking-wider">{tech.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
