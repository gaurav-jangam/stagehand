
import React from 'react';
import type { Song } from '@/lib/types';
import { SongList } from '@/components/song-list';
import { FloatingInstruments } from '@/components/floating-instruments';
import { connectToDatabase } from '@/lib/mongodb';

async function getSongs(): Promise<Song[]> {
    const { db } = await connectToDatabase();
    const songs = await db.collection('songs').find({}).sort({ name: 1 }).toArray();
    return JSON.parse(JSON.stringify(songs));
}


export default async function SongsPage() {
  const songs = await getSongs();
  
  return (
    <div className="relative min-h-full">
      <FloatingInstruments />
      <div className="relative z-10 flex flex-col gap-6">
        <div className="space-y-1.5">
          <h1 className="font-headline text-3xl font-bold tracking-tight">Song Library</h1>
          <p className="text-muted-foreground">Your master catalog of every song.</p>
        </div>
        <SongList initialSongs={songs} />
      </div>
    </div>
  );
}
