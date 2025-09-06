
"use client";

import { useState, useEffect } from 'react';
import { Music, Mic, Guitar, Piano, Drum, AudioLines } from "lucide-react";

const icons = [
    { component: Music, baseSize: 10 },
    { component: Mic, baseSize: 10 },
    { component: Guitar, baseSize: 12 },
    { component: Piano, baseSize: 8 },
    { component: Drum, baseSize: 10 },
    { component: AudioLines, baseSize: 12 },
];

const animations = ['animate-float-1', 'animate-float-2', 'animate-float-3'];

interface Instrument {
    id: number;
    icon: React.ReactNode;
    size: string;
    top: string;
    left: string;
    animation: string;
}

const generateRandomInstrument = (id: number): Instrument => {
    const IconComponent = icons[Math.floor(Math.random() * icons.length)];
    const size = IconComponent.baseSize + Math.floor(Math.random() * 10);
    const top = `${Math.random() * 95}%`;
    const left = `${Math.random() * 95}%`;
    const animation = animations[Math.floor(Math.random() * animations.length)];
    
    return {
        id,
        icon: <IconComponent.component className="text-white neon-glow" />,
        size: `w-${size} h-${size}`,
        top,
        left,
        animation,
    };
};

export function FloatingInstruments() {
    const [instruments, setInstruments] = useState<Instrument[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // This code now runs only on the client
        setIsMounted(true);
        const newInstruments = Array.from({ length: 9 }, (_, i) => generateRandomInstrument(i));
        setInstruments(newInstruments);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            {instruments.map(item => (
                <div key={item.id} className={`absolute ${item.size} ${item.animation} opacity-50`} style={{ top: item.top, left: item.left, zIndex: 0 }}>
                    <div className="transition-transform duration-500 hover:scale-125 hover:rotate-12">{item.icon}</div>
                </div>
            ))}
        </>
    );
}
