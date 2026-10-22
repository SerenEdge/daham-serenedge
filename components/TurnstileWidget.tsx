"use client";

import { useEffect, useRef } from "react";

declare global {
    interface Window {
        turnstile?: {
            render: (el: HTMLElement, options: Record<string, unknown>) => string;
            reset: (widgetId?: string) => void;
            remove: (widgetId?: string) => void;
        };
    }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const SCRIPT_ID = "cf-turnstile-script";

type Props = {
    siteKey: string;
    onToken: (token: string | null) => void;
    /** Increment to force the widget to reset (e.g. after a submit attempt). */
    resetKey?: number;
};

export default function TurnstileWidget({ siteKey, onToken, resetKey = 0 }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | undefined>(undefined);
    const onTokenRef = useRef(onToken);
    onTokenRef.current = onToken;

    useEffect(() => {
        let cancelled = false;

        const renderWidget = () => {
            if (cancelled || !containerRef.current || !window.turnstile || widgetIdRef.current) return;
            widgetIdRef.current = window.turnstile.render(containerRef.current, {
                sitekey: siteKey,
                theme: "dark",
                callback: (token: string) => onTokenRef.current(token),
                "expired-callback": () => onTokenRef.current(null),
                "error-callback": () => onTokenRef.current(null),
            });
        };

        if (window.turnstile) {
            renderWidget();
        } else {
            let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
            if (!script) {
                script = document.createElement("script");
                script.id = SCRIPT_ID;
                script.src = SCRIPT_SRC;
                script.async = true;
                script.defer = true;
                document.head.appendChild(script);
            }
            script.addEventListener("load", renderWidget);
        }

        return () => {
            cancelled = true;
            if (widgetIdRef.current && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current);
            }
            widgetIdRef.current = undefined;
        };
    }, [siteKey]);

    useEffect(() => {
        if (resetKey > 0 && widgetIdRef.current && window.turnstile) {
            window.turnstile.reset(widgetIdRef.current);
            onTokenRef.current(null);
        }
    }, [resetKey]);

    return <div ref={containerRef} className="min-h-[65px]" />;
}
