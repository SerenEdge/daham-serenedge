"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Check if this is the first load of the session
        const hasLoaded = sessionStorage.getItem("splash-loaded");
        if (!hasLoaded) {
            setIsVisible(true);
            // Lock body scroll
            document.body.style.overflow = "hidden";
        }
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const ctx = gsap.context(() => {
            // Initial Zoom-out Animation
            gsap.fromTo(logoRef.current,
                { scale: 3, opacity: 0 },
                { scale: 1, opacity: 1, duration: 2, ease: "power4.out" }
            );

            const handleExit = () => {
                const tl = gsap.timeline({
                    onComplete: () => {
                        setIsVisible(false);
                        sessionStorage.setItem("splash-loaded", "true");
                        // Cleanup
                        document.documentElement.classList.remove("splash-active");
                        document.documentElement.style.backgroundColor = "";
                        document.body.style.overflow = "auto";
                    }
                });

                // Unveil Animation
                tl.to(containerRef.current, {
                    opacity: 0,
                    duration: 0.6,
                    ease: "power2.inOut",
                    delay: 0.3
                })
                    .to("#content-wrapper", {
                        opacity: 1,
                        visibility: "visible",
                        duration: 0.6,
                        ease: "power2.inOut"
                    }, "-=0.6"); // Sync with splash fade
            };

            // Wait for window load or at least 2.5 seconds (minimal zoom time + buffer)
            const siteLoaded = () => {
                if (document.readyState === "complete") {
                    handleExit();
                } else {
                    window.addEventListener("load", handleExit);
                }
            };

            // Ensure it clears even if load event is missed
            const timeoutId = setTimeout(siteLoaded, 2500);

            return () => {
                window.removeEventListener("load", handleExit);
                clearTimeout(timeoutId);
            };
        });

        return () => ctx.revert();
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#1c1c2b]"
        >
            <div ref={logoRef} className="w-32 min-[720px]:w-48 h-auto">
                <Image
                    src="/images/daham-sign-white.png"
                    alt="Daham Signature"
                    width={300}
                    height={100}
                    className="w-full h-auto object-contain"
                    priority
                />
            </div>
        </div>
    );
}
