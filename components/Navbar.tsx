"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        let ctx = gsap.context(() => {
            ScrollTrigger.matchMedia({
                // Desktop: Pill Animation
                "(min-width: 720px)": function () {
                    ScrollTrigger.create({
                        trigger: document.body,
                        start: "200 top",
                        end: "bottom bottom",
                        onEnter: () => {
                            gsap.set(wrapperRef.current, { position: "fixed", top: 0, left: 0, yPercent: -100 });
                            gsap.set(navRef.current, {
                                backgroundColor: "rgba(255, 255, 255, 1)",
                                color: "#000",
                                borderRadius: "50px",
                                maxWidth: "600px",
                                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
                                padding: "10px 30px",
                                marginTop: "0px"
                            });
                            gsap.to(wrapperRef.current, { yPercent: 0, duration: 0.8, ease: "power2.out" });
                        },
                        onLeaveBack: () => {
                            gsap.to(wrapperRef.current, {
                                yPercent: -100,
                                duration: 0.3,
                                ease: "power3.in",
                                onComplete: () => {
                                    gsap.set(wrapperRef.current, { position: "absolute", top: 0, left: 0, yPercent: 0 });
                                    gsap.set(navRef.current, {
                                        backgroundColor: "rgba(255, 255, 255, 0)",
                                        color: "var(--secondary)",
                                        borderRadius: "0px",
                                        maxWidth: "100%",
                                        boxShadow: "none",
                                        padding: "16px 24px",
                                        marginTop: "0px"
                                    });
                                }
                            });
                        }
                    });
                },
                // Mobile: Sticky Icon Only (From Right) & Color Switching
                "(max-width: 719px)": function () {
                    if (!navRef.current) return;

                    const logo = navRef.current.querySelector(".nav-logo");
                    const menuBtn = navRef.current.querySelector(".nav-menu-btn");

                    // Sticky & Animation Logic
                    ScrollTrigger.create({
                        trigger: document.body,
                        start: "200 top",
                        end: "bottom bottom",
                        onEnter: () => {
                            if (!wrapperRef.current || !logo || !menuBtn) return;

                            // 1. Fix Wrapper
                            gsap.set(wrapperRef.current, { position: "fixed", top: 0, left: 0, width: "100%" });

                            // 2. Hide Logo (so only icon is visible)
                            gsap.set(logo, { autoAlpha: 0, display: "none" });

                            // 3. Prepare Icon for animation (from right)
                            gsap.fromTo(menuBtn,
                                { x: 50, autoAlpha: 0 },
                                { x: 0, autoAlpha: 1, duration: 0.5, ease: "back.out(1.7)" }
                            );

                            // Ensure background is transparent
                            gsap.set(navRef.current, { backgroundColor: "transparent", boxShadow: "none", padding: "16px 24px" });
                        },
                        onLeaveBack: () => {
                            if (!wrapperRef.current || !logo || !menuBtn) return;

                            // Reset to Absolute / Default
                            gsap.set(wrapperRef.current, { position: "absolute", top: 0, left: 0 });
                            gsap.set(logo, { autoAlpha: 1, display: "block" });
                            gsap.set(menuBtn, { x: 0, autoAlpha: 1 });
                        }
                    });

                    // --- SECTION COLOR SWITCHING ---

                    // 1. Hero / Home (Light Background -> Dark Icon)
                    ScrollTrigger.create({
                        trigger: "#home",
                        start: "top center",
                        end: "bottom center",
                        onEnter: () => gsap.to(navRef.current, { color: "#1c1c2b", duration: 0.3 }), // --secondary
                        onEnterBack: () => gsap.to(navRef.current, { color: "#1c1c2b", duration: 0.3 }),
                    });

                    // 2. Real Me (Dark Background -> Light Icon)
                    ScrollTrigger.create({
                        trigger: "#realme",
                        start: "top center",
                        end: "bottom center",
                        onEnter: () => gsap.to(navRef.current, { color: "#e6e6f0", duration: 0.3 }), // --light-text
                        onEnterBack: () => gsap.to(navRef.current, { color: "#e6e6f0", duration: 0.3 }),
                    });

                    // 3. Placeholder: Portfolio (Add ID and Color here)
                    /*
                    ScrollTrigger.create({
                        trigger: "#portfolio",
                        start: "top center",
                        end: "bottom center",
                        onEnter: () => gsap.to(navRef.current, { color: "#1c1c2b", duration: 0.3 }),
                        onEnterBack: () => gsap.to(navRef.current, { color: "#1c1c2b", duration: 0.3 }),
                    });
                    */

                    // 4. Placeholder: Resume (Add ID and Color here)
                    /*
                    ScrollTrigger.create({
                        trigger: "#resume",
                        start: "top center",
                        end: "bottom center",
                        onEnter: () => gsap.to(navRef.current, { color: "#1c1c2b", duration: 0.3 }),
                        onEnterBack: () => gsap.to(navRef.current, { color: "#1c1c2b", duration: 0.3 }),
                    });
                    */
                }
            });
        }, wrapperRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        // When menu opens, reset/adjust state
        if (isMenuOpen) {
            // Force transparent and visible styling
            gsap.to(navRef.current, {
                backgroundColor: "transparent",
                color: "var(--secondary)", // Make sure close icon is visible against light menu bg
                // Note: If menu overly is dark, we might need different color. 
                // Current overlay has bg-background (light) -> text-secondary (dark). Correct.
                duration: 0.3
            });
        }
    }, [isMenuOpen]);

    return (
        <>

            <div ref={wrapperRef} className="absolute top-0 left-0 w-full z-[100] flex justify-center pointer-events-none p-6 min-[720px]:p-12 pt-4 min-[720px]:pt-8 w-full">
                <nav
                    ref={navRef}
                    className="relative w-full max-w-[1920px] px-6 py-4 pointer-events-auto text-secondary bg-transparent"
                >
                    <div className="flex justify-between items-center w-full relative">

                        {/* Logo / Brand - Always visible initially, hidden by GSAP on mobile scroll */}
                        <Link
                            href="#home"
                            className="z-50 nav-logo block"
                        >
                            <Image
                                src="/images/daham-sign-dark.png"
                                alt="Daham Signature"
                                width={120}
                                height={40}
                                className="w-16 min-[720px]:w-20 h-auto object-contain"
                                priority
                            />
                        </Link>

                        {/* Centered Desktop Links */}
                        <div className="hidden min-[720px]:flex gap-8 text-base font-medium absolute left-1/2 -translate-x-1/2">
                            <Link href="#realme" className="hover:text-primary hover:underline underline-offset-4 decoration-primary transition-colors">Real Me</Link>
                            <Link href="#portfolio" className="hover:text-primary hover:underline underline-offset-4 decoration-primary transition-colors">Portfolio</Link>
                            <Link href="#resume" className="hover:text-primary hover:underline underline-offset-4 decoration-primary transition-colors">Resume</Link>
                        </div>

                        {/* Desktop Contact */}
                        <div className="hidden min-[720px]:block">
                            <Link href="#contact" className="flex items-center gap-1 hover:text-primary hover:underline underline-offset-4 decoration-primary transition-colors text-base whitespace-nowrap font-medium">
                                Contact Me <span>↗</span>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="min-[720px]:hidden z-50 focus:outline-none p-2 -mr-2 text-inherit nav-menu-btn"
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu Overlay - Moved outside wrapper to avoid transform clipping */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-background flex flex-col justify-center items-center z-[90] min-[720px]:hidden text-secondary">
                    <div className="flex flex-col gap-8 text-2xl font-light text-center">
                        <Link href="#home" onClick={toggleMenu} className="hover:text-primary transition-colors">Hello</Link>
                        <Link href="#realme" onClick={toggleMenu} className="hover:text-primary transition-colors">Real Me</Link>
                        <Link href="#portfolio" onClick={toggleMenu} className="hover:text-primary transition-colors">Portfolio</Link>
                        <Link href="#resume" onClick={toggleMenu} className="hover:text-primary transition-colors">Resume</Link>
                        <Link href="#contact" onClick={toggleMenu} className="hover:text-primary transition-colors flex items-center justify-center gap-2">
                            Contact Me <span>↗</span>
                        </Link>
                    </div>
                </div>
            )}

        </>
    );
}
