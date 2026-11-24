"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface SliderNavProps {
    /** 1-based position shown in the counter. */
    current: number;
    total: number;
    /** 0..1 fill of the progress line. */
    progress: number;
    onPrev: () => void;
    onNext: () => void;
    tone?: "light" | "dark";
    label: string;
    className?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Shared control row used under both the Selected Works panels and the
 * Other Projects rail: counter + progress line on the left, arrows on the right.
 */
export default function SliderNav({
    current,
    total,
    progress,
    onPrev,
    onNext,
    tone = "light",
    label,
    className = "",
}: SliderNavProps) {
    const dark = tone === "dark";
    const button = `flex h-12 w-12 items-center justify-center rounded-full border transition-colors duration-300 ${
        dark
            ? "border-gray-700 text-gray-300 hover:border-white hover:bg-white hover:text-[#141414]"
            : "border-gray-300 text-secondary hover:border-[#141414] hover:bg-[#141414] hover:text-white"
    }`;

    return (
        <div className={`flex items-center gap-6 ${className}`}>
            <span className={`shrink-0 font-mono text-sm tabular-nums ${dark ? "text-gray-500" : "text-tertiary"}`}>
                <span className={dark ? "text-white" : "text-secondary"}>{pad(current)}</span> / {pad(total)}
            </span>

            <div className={`relative h-px flex-1 ${dark ? "bg-gray-800" : "bg-gray-200"}`}>
                <div
                    className={`absolute inset-y-0 left-0 transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        dark ? "bg-white" : "bg-[#141414]"
                    }`}
                    style={{ width: `${Math.min(1, Math.max(0, progress)) * 100}%` }}
                />
            </div>

            <div className="flex shrink-0 gap-2">
                <button type="button" onClick={onPrev} aria-label={`Previous ${label}`} className={button}>
                    <FiChevronLeft size={20} />
                </button>
                <button type="button" onClick={onNext} aria-label={`Next ${label}`} className={button}>
                    <FiChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
