

import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb';
import type { Show, Song, ShowSong } from '@/lib/types';
import { ShowDetailPageClient } from '@/components/show-detail-page-client';
import { ObjectId } from 'mongodb';

type ShowSongWithDetails = ShowSong & Partial<Omit<Song, '_id' | 'id'>>;

async function getShow(id: string): Promise<Show | null> {
    if (!ObjectId.isValid(id)) {
        return null;
    }
    const { db } = await connectToDatabase();
    const show = await db.collection('shows').findOne({ _id: new ObjectId(id) });
    if (!show) return null;

    // Manually convert all ObjectIds to strings to make the object serializable
    const plainShow = {
        ...show,
        _id: show._id.toString(),
        id: show.id.toString(),
        songs: (show.songs || []).map((s: any) => ({
            ...s,
            _id: s._id.toString(),
        })),
    };
    return plainShow as Show;
}

async function getSongs(songIds: string[]): Promise<Song[]> {
    if (songIds.length === 0) return [];
    const { db } = await connectToDatabase();
    const query = { id: { $in: songIds } };
    const songs = await db.collection('songs').find(query).sort({ name: 1 }).toArray();
    
    return JSON.parse(JSON.stringify(songs));
}


export default async function ShowDetailPage({ params }: { params: { id: string } }) {
  const show = await getShow(params.id);

  if (!show) {
    notFound();
  }
  
  const showSongIds = show.songs.map(s => s.songId);
  const songsForThisShow = await getSongs(showSongIds);

  const songMap = new Map(songsForThisShow.map(s => [s.id, s]));

  const showSongsWithDetails: ShowSongWithDetails[] = show.songs.map(showSong => {
    const songDetails = songMap.get(showSong.songId);
    // Omit the _id and id from songDetails to prevent collision
    const { _id, id, ...restOfSongDetails } = songDetails || {};
    
    return {
      ...showSong, // Contains the _id from the show.songs array
      ...restOfSongDetails,
    };
  }).sort((a, b) => a.order - b.order);


  return <ShowDetailPageClient show={show} initialShowSongs={showSongsWithDetails} />;
}
