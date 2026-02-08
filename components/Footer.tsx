"use client";

import { useRef, useLayoutEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiGithub, FiLinkedin, FiMail, FiSend } from "react-icons/fi";
import { sendContactEmail } from "@/app/actions";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [statusMessage, setStatusMessage] = useState("");

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 75%", // Start earlier when scrolling down
                    toggleActions: "play none none reverse",
                }
            });

            tl.fromTo(lineRef.current,
                { scaleX: 0, opacity: 0 },
                { scaleX: 1, opacity: 1, duration: 1.2, ease: "expo.out" }
            )
                .fromTo(contentRef.current,
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
                    "-=0.8"
                );

        }, footerRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormStatus("submitting");
        setStatusMessage("");

        const formData = new FormData(e.currentTarget);
        try {
            // Call Server Action
            const result = await sendContactEmail(null, formData); // prevState is null for direct call

            if (result?.error) {
                setFormStatus("error");
                setStatusMessage(result.error);
            } else {
                setFormStatus("success");
                setStatusMessage("Message sent successfully!");
                formRef.current?.reset();
            }
        } catch (error) {
            setFormStatus("error");
            setStatusMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <footer id="contact" ref={footerRef} className="bg-[#1c1c2b] text-gray-400 min-h-dvh relative z-30 overflow-hidden font-sans flex flex-col justify-center">
            {/* Decorative Separator */}
            <div className="absolute top-0 left-0 w-full flex justify-center pt-8 md:pt-16">
                <div ref={lineRef} className="w-[90%] h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent origin-center" />
            </div>

            <div ref={contentRef} className="container mx-auto px-4 md:px-12 opacity-0 py-8 md:py-0">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-24 items-center h-full">

                    {/* Left Column: Context & Identity */}
                    <div className="flex flex-col gap-8 md:gap-12 order-2 md:order-1">
                        {/* Heading */}
                        <div className="flex flex-col gap-3 md:gap-4">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-[#e6e6f0] tracking-tight leading-tight">
                                Let's build something extraordinary.
                            </h2>
                            <p className="text-base sm:text-lg text-gray-400 max-w-md leading-relaxed">
                                Whether you have a project in mind or just want to say hi, I'm always open to discussing new ideas and opportunities.
                            </p>
                        </div>

                        {/* Contact Details & Socials */}
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-white font-medium">Connect</h3>
                                <div className="flex gap-4">
                                    {[
                                        { icon: <FiGithub size={20} />, href: "https://github.com/DahamDissanayake", label: "GitHub" },
                                        { icon: <FiLinkedin size={20} />, href: "https://linkedin.com", label: "LinkedIn" },
                                        { icon: <FiMail size={20} />, href: "mailto:support@sotercare.com", label: "Email" }
                                    ].map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 bg-[#242436] rounded-full border border-gray-800/50 text-gray-400 transition-all hover:bg-[#2f2f45] hover:text-white"
                                            aria-label={social.label}
                                        >
                                            {social.icon}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                                <span>Based in Sri Lanka</span>
                                <span className="hidden md:inline">|</span>
                                <p className="text-xs sm:text-sm md:text-base">&copy; {new Date().getFullYear()} Daham Dissanayake</p>
                            </div>
                        </div>
                    </div>


                    {/* Right Column: Contact Form */}
                    <div className="bg-[#161622] p-5 sm:p-6 md:p-10 rounded-3xl border border-gray-800/50 shadow-2xl relative overflow-hidden order-1 md:order-2">
                        {/* Status Overlay */}
                        {formStatus === "success" && (
                            <div className="absolute inset-0 bg-[#161622]/95 z-20 flex flex-col items-center justify-center text-center p-8 animate-in fade-in">
                                <span className="p-4 bg-green-500/20 text-green-400 rounded-full mb-4 text-3xl">✓</span>
                                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                <p className="text-gray-400">Thank you for reaching out. I'll get back to you shortly.</p>
                                <button
                                    onClick={() => setFormStatus("idle")}
                                    className="mt-6 text-sm text-gray-500 hover:text-white underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        )}

                        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
                            <h3 className="text-2xl font-bold text-white mb-2">Send a Message</h3>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="name" className="text-sm font-medium text-gray-400">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    placeholder="Your Name"
                                    className="bg-[#1c1c2b] border border-gray-700 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-gray-500 transition-colors placeholder:text-gray-600"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-400">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    placeholder="your@email.com"
                                    className="bg-[#1c1c2b] border border-gray-700 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-gray-500 transition-colors placeholder:text-gray-600"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="message" className="text-sm font-medium text-gray-400">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={4}
                                    placeholder="Tell me about your project..."
                                    className="bg-[#1c1c2b] border border-gray-700 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-gray-500 transition-colors placeholder:text-gray-600 resize-none"
                                ></textarea>
                            </div>

                            {formStatus === "error" && (
                                <p className="text-red-400 text-sm">{statusMessage}</p>
                            )}

                            <button
                                type="submit"
                                disabled={formStatus === "submitting"}
                                className="mt-2 bg-white text-black font-bold py-3 px-6 rounded-full hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {formStatus === "submitting" ? "Sending..." : "Send Message"}
                                {!formStatus.startsWith("submit") && <FiSend className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </footer>
    );
}
