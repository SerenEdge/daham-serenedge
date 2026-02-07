"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function RealMe() {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const textRef = useRef<HTMLQuoteElement>(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "top top",
                    scrub: 1,
                }
            });

            gsap.from(contentRef.current, {
                y: 100,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            });

            if (textRef.current) {
                const words = textRef.current.querySelectorAll(".word");
                gsap.from(words, {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.05,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: textRef.current,
                        start: "top 75%",
                    }
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="realme" ref={containerRef} className="w-full h-screen bg-primary text-light-text px-6 min-[720px]:px-12 lg:px-16 py-20 min-[720px]:py-32 flex flex-col relative z-20">
            {/* Header Content */}
            <div ref={contentRef} className="flex flex-col gap-4">
                <h2 className="text-4xl min-[720px]:text-6xl font-medium tracking-tight">REAL ME</h2>
                <div className="flex gap-4 text-sm min-[720px]:text-base text-inherit">
                    <span>For:</span>
                    <span className="text-[#32324D]">Anyone</span>
                    <span className="text-inherit">Recruiters</span>
                    <span className="text-[#32324D]">Developers</span>
                </div>
            </div>

            {/* Quote Content */}
            <div className="flex-1 flex items-center justify-center">
                <blockquote ref={textRef} className="max-w-4xl text-2xl min-[720px]:text-4xl lg:text-5xl leading-tight font-light text-center">
                    <span className="word inline-block mr-2">"</span>
                    <span className="word inline-block mr-2">I'm</span>
                    <span className="word inline-block mr-2">a</span>
                    <span className="word inline-block mr-2">perfectionist</span>
                    <span className="word inline-block mr-2">when</span>
                    <span className="word inline-block mr-2">it</span>
                    <span className="word inline-block mr-2">comes</span>
                    <span className="word inline-block mr-2">to</span>
                    <span className="word inline-block mr-2">clean</span>
                    <span className="word inline-block mr-2">code</span>
                    <span className="word inline-block mr-2">and</span>
                    <span className="word inline-block mr-2">a</span>
                    <span className="word inline-block mr-2">tidy</span>
                    <span className="word inline-block mr-2">workspace.</span>
                    <br className="hidden min-[720px]:block" />
                    <span className="word inline-block mr-2">I</span>
                    <span className="word inline-block mr-2">enjoy</span>
                    <span className="word inline-block mr-2">learning</span>
                    <span className="word inline-block mr-2">across</span>
                    <span className="word inline-block mr-2">the</span>
                    <span className="word inline-block mr-2">stack</span>
                    <span className="word inline-block mr-2">and</span>
                    <span className="word inline-block mr-2">won't</span>
                    <span className="word inline-block mr-2">stop</span>
                    <span className="word inline-block mr-2">until</span>
                    <span className="word inline-block mr-2">I've</span>
                    <span className="word inline-block mr-2">figured</span>
                    <span className="word inline-block mr-2">out</span>
                    <span className="word inline-block mr-2">how</span>
                    <span className="word inline-block mr-2">to</span>
                    <span className="word inline-block mr-2">finish</span>
                    <span className="word inline-block mr-2">the</span>
                    <span className="word inline-block mr-2">project.</span>
                    <span className="word inline-block mr-2">"</span>
                </blockquote>
            </div>
        </section>
    );
}
