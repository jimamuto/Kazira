"use client";

import { useEffect, useState, useMemo } from "react";

export default function AnimatedBackground() {
    const [mounted, setMounted] = useState(false);

    // Generate random values once to avoid React purity violations
    const [shootingStarStyles] = useState(() =>
        [...Array(8)].map(() => ({
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * -20}%`,
            width: `${Math.random() * 200 + 100}px`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 3 + 2}s`,
        }))
    );

    const [rainDropStyles] = useState(() =>
        [...Array(15)].map(() => ({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            height: `${Math.random() * 100 + 50}px`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 10 + 5}s`,
        }))
    );

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* 1. Deep Space Base */}
            <div className="absolute inset-0 bg-black"></div>

            {/* 2. Nebula Orbs (Atmosphere) */}
            <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-accent/10 rounded-full blur-[120px] animate-nebula-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[100px] animate-nebula-pulse" style={{ animationDelay: '5s' }}></div>

            {/* 3. Perspective Cyber Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 transform perspective-[1000px] rotate-x-12 scale-110"></div>

            {/* 4. Shooting Data Streams (Flashy Elements) */}
            <div className="absolute inset-0">
                {shootingStarStyles.map((style, i) => (
                    <div
                        key={i}
                        className="absolute h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent animate-shooting-star"
                        style={{
                            ...style,
                            opacity: 0,
                        }}
                    ></div>
                ))}
                {/* Vertical Rain/Data Drops */}
                {rainDropStyles.map((style, i) => (
                    <div
                        key={`rain-${i}`}
                        className="absolute w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent animate-float-slow"
                        style={style}
                    ></div>
                ))}
            </div>
        </div>
    );
}
