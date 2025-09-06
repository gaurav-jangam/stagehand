'use client';

import React from 'react';
import type { Song, Show } from '@/lib/types';
import { SongList } from '@/components/song-list';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { AssistantPage } from '@/components/assistant-page';
import { PublicShowsList } from '@/components/public-shows-list';
import { FloatingInstruments } from '@/components/floating-instruments';
import { getSongs as fetchSongs, getShows as fetchShows } from '@/app/actions';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [shows, setShows] = useState<Show[]>([]);

  useEffect(() => {
    async function loadData() {
      const songsData = await fetchSongs();
      const showsData = await fetchShows();
      setSongs(songsData);
      setShows(showsData);
    }
    loadData();
  }, []);

  return (
    <>
      <FloatingInstruments />
      <div className="relative z-10 flex flex-col gap-12 p-4 md:p-6 lg:p-8">
        <header className="relative flex flex-col items-center justify-center gap-4 rounded-lg p-8 text-center shadow-md md:p-12">
          <div className="z-10">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary/90 [text-shadow:0_0_2px_hsl(var(--primary)/50%),0_0_5px_hsl(var(--primary)/40%),0_0_10px_hsl(var(--primary)/20%)]">Welcome to Stagehand</h1>
            <p className="mt-2 max-w-2xl text-lg text-muted-foreground">Your ultimate companion for managing songs and planning shows. View our public library and upcoming events below.</p>
          </div>
          <div className="absolute inset-0"></div>
          <Button asChild className="mt-4 z-10">
            <Link href="/login">
              <LogIn className="mr-2" />
              Login to Manage
            </Link>
          </Button>
        </header>

        <div className="space-y-8">
          <div>
            <div className='space-y-1.5'>
              <h2 className="font-headline text-3xl font-bold tracking-tight">Song Library</h2>
              <p className="text-muted-foreground">A glimpse into our master catalog.</p>
            </div>
            <div className="mt-4 space-y-4">
              <SongList initialSongs={songs} isReadOnly={true} rowsPerPage={5} />
            </div>
          </div>

          <div>
            <div className='space-y-1.5'>
                <h2 className="font-headline text-3xl font-bold tracking-tight">Upcoming Shows</h2>
                <p className="text-muted-foreground">Check out where the music is happening next.</p>
            </div>
            <div className="mt-4">
                <PublicShowsList allShows={shows} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-center">
                <h2 className="font-headline text-3xl font-bold tracking-tight">AI Assistant</h2>
                <p className="text-muted-foreground">Ask our AI anything about music and cinema!</p>
            </div>
            <div className="w-full">
                <AssistantPage />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
