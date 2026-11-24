"use client";

import { useState, useRef, useLayoutEffect, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import gsap from "gsap";
import { useLenis } from "./SmoothScroll";

const menuLinks = [
    { title: "Home", href: "#" },
    { title: "Real Me", href: "#realme" },
    { title: "Portfolio", href: "#portfolio" },
    { title: "Contact", href: "#contact" },
];

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const lenis = useLenis();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        if (lenis) {
            // "#" means the top of the page; anything else is a section id
            lenis.scrollTo(href === "#" ? 0 : href, { duration: 1.4 });
        }
        setIsMenuOpen(false);
    };

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Initial Timeline for Menu Open/Close
            const tl = gsap.timeline({ paused: true });

            // 1. Background Expand (Using Brand Primary Color)
            tl.to(bgRef.current, {
                scaleY: 1,
                duration: 1,
                ease: "power4.inOut",
                transformOrigin: "top"
            })
                // 2. Links Stagger In
                .fromTo(".menu-link-item",
                    { y: 100, opacity: 0, skewY: 5 },
                    { y: 0, opacity: 1, skewY: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" },
                    "-=0.4"
                )
                // 3. Socials / Footer Stagger In
                .fromTo(".menu-footer",
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
                    "-=0.6"
                );

            if (isMenuOpen) {
                tl.play();
            } else {
                tl.reverse();
            }

        }, containerRef);

        return () => ctx.revert();
    }, [isMenuOpen]);

    // Hover Animation for Links
    const handleLinkHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const target = e.currentTarget;
        const arrow = target.querySelector(".link-arrow");

        gsap.to(target, { x: 20, duration: 0.3, ease: "power2.out" });
        gsap.to(arrow, { x: 10, opacity: 1, duration: 0.3, ease: "power2.out" });
    };

    const handleLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const target = e.currentTarget;
        const arrow = target.querySelector(".link-arrow");

        gsap.to(target, { x: 0, duration: 0.3, ease: "power2.out" });
        gsap.to(arrow, { x: 0, opacity: 0, duration: 0.3, ease: "power2.out" });
    };

    return (
        <div ref={containerRef}>
            {/* Fixed Header Elements */}
            {/* 1. Logo Container - Absolute on Mobile/Tab (Scrolls away), Fixed on Desktop */}
            <div className="absolute lg:fixed top-0 left-0 w-full z-[100] px-6 py-6 md:px-12 md:py-8 flex justify-between items-center pointer-events-none">
                {/* Logo - Natural Color (No Invert) */}
                <Link
                    href="#"
                    aria-label="Back to top"
                    className="pointer-events-auto z-[100]"
                    onClick={(e) => handleScroll(e, "#")}
                >
                    <Image
                        src="/images/daham-sign-darken.png"
                        alt="Daham Signature"
                        width={120}
                        height={40}
                        className="w-20 md:w-24 h-auto object-contain"
                        priority
                    />
                </Link>
            </div>

            {/* 2. Menu Toggle Button - Always Fixed */}
            {/* Positioned explicitly to match the padding of the logo container */}
            <button
                ref={buttonRef}
                onClick={toggleMenu}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
                className={`group fixed top-6 right-6 md:top-8 md:right-12 z-[100] flex h-12 md:h-14 items-center gap-3 rounded-full pl-[14px] pr-[14px] md:pl-5 md:pr-6 shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#141414]/40 ${
                    isMenuOpen ? "bg-white text-[#141414]" : "bg-[#141414] text-white"
                }`}
            >
                {/* Two lines that morph into an X */}
                <span className="relative block h-5 w-5" aria-hidden>
                    <span
                        className={`absolute left-0 top-1/2 h-[1.5px] w-5 rounded-full bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isMenuOpen ? "rotate-45" : "-translate-y-[4px] group-hover:-translate-y-[5px]"
                        }`}
                    />
                    <span
                        className={`absolute left-0 top-1/2 h-[1.5px] rounded-full bg-current transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isMenuOpen ? "w-5 -rotate-45" : "w-3.5 translate-y-[4px] group-hover:w-5 group-hover:translate-y-[5px]"
                        }`}
                    />
                </span>

                {/* Label slides between Menu / Close */}
                <span className="relative hidden md:block h-5 overflow-hidden font-mono text-xs uppercase tracking-[0.18em]" aria-hidden>
                    <span
                        className={`flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isMenuOpen ? "-translate-y-5" : "translate-y-0"
                        }`}
                    >
                        <span className="h-5 leading-5">Menu</span>
                        <span className="h-5 leading-5">Close</span>
                    </span>
                </span>
            </button>

            {/* Full Screen Menu Overlay */}
            <div
                ref={menuRef}
                className="fixed inset-0 z-[90] pointer-events-none"
            >
                {/* Background Curtain - Brand Primary Color */}
                <div
                    ref={bgRef}
                    className="absolute inset-0 bg-[#141414] scale-y-0 origin-top"
                />

                {/* Menu Content */}
                <div className={`relative h-full w-full max-w-[1920px] mx-auto flex flex-col justify-center items-center ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                    <div ref={linksRef} className="flex flex-col gap-6 md:gap-8 items-start select-none">
                        {menuLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                onClick={(e) => handleScroll(e, link.href)}
                                onMouseEnter={handleLinkHover}
                                onMouseLeave={handleLinkLeave}
                                className="menu-link-item group flex items-center gap-4 text-4xl md:text-7xl lg:text-8xl font-sans font-light text-[#e6e6f0] tracking-tight overflow-hidden opacity-0"
                            >
                                <span className="text-sm md:text-lg font-mono text-tertiary">0{index + 1}</span>
                                <span className="relative">
                                    {link.title}
                                    <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#e6e6f0] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                </span>
                                <FiArrowRight className="link-arrow opacity-0 text-3xl md:text-5xl text-tertiary" />
                            </Link>
                        ))}
                    </div>

                    {/* Footer Info */}
                    <div className="menu-footer absolute bottom-12 w-full px-6 md:px-12 flex flex-col md:flex-row gap-4 justify-between text-tertiary text-sm font-mono uppercase tracking-widest opacity-0">
                        <span>Daham Dissanayake</span>
                        <div className="flex gap-6">
                            <a href="https://github.com/DahamDissanayake" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
                            <a href="https://www.linkedin.com/in/daham-dissanayake/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                            <a href="https://www.instagram.com/dhmdissanayake/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
                            <a href="mailto:dahamdissanayake05@gmail.com" className="hover:text-white transition-colors">Email</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

