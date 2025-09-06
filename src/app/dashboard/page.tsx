'use client';

import React, { useEffect, useState } from 'react';
import type { Song } from '@/lib/types';
import { SongList } from '@/components/song-list';
import { FloatingInstruments } from '@/components/floating-instruments';
import { getSongs as fetchSongs } from '@/app/actions';


export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    async function loadSongs() {
      const songsData = await fetchSongs();
      setSongs(songsData);
    }
    loadSongs();
  }, []);
  
  return (
    <>
      <FloatingInstruments />
      <div className="relative z-10 flex flex-col gap-6">
        <div className="space-y-1.5">
          <h1 className="font-headline text-3xl font-bold tracking-tight">Song Library</h1>
          <p className="text-muted-foreground">Your master catalog of every song.</p>
        </div>
        <SongList initialSongs={songs} />
      </div>
    </>
  );
}
