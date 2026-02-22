// components/DevPulseCard.tsx
import React from 'react';
import Link from 'next/link';
import { FiGithub, FiUsers, FiActivity, FiZap } from 'react-icons/fi';

interface DevPulseData {
    developer: string;
    profileName: string;
    bio: string;
    metrics: {
        publicRepos: number;
        followers: number;
        devPulseScore: number;
    };
    status: string;
}

async function fetchPulseData(username: string): Promise<DevPulseData | null> {
    const apiKey = process.env.DEV_PULSE_API_KEY;
    const apiUrl = process.env.DEV_PULSE_API_URL;

    // Safety check logging for Vercel troubleshooting
    if (process.env.VERCEL) {
        console.log(`[DevPulse Diagnostic] API URL present: ${!!apiUrl}`);
        console.log(`[DevPulse Diagnostic] API Key present: ${!!apiKey} (${apiKey?.substring(0, 4)}***)`);
    }

    const mockData: DevPulseData = {
        developer: username,
        profileName: "-",
        bio: "-",
        metrics: {
            publicRepos: 0,
            followers: 0,
            devPulseScore: 0
        },
        status: "Mock Data"
    };

    if (!apiKey || !apiUrl) {
        console.warn("Dev-Pulse: Missing API Key or URL in environment variables. Falling back to mock data.");
        return mockData;
    }

    try {
        const res = await fetch(`${apiUrl}/pulse/${username}`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'application/json'
            },
            // Temporarily disabling cache with no-store/0 to ensure Vercel fetches fresh data
            next: { revalidate: 0 }
        });

        if (!res.ok) {
            console.warn(`Dev-Pulse: API returned ${res.status} ${res.statusText}. Using fallback mock data.`);
            return mockData;
        }

        return await res.json();
    } catch (error) {
        console.warn("Dev-Pulse: Fetch failed. Using fallback mock data.", error);
        return mockData;
    }
}




// 3. Render the Component (Your excellent UI code remains unchanged!)
export default async function DevPulseCard({ username = "DahamDissanayake" }: { username?: string }) {
    const data = await fetchPulseData(username);


    if (!data) {
        return (
            <div className="p-6 border border-red-500/20 bg-red-500/5 rounded-3xl text-red-400 font-medium font-sans">
                Unable to load developer pulse.
            </div>
        );
    }

    return (
        <div className="group relative w-full lg:h-[480px]">
            {/* Main Card Container */}
            <div className="relative w-full h-full bg-[#1c1c2b] border border-gray-800 rounded-3xl p-6 lg:p-8 overflow-hidden flex flex-col group/card">


                {/* Internal Grid Background */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(#e6e6f0 1px, transparent 1px), linear-gradient(90deg, #e6e6f0 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8 lg:mb-10">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <FiGithub className="text-indigo-400 text-sm" />
                                <span className="text-[10px] font-mono text-tertiary uppercase tracking-[0.2em]">Dev.Pulse_v2.1</span>
                            </div>
                            <h3 className="text-2xl lg:text-3xl font-medium text-[#e6e6f0] tracking-tight">{data.profileName}</h3>
                            <Link
                                href={`https://github.com/${data.developer}`}
                                target="_blank"
                                className="text-xs text-tertiary font-mono hover:text-[#e6e6f0] transition-colors"
                            >
                                path: github.com/{data.developer}
                            </Link>
                        </div>
                        <div className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest border rounded-full ${data.status === "Mock Data"
                            ? "text-yellow-500/70 border-yellow-500/20 bg-yellow-500/5"
                            : "text-green-400/70 border-green-400/20 bg-green-400/5"
                            }`}>
                            {data.status}
                        </div>
                    </div>

                    {/* Bio / Description */}
                    <div className="flex-1">
                        <p className="text-[#7b7b7b] text-sm lg:text-base leading-relaxed font-light line-clamp-3">
                            {data.bio}
                        </p>
                    </div>

                    {/* Pulse Score - The Hero Statistic */}
                    <div className="mt-auto pt-6 lg:pt-8 border-t border-gray-800/50 flex items-end justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-tertiary uppercase tracking-[0.2em] mb-2">Pulse Score</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl lg:text-7xl font-light text-[#e6e6f0] tracking-tighter leading-none">{data.metrics.devPulseScore}</span>
                            </div>
                        </div>

                        {/* Status Icon */}
                        <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center transition-colors">
                            <FiActivity className="text-indigo-400 text-xl lg:text-2xl animate-pulse" />
                        </div>
                    </div>


                    {/* Secondary Metrics */}
                    <div className="grid grid-cols-2 gap-4 mt-6 lg:mt-8 pt-6 border-t border-gray-800/30">
                        <div className="flex items-center gap-3 lg:gap-4">
                            <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                                <FiZap className="text-tertiary text-xs lg:text-sm" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-mono text-tertiary uppercase tracking-wider">Repos</span>
                                <span className="text-base lg:text-lg font-medium text-[#e6e6f0]">{data.metrics.publicRepos}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 lg:gap-4">
                            <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                                <FiUsers className="text-tertiary text-xs lg:text-sm" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-mono text-tertiary uppercase tracking-wider">Followers</span>
                                <span className="text-base lg:text-lg font-medium text-[#e6e6f0]">{data.metrics.followers}</span>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Corner Decorative Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 blur-[60px] pointer-events-none" />
            </div>
        </div>
    );
}
