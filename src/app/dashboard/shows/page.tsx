'use client';

import React, { useEffect, useState } from 'react';
import type { Show } from '@/lib/types';
import { ShowsPageClient } from '@/components/shows-page-client';
import { FloatingInstruments } from '@/components/floating-instruments';
import { getShows as fetchShows } from '@/app/actions';

export default function ShowsPage() {
    const [shows, setShows] = useState<Show[]>([]);

    useEffect(() => {
        async function loadShows() {
            const showsData = await fetchShows();
            setShows(showsData);
        }
        loadShows();
    }, []);

    return (
        <>
            <FloatingInstruments />
            <div className="relative z-10">
                <ShowsPageClient allShows={shows} />
            </div>
        </>
    );
}
