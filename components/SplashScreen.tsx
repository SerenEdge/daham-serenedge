"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function SplashScreen() {
    const containerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Returning visitor this session: the inline <head> script never added
        // `splash-active`, so the overlay below is already CSS-hidden and
        // there is nothing to animate.
        if (sessionStorage.getItem("splash-loaded")) return;

        // Lock body scroll
        document.body.style.overflow = "hidden";

        const ctx = gsap.context(() => {
            // Initial Zoom-out Animation
            gsap.fromTo(logoRef.current,
                { scale: 3, opacity: 0 },
                { scale: 1, opacity: 1, duration: 2, ease: "power4.out" }
            );

            const handleExit = () => {
                const tl = gsap.timeline({
                    onComplete: () => {
                        sessionStorage.setItem("splash-loaded", "true");
                        // Cleanup
                        document.documentElement.classList.remove("splash-active");
                        document.documentElement.style.backgroundColor = "";
                        document.body.style.overflow = "auto";
                    }
                });

                // Unveil Animation — fades the overlay out to reveal the page
                // underneath. The page itself is never faded: it must stay
                // visible in the DOM for crawlers at all times.
                tl.to(containerRef.current, {
                    opacity: 0,
                    duration: 0.6,
                    ease: "power2.inOut",
                    delay: 0.3
                });
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
    }, []);

    // Always rendered (server and client) so the overlay exists in the very
    // first paint. Actual visibility is driven purely by the `.splash-active`
    // class the inline <head> script sets synchronously before the body
    // paints — never by React state — so there is no gap where the real page
    // is visible before the splash appears.
    return (
        <div
            id="splash-screen-overlay"
            ref={containerRef}
            className="fixed inset-0 z-[9999] items-center justify-center bg-[#1c1c2b]"
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
