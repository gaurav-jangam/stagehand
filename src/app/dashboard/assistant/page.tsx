'use client';

import { AssistantPage } from '@/components/assistant-page';
import { FloatingInstruments } from '@/components/floating-instruments';
import React from 'react';

export default function AssistantPageServer() {
    return (
        <>
            <FloatingInstruments />
            <div className="relative z-10">
                <AssistantPage />
            </div>
        </>
    );
}
