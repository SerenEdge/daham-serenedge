"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiUser, FiBriefcase, FiCode } from "react-icons/fi";
import {
    SiPython, SiJavascript, SiTypescript, SiCplusplus, SiNextdotjs, SiReact,
    SiTailwindcss, SiFigma, SiHtml5, SiCss3, SiEspressif, SiRaspberrypi,
    SiPytorch, SiOpencv, SiTensorflow, SiEdgeimpulse, SiGit, SiDocker,
    SiMysql, SiGnubash
} from "react-icons/si";
import { FaJava, FaBrain } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

type AudienceType = 'anyone' | 'recruiters' | 'developers';

const content = {
    anyone: {
        label: "Everyone",
        icon: FiUser,
        text: (
            <>
                <span className="text-4xl min-[720px]:text-6xl text-secondary font-medium">"</span>I’m a Computer Science undergrad who has been hooked on tech since childhood. I love building clean, well-planned solutions for real-world problems. I always prioritize clear code, proper formatting, and purposeful, modern execution.<span className="text-4xl min-[720px]:text-6xl text-secondary font-medium">"</span>
            </>
        )
    },
    recruiters: {
        label: "Recruiters",
        icon: FiBriefcase,
        text: (
            <>
                <span className="text-4xl min-[720px]:text-6xl text-secondary font-medium">"</span>I’m a developer who loves the 'learn by doing' approach. I interested in ML and IoT, and I’m great at picking up new tech on the fly. I deliver clean, reliable, and disciplined work that stays to the point.<span className="text-4xl min-[720px]:text-6xl text-secondary font-medium">"</span>
            </>
        )
    },
    developers: {
        label: "Developers",
        icon: FiCode,
        text: (
            <>
                <span className="text-4xl min-[720px]:text-6xl text-secondary font-medium">"</span>I’m a dev who values clean, readable code and proper formatting. I’m always down for a collab or a competition, so hit me up!<span className="text-4xl min-[720px]:text-6xl text-secondary font-medium">"</span>
            </>
        )
    }
};

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
    const [audience, setAudience] = useState<AudienceType>('anyone');
    const containerRef = useRef(null);
    const textRef = useRef<HTMLDivElement>(null);
    const quoteRef = useRef<HTMLDivElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);

    // Initial Scroll Animation
    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(containerRef.current, {
                opacity: 0,
                y: 50,
                duration: 1,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            });

            // Marquee Animation
            const marquee = marqueeRef.current;
            if (marquee) {
                const totalWidth = marquee.scrollWidth / 2; // Since we duplicated the list

                gsap.to(marquee, {
                    x: -totalWidth,
                    duration: 40, // Adjust speed here
                    ease: "none",
                    repeat: -1
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Text Change Animation
    useEffect(() => {
        if (!textRef.current) return;

        // Split text animation logic could go here, but simple fade is cleaner for dynamic interactions
        gsap.fromTo(textRef.current,
            { opacity: 0, y: 20, filter: "blur(10px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power2.out" }
        );
    }, [audience]);

    return (
        <section
            id="realme"
            ref={containerRef}
            className="w-full min-h-screen bg-background text-secondary px-6 min-[720px]:px-12 lg:px-16 pt-10 min-[720px]:py-20 lg:py-32 flex flex-col justify-center relative z-20"
        >
            <div className="max-w-[1920px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 mb-24 lg:mb-0">
                {/* Header & Controls */}
                <div className="lg:col-span-5 flex flex-col justify-between h-full">
                    <div>
                        <div className="flex flex-col items-start w-full mb-8 lg:mb-12 border-b border-gray-200 lg:border-none pb-8 lg:pb-0">
                            <h2 className="text-5xl lg:text-9xl xl:text-[10vw] font-medium tracking-tight text-secondary leading-[0.8] mb-4 lg:mb-8">
                                Real Me
                            </h2>
                            <div className="flex items-center gap-4 text-tertiary">
                                <span className="h-[1px] w-12 bg-tertiary/50 hidden lg:block"></span>
                                <span className="text-sm lg:text-base font-mono uppercase tracking-wider">
                                    Choose your POV
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 items-start">
                            <div className="flex flex-wrap gap-6">
                                {(Object.keys(content) as AudienceType[]).map((key) => {
                                    const isActive = audience === key;
                                    const ItemIcon = content[key].icon;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => setAudience(key)}
                                            className={`
                                                relative text-xl cursor-pointer transition-all duration-300 flex items-center gap-2 pb-1
                                                ${isActive
                                                    ? 'text-secondary border-b border-secondary'
                                                    : 'text-tertiary hover:text-secondary border-b border-transparent'
                                                }
                                            `}
                                        >
                                            <ItemIcon className="text-xl" />
                                            {content[key].label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dynamic Content */}
                <div className="lg:col-span-7 flex items-center">
                    <div ref={quoteRef} className="relative pt-8 lg:pt-0">
                        <div
                            ref={textRef}
                            className="text-3xl min-[720px]:text-4xl lg:text-5xl leading-tight font-light text-secondary"
                        >
                            {content[audience].text}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tech Stack Marquee */}
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
