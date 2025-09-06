

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Music } from 'lucide-react';
import Link from 'next/link';
import { ClientDateString } from '@/components/ui/client-date';
import type { Show } from '@/lib/types';
import { connectToDatabase } from '@/lib/mongodb';

async function getShows(): Promise<Show[]> {
    const { db } = await connectToDatabase();
    const shows = await db.collection('shows').find({}).sort({ date: -1 }).toArray();
    return JSON.parse(JSON.stringify(shows));
}

export default async function ShowsPage() {
  const allShows = await getShows();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <h1 className="font-headline text-3xl font-bold tracking-tight">Shows</h1>
          <p className="text-muted-foreground">Manage your performances and show lists.</p>
        </div>
        
      </div>

      {allShows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center backdrop-blur-[2px]">
            <h3 className="text-xl font-bold tracking-tight text-foreground">No shows yet</h3>
            <p className="text-sm text-muted-foreground mt-2">Check back later for upcoming shows.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allShows.map(show => (
            <Link href={`/shows/${show.id}`} key={show.id}>
              <Card className="h-full transform transition-all hover:-translate-y-1 hover:shadow-lg bg-transparent backdrop-blur-[2px]">
                <CardHeader>
                  <CardTitle className="font-headline tracking-wide">{show.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 pt-1">
                    <Calendar className="h-4 w-4" />
                    <ClientDateString date={show.date} options={{ year: 'numeric', month: 'long', day: 'numeric' }} />
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {show.venue && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{show.venue}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Music className="h-4 w-4" />
                    <span>{show.songs.length} songs</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
