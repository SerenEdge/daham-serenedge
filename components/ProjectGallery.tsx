"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiX } from "react-icons/fi";
import { useLenis } from "@/components/SmoothScroll";

interface ProjectGalleryProps {
    images: string[];
    title: string;
    /** Sizing for the stage; defaults to a 16:10 box. */
    stageClassName?: string;
}

/**
 * Fixed 16:10 stage that always shows the whole image (object-contain).
 * Letterbox space uses the plain light site background. Images cross-fade
 * with a slight settle instead of sliding.
 */
export default function ProjectGallery({ images, title, stageClassName = "aspect-[16/10]" }: ProjectGalleryProps) {
    const count = images.length;
    const [index, setIndex] = useState(0);
    const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
    const [lightbox, setLightbox] = useState(false);
    const pointerStart = useRef<number | null>(null);
    const thumbsRef = useRef<HTMLDivElement>(null);
    const lenis = useLenis();

    const go = useCallback(
        (next: number) => {
            const target = (next + count) % count;
            setIndex(target);
            setSeen((prev) => (prev.has(target) ? prev : new Set(prev).add(target)));
        },
        [count]
    );

    const prev = useCallback(() => go(index - 1), [go, index]);
    const next = useCallback(() => go(index + 1), [go, index]);

    // Keep the active thumbnail in view
    useEffect(() => {
        // Scroll only the thumbnail strip, never the page or a parent slider
        const strip = thumbsRef.current;
        const thumb = strip?.children[index] as HTMLElement | undefined;
        if (!strip || !thumb) return;
        const left = thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2;
        strip.scrollTo({ left, behavior: "smooth" });
    }, [index]);

    // Lightbox: keyboard + scroll lock
    useEffect(() => {
        if (!lightbox) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLightbox(false);
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", onKey);
        lenis?.stop();
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            lenis?.start();
            document.body.style.overflow = "";
        };
    }, [lightbox, prev, next, lenis]);

    // Only mount the current image, its neighbours and anything already viewed
    const shouldRender = (k: number) =>
        seen.has(k) || k === index || k === (index + 1) % count || k === (index - 1 + count) % count;

    const onPointerDown = (e: React.PointerEvent) => {
        pointerStart.current = e.clientX;
    };
    const onPointerUp = (e: React.PointerEvent) => {
        if (pointerStart.current === null) return;
        const dx = e.clientX - pointerStart.current;
        pointerStart.current = null;
        if (Math.abs(dx) > 40 && count > 1) {
            if (dx < 0) next();
            else prev();
        } else if (Math.abs(dx) < 6) {
            setLightbox(true);
        }
    };

    if (count === 0) return null;

    return (
        <div className="flex flex-col gap-4">
            {/* Stage */}
            <div
                className={`pf-stage group/stage relative ${stageClassName} w-full overflow-hidden rounded-2xl bg-background cursor-zoom-in select-none touch-pan-y focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]/40`}
                role="region"
                aria-roledescription="carousel"
                aria-label={`${title} images`}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "ArrowLeft") prev();
                    if (e.key === "ArrowRight") next();
                    if (e.key === "Enter") setLightbox(true);
                }}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
            >
                {images.map((src, k) =>
                    shouldRender(k) ? (
                        <div
                            key={src + k}
                            aria-hidden={k !== index}
                            className={`absolute inset-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                                k === index ? "opacity-100 scale-100" : "opacity-0 scale-[1.02] pointer-events-none"
                            }`}
                        >
                            {/* Whole image */}
                            <Image
                                src={src}
                                alt={`${title} — image ${k + 1} of ${count}`}
                                fill
                                sizes="(max-width: 1024px) 100vw, 55vw"
                                className="object-contain p-3 md:p-5 "
                                draggable={false}
                            />
                        </div>
                    ) : null
                )}

                <span className="pointer-events-none absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#141414] opacity-0 backdrop-blur transition-opacity duration-300 group-hover/stage:opacity-100">
                    <FiMaximize2 size={15} />
                </span>
            </div>

            {/* Controls */}
            {count > 1 && (
                <div className="flex items-center gap-4">
                    <div
                        ref={thumbsRef}
                        className="relative flex flex-1 gap-2 overflow-x-auto scrollbar-hide p-1"
                    >
                        {images.map((src, k) => (
                            <button
                                key={src + k}
                                type="button"
                                onClick={() => go(k)}
                                aria-label={`Show image ${k + 1}`}
                                aria-current={k === index}
                                className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-background transition-all duration-300 ${
                                    k === index
                                        ? "opacity-100 ring-2 ring-[#141414] ring-offset-2 ring-offset-background"
                                        : "opacity-50 hover:opacity-90"
                                }`}
                            >
                                <Image src={src} alt="" fill sizes="64px" className="object-contain p-0.5" />
                            </button>
                        ))}
                    </div>

                    <span className="font-mono text-sm text-tertiary tabular-nums shrink-0">
                        {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                    </span>

                    <div className="flex gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={prev}
                            aria-label="Previous image"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-secondary transition-colors hover:border-[#141414] hover:bg-[#141414] hover:text-white"
                        >
                            <FiChevronLeft size={18} />
                        </button>
                        <button
                            type="button"
                            onClick={next}
                            aria-label="Next image"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-secondary transition-colors hover:border-[#141414] hover:bg-[#141414] hover:text-white"
                        >
                            <FiChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* Lightbox */}
            {lightbox && createPortal(
                <div
                    className="pf-fade fixed inset-0 z-[200] flex items-center justify-center bg-[#141414]/95 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${title} image viewer`}
                    onClick={() => setLightbox(false)}
                    data-lenis-prevent
                >
                    <div key={index} className="pf-fade relative h-[82vh] w-[92vw]">
                        <Image
                            src={images[index]}
                            alt={`${title} — image ${index + 1} of ${count}`}
                            fill
                            sizes="92vw"
                            className="object-contain"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => setLightbox(false)}
                        aria-label="Close"
                        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                    >
                        <FiX size={20} />
                    </button>

                    {count > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prev();
                                }}
                                aria-label="Previous image"
                                className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                            >
                                <FiChevronLeft size={22} />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    next();
                                }}
                                aria-label="Next image"
                                className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                            >
                                <FiChevronRight size={22} />
                            </button>
                            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-sm text-gray-400 tabular-nums">
                                {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                            </span>
                        </>
                    )}
                </div>,
                document.body
            )}
        </div>
    );
}
