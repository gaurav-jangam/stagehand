
import React from 'react';
import { connectToDatabase } from '@/lib/mongodb';
import type { Show } from '@/lib/types';
import { ShowsPageClient } from '@/components/shows-page-client';

async function getShows(): Promise<Show[]> {
    const { db } = await connectToDatabase();
    const shows = await db.collection('shows').find({}).sort({ date: -1 }).toArray();
    return JSON.parse(JSON.stringify(shows));
}

export default async function ShowsPage() {
    const shows = await getShows();

    return <ShowsPageClient allShows={shows} />;
}
