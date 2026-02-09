"use client";

import { useState, useRef, useLayoutEffect, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX, FiArrowRight } from "react-icons/fi";
import gsap from "gsap";
import { useLenis } from "./SmoothScroll";

const menuLinks = [
    { title: "Home", href: "#" },
    { title: "Real Me", href: "#realme" },
    { title: "Portfolio", href: "#portfolio" },
    { title: "Resume", href: "#resume" },
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
            lenis.scrollTo(href);
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
                // Animate button to X
                gsap.to(buttonRef.current, { rotate: 90, duration: 0.3 });
            } else {
                tl.reverse();
                // Animate button back to Menu
                gsap.to(buttonRef.current, { rotate: 0, duration: 0.3 });
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
                    className="pointer-events-auto z-[100]"
                    onClick={(e) => handleScroll(e, "#")}
                >
                    <Image
                        src="/images/daham-sign-dark.png"
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
                className={`fixed top-6 right-6 md:top-8 md:right-12 z-[100] flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl transition-colors duration-300 shadow-lg ${isMenuOpen ? 'bg-white text-[#1c1c2b]' : 'bg-[#1c1c2b] text-white'}`}
            >
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Full Screen Menu Overlay */}
            <div
                ref={menuRef}
                className="fixed inset-0 z-[90] pointer-events-none"
            >
                {/* Background Curtain - Brand Primary Color */}
                <div
                    ref={bgRef}
                    className="absolute inset-0 bg-[#1c1c2b] scale-y-0 origin-top"
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
                            <a href="#" className="hover:text-white transition-colors">GitHub</a>
                            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                            <a href="#" className="hover:text-white transition-colors">Instagram</a>
                            <a href="#" className="hover:text-white transition-colors">Email</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

