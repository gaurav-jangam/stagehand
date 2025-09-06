
import { notFound } from 'next/navigation';
import { Calendar, MapPin } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Mic } from 'lucide-react';
import { ClientDate } from '@/components/ui/client-date';
import type { Show, Song } from '@/lib/types';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { FloatingInstruments } from '@/components/floating-instruments';

async function getShow(id: string): Promise<Show | null> {
    const { db } = await connectToDatabase();
    if (!ObjectId.isValid(id)) {
        return null;
    }
    const show = await db.collection('shows').findOne({ _id: new ObjectId(id) });
    if (!show) return null;
    return JSON.parse(JSON.stringify(show));
}

async function getSongs(songIds: string[]): Promise<Song[]> {
    const { db } = await connectToDatabase();
    const songs = await db.collection('songs').find({ id: { $in: songIds } }).toArray();
    return JSON.parse(JSON.stringify(songs));
}

export default async function ShowDetailPage({ params }: { params: { id: string } }) {
  const show = await getShow(params.id);

  if (!show) {
    notFound();
  }

  const songIds = show.songs.map(s => s.songId);
  const songs = await getSongs(songIds);
  const songMap = new Map(songs.map(s => [s.id, s]));

  const showSongs = show.songs
    .map(showSong => {
      const songDetails = songMap.get(showSong.songId);
      return { ...showSong, ...songDetails };
    })
    .sort((a, b) => a.order - b.order);

  return (
    <>
        <FloatingInstruments />
        <div className="relative z-10 flex flex-col gap-6 p-4 md:p-6 lg:p-8">
            <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/shows">
                <ArrowLeft className="h-4 w-4" />
                </Link>
            </Button>
            <div className="space-y-1.5">
                <h1 className="font-headline text-3xl font-bold tracking-tight">{show.name}</h1>
            </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <ClientDate date={show.date} options={{ dateStyle: 'full', timeStyle: 'short' }} />
            </div>
            {show.venue && (
                <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{show.venue}</span>
                </div>
            )}
            </div>

            <div className="rounded-lg border backdrop-blur-[2px]">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Song</TableHead>
                    <TableHead>Performer(s)</TableHead>
                    <TableHead>Adjusted Scale</TableHead>
                    <TableHead>Original Singer</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {showSongs.map(song => (
                    <TableRow key={song.id} className="bg-transparent hover:bg-muted/50">
                    <TableCell className="font-bold text-muted-foreground">{song.order}</TableCell>
                    <TableCell className="font-medium">{song.name}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{song.performer}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="default">{song.adjustedScale}</Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mic className="h-4 w-4" />
                        <span>{song.singer}</span>
                        </div>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </div>
        </div>
    </>
  );
}
