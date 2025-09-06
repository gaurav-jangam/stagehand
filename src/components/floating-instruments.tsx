
"use client";

import { useState, useEffect } from 'react';
import { 
    Music, Mic, Guitar, Drum, AudioLines, Waves, Headphones, Speaker,
    Radio, RadioTower, Disc, Music2, Music3, Music4, Piano
} from "lucide-react";

const icons = [
    { component: Music, baseSize: 10 },
    { component: Mic, baseSize: 10 },
    { component: Guitar, baseSize: 12 },
    { component: Drum, baseSize: 10 },
    { component: AudioLines, baseSize: 12 },
    { component: Waves, baseSize: 10 },
    { component: Headphones, baseSize: 11 },
    { component: Speaker, baseSize: 10 },
    { component: Radio, baseSize: 11 },
    { component: RadioTower, baseSize: 12 },
    { component: Disc, baseSize: 10 },
    { component: Music2, baseSize: 10 },
    { component: Music3, baseSize: 10 },
    { component: Music4, baseSize: 10 },
    { component: Piano, baseSize: 10 },
];

const animations = ['animate-float-1', 'animate-float-2', 'animate-float-3'];

interface Instrument {
    id: number;
    icon: React.ReactNode;
    size: string;
    top: string;
    left: string;
    animation: string;
    animationDelay: string;
    animationDuration: string;
}

// Function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};


const generateRandomInstrument = (id: number, iconData: { component: React.ComponentType<any>, baseSize: number }): Instrument => {
    const IconComponent = iconData.component;
    const size = iconData.baseSize + Math.floor(Math.random() * 8);
    const top = `${Math.random() * 90}%`;
    const left = `${Math.random() * 90}%`;
    const animation = animations[Math.floor(Math.random() * animations.length)];
    
    return {
        id,
        icon: <IconComponent className="text-primary/40 neon-glow" />,
        size: `w-${size} h-${size}`,
        top,
        left,
        animation,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${Math.random() * 10 + 10}s`,
    };
};

export function FloatingInstruments() {
    const [instruments, setInstruments] = useState<Instrument[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const shuffledIcons = shuffleArray(icons);
        const newInstruments = shuffledIcons.slice(0, 20).map((iconData, i) => generateRandomInstrument(i, iconData));
        setInstruments(newInstruments);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {instruments.map(item => (
                <div 
                    key={item.id} 
                    className={`absolute ${item.size} ${item.animation}`}
                    style={{ 
                        top: item.top, 
                        left: item.left,
                        animationDelay: item.animationDelay,
                        animationDuration: item.animationDuration,
                    }}
                >
                    <div className="transition-transform duration-500 hover:scale-125 hover:rotate-12">{item.icon}</div>
                </div>
            ))}
        </div>
    );
}
