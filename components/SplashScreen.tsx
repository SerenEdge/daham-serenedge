"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Length of the draw animation baked into signature-animated-white.svg
// (last stroke ends at ~3.15s), plus a short hold on the finished signature.
const SIGN_DRAW_MS = 3600;

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
            // The signature draws itself (CSS animation inside the SVG, ~3.2s).
            // Just a soft fade-in here so it doesn't pop in.
            gsap.fromTo(logoRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power1.out" });

            const handleExit = () => {
                const tl = gsap.timeline({
                    onComplete: () => {
                        sessionStorage.setItem("splash-loaded", "true");
                        // Cleanup
                        document.documentElement.classList.remove("splash-active");
                        document.documentElement.style.backgroundColor = "";
                        // Clear rather than set "auto": an inline overflow on body turns it into
                        // its own scroll container and breaks position: sticky site-wide.
                        document.body.style.overflow = "";
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

            // Wait for the signature to finish drawing, then for window load
            const siteLoaded = () => {
                if (document.readyState === "complete") {
                    handleExit();
                } else {
                    window.addEventListener("load", handleExit);
                }
            };

            // Ensure it clears even if load event is missed
            const timeoutId = setTimeout(siteLoaded, SIGN_DRAW_MS);

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
            className="fixed inset-0 z-[9999] items-center justify-center bg-[#141414]"
        >
            <div ref={logoRef} className="w-36 min-[720px]:w-56 h-auto">
                {/* Plain <img>: the SVG carries its own CSS draw animation, which
                    starts as soon as the file loads */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/svg/signature-animated-white.svg"
                    alt="Daham Signature"
                    width={498}
                    height={260}
                    className="w-full h-auto"
                    fetchPriority="high"
                />
            </div>
        </div>
    );
}
