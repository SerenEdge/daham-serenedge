"use client";

import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

/**
 * Site-wide smooth scrolling. Lives in the root layout, so every route gets it.
 * Lenis is driven by GSAP's ticker so ScrollTrigger animations stay in sync.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const [lenis, setLenis] = useState<Lenis | null>(null);
    const pathname = usePathname();

    useLayoutEffect(() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const instance = new Lenis({
            lerp: 0.1, // smoothing for wheel/trackpad
            duration: 1.2, // used by scrollTo
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: !reduceMotion,
            wheelMultiplier: 1,
            touchMultiplier: 1.5,
            anchors: { offset: 0 }, // in-page #links glide instead of jumping
            allowNestedScroll: true, // inner scroll areas (thumbnails, panels) scroll natively
            autoRaf: false, // driven by GSAP below
        });

        // Keep ScrollTrigger in sync with Lenis
        instance.on("scroll", ScrollTrigger.update);
        const raf = (time: number) => instance.raf(time * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);

        // Hold the page still while the splash screen is showing
        const root = document.documentElement;
        const syncSplash = () => {
            if (root.classList.contains("splash-active")) instance.stop();
            else instance.start();
        };
        syncSplash();
        const observer = new MutationObserver(syncSplash);
        observer.observe(root, { attributes: true, attributeFilter: ["class"] });

        setLenis(instance);

        return () => {
            observer.disconnect();
            gsap.ticker.remove(raf);
            instance.destroy();
            setLenis(null);
        };
    }, []);

    // New page: start at the top and re-measure scroll animations
    useEffect(() => {
        if (!lenis) return;
        if (!window.location.hash) lenis.scrollTo(0, { immediate: true, force: true });
        const id = requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => cancelAnimationFrame(id);
    }, [pathname, lenis]);

    return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
