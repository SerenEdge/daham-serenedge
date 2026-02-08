"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import { useLenis } from "./SmoothScroll";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const lenis = useLenis();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        if (lenis) {
            lenis.scrollTo(href);
        }
        if (isMenuOpen) setIsMenuOpen(false);
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
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                color: "#000",
                                borderRadius: "50px",
                                maxWidth: "550px",
                                boxShadow: "0 4px 20px -8px rgba(0,0,0,0.15)",
                                padding: "8px 24px",
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
                            gsap.set(logo, { autoAlpha: 0 });

                            // 3. Prepare Icon for animation (slide down)
                            gsap.fromTo(menuBtn,
                                { y: -20, autoAlpha: 0 },
                                { y: 0, autoAlpha: 1, duration: 0.5, ease: "back.out(1.7)" }
                            );

                            // Ensure background is transparent
                            gsap.set(navRef.current, { backgroundColor: "transparent", boxShadow: "none", padding: "16px 24px" });
                        },
                        onLeaveBack: () => {
                            if (!wrapperRef.current || !logo || !menuBtn) return;

                            // Reset to Absolute / Default
                            gsap.set(wrapperRef.current, { position: "absolute", top: 0, left: 0 });
                            gsap.set(logo, { autoAlpha: 1 });
                            gsap.set(menuBtn, { y: 0, autoAlpha: 1 });
                        }
                    });

                    // Keep navbar icon color fixed at --secondary (#1c1c2b)
                    gsap.set(navRef.current, { color: "#1c1c2b" });
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
                color: "#1c1c2b", // Always keep --secondary color
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
                            href="#"
                            className="z-50 nav-logo block"
                            onClick={(e) => handleScroll(e, "#")}
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
                            <Link href="#realme" onClick={(e) => handleScroll(e, "#realme")} className="hover:text-primary hover:underline underline-offset-4 decoration-primary transition-colors">Real Me</Link>
                            <Link href="#portfolio" onClick={(e) => handleScroll(e, "#portfolio")} className="hover:text-primary hover:underline underline-offset-4 decoration-primary transition-colors">Portfolio</Link>
                            <Link href="#resume" onClick={(e) => handleScroll(e, "#resume")} className="hover:text-primary hover:underline underline-offset-4 decoration-primary transition-colors">Resume</Link>
                        </div>

                        {/* Desktop Contact */}
                        <div className="hidden min-[720px]:block">
                            <Link href="#contact" onClick={(e) => handleScroll(e, "#contact")} className="flex items-center gap-1 hover:text-primary hover:underline underline-offset-4 decoration-primary transition-colors text-base whitespace-nowrap font-medium">
                                Contact Me <span>↗</span>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="min-[720px]:hidden z-50 focus:outline-none p-2 -mr-2 text-inherit nav-menu-btn bg-background rounded-lg"
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
                        <Link href="#" onClick={(e) => handleScroll(e, "#")} className="hover:text-primary transition-colors">Hello</Link>
                        <Link href="#realme" onClick={(e) => handleScroll(e, "#realme")} className="hover:text-primary transition-colors">Real Me</Link>
                        <Link href="#portfolio" onClick={(e) => handleScroll(e, "#portfolio")} className="hover:text-primary transition-colors">Portfolio</Link>
                        <Link href="#resume" onClick={(e) => handleScroll(e, "#resume")} className="hover:text-primary transition-colors">Resume</Link>
                        <Link href="#contact" onClick={(e) => handleScroll(e, "#contact")} className="hover:text-primary transition-colors flex items-center justify-center gap-2">
                            Contact Me <span>↗</span>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}
