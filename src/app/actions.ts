
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { songCategories } from "@/lib/data";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import type { Song, Show } from "@/lib/types";

const songSchema = z.object({
  name: z.string().min(1, "Song name is required."),
  singer: z.string().min(1, "Singer is required."),
  lyricist: z.string().min(1, "Lyricist is required."),
  movie: z.string().optional(),
  category: z.enum(songCategories),
  originalScale: z.string().min(1, "Original scale is required."),
  myScale: z.string().min(1, "Your scale is required."),
  youtubeLink: z.string().url().optional().or(z.literal('')),
});

export async function addSong(formData: FormData) {
  const values = Object.fromEntries(formData.entries());
  const parsed = songSchema.safeParse(values);

  if (!parsed.success) {
    return {
      error: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const { db } = await connectToDatabase();
    const newSongId = new ObjectId();
    
    const songData = {
        ...parsed.data,
        _id: newSongId,
        id: newSongId.toHexString()
    };
    
    await db.collection('songs').insertOne(songData);

    revalidatePath("/");
    revalidatePath("/dashboard");

    return {
      data: "Song added successfully.",
    };
  } catch (e) {
    console.error(e);
    return {
      error: "Failed to add song to the database.",
    };
  }
}

export async function editSong(songId: string, formData: FormData) {
    if (!songId) {
        return { error: "Song ID is required." };
    }
    if (!ObjectId.isValid(songId)) {
        return { error: "Invalid Song ID format." };
    }

    const values = Object.fromEntries(formData.entries());
    const parsed = songSchema.safeParse(values);

    if (!parsed.success) {
        return {
            error: parsed.error.flatten().fieldErrors,
        };
    }

    try {
        const { db } = await connectToDatabase();
        await db.collection('songs').updateOne(
            { _id: new ObjectId(songId) },
            { $set: parsed.data }
        );

        revalidatePath("/");
        revalidatePath("/dashboard");
        revalidatePath(`/dashboard/shows`); 
        revalidatePath(`/dashboard/shows/${songId}`); 

        return {
            data: "Song updated successfully.",
        };
    } catch (e) {
        console.error(e);
        return {
            error: "Failed to update song in the database.",
        };
    }
}


export async function deleteSong(songId: string) {
    if (!songId) {
        return { error: "Song ID is required." };
    }

    try {
        const { db } = await connectToDatabase();
        if (!ObjectId.isValid(songId)) {
            return { error: "Invalid song ID format." };
        }
        await db.collection('songs').deleteOne({ _id: new ObjectId(songId) });
        
        revalidatePath("/");
        revalidatePath("/dashboard");

        return { data: "Song deleted successfully." };
    } catch (e) {
        console.error(e);
        return { error: "Failed to delete song." };
    }
}


const showSchema = z.object({
  name: z.string().min(1, "Show name is required."),
  date: z.string().min(1, "Show date is required."),
  venue: z.string().optional(),
});

export async function addShow(formData: FormData) {
    const values = Object.fromEntries(formData.entries());
    const parsed = showSchema.safeParse(values);

    if(!parsed.success) {
        return {
            error: parsed.error.flatten().fieldErrors,
        }
    }

    try {
        const { db } = await connectToDatabase();
        const newShowId = new ObjectId();
        const showData = {
            ...parsed.data,
            _id: newShowId,
            id: newShowId.toHexString(),
            songs: [], // Initialize with an empty song list
        };
        await db.collection('shows').insertOne(showData);
        
        revalidatePath('/shows');
        revalidatePath('/dashboard/shows');

        return {
            data: "Show added successfully"
        };

    } catch (e) {
        console.error(e);
        return {
            error: "Failed to add show to the database."
        };
    }
}

export async function deleteShow(showId: string) {
    if (!showId) {
        return { error: "Show ID is required." };
    }

    try {
        const { db } = await connectToDatabase();
        if (!ObjectId.isValid(showId)) {
            return { error: "Invalid show ID format." };
        }
        await db.collection('shows').deleteOne({ _id: new ObjectId(showId) });

        revalidatePath('/shows');
        revalidatePath('/dashboard/shows');

        return { data: "Show deleted successfully." };
    } catch (e) {
        console.error(e);
        return { error: "Failed to delete show." };
    }
}


const addSongToShowSchema = z.object({
    showId: z.string(),
    songId: z.string().min(1, "Please select a song."),
    performer: z.string().min(1, "Performer is required."),
    adjustedScale: z.string().optional(),
});

export async function addSongToShow(formData: FormData) {
    const values = Object.fromEntries(formData.entries());
    const parsed = addSongToShowSchema.safeParse(values);

    if(!parsed.success) {
        return {
            error: parsed.error.flatten().fieldErrors,
        }
    }

    try {
        const { db } = await connectToDatabase();
        const { showId, songId, performer } = parsed.data;
        let { adjustedScale } = parsed.data;
        
        if (!ObjectId.isValid(showId) || !ObjectId.isValid(songId)) {
            return { error: "Invalid ID format for show or song." };
        }

        const show = await db.collection('shows').findOne({ _id: new ObjectId(showId) });
        if (!show) {
            return { error: "Show not found." };
        }

        if (!adjustedScale) {
            const song = await db.collection('songs').findOne({ _id: new ObjectId(songId) });
            if (!song) {
                return { error: "Song not found." };
            }
            adjustedScale = song.myScale;
        }

        const newSong = {
            _id: new ObjectId(),
            songId: songId, // Keep this as the string ID
            performer,
            adjustedScale,
            order: (show.songs || []).length + 1,
        };

        await db.collection('shows').updateOne(
            { _id: new ObjectId(showId) },
            { $push: { songs: newSong } }
        );
        
        revalidatePath(`/dashboard/shows/${showId}`);

        return {
            data: "Song added to show successfully."
        };
    } catch (e) {
        console.error(e);
        return {
            error: "Failed to add song to the show."
        };
    }

}


const editSongInShowSchema = z.object({
    songId: z.string().min(1, "Please select a song."),
    performer: z.string().min(1, "Performer is required."),
    adjustedScale: z.string().optional(),
});

export async function editSongInShow(showId: string, showSongId: string, formData: FormData) {
    if (!showId || !showSongId) {
        return { error: "Show ID and Show Song ID are required." };
    }
    if (!ObjectId.isValid(showId) || !ObjectId.isValid(showSongId)) {
        return { error: "Invalid ID format." };
    }

    const values = Object.fromEntries(formData.entries());
    const parsed = editSongInShowSchema.safeParse(values);

    if (!parsed.success) {
        return {
            error: parsed.error.flatten().fieldErrors,
        };
    }

    try {
        const { db } = await connectToDatabase();
        
        const updateResult = await db.collection('shows').updateOne(
            { "_id": new ObjectId(showId), "songs._id": new ObjectId(showSongId) },
            { 
                $set: { 
                    "songs.$.songId": parsed.data.songId,
                    "songs.$.performer": parsed.data.performer,
                    "songs.$.adjustedScale": parsed.data.adjustedScale
                } 
            }
        );

        if (updateResult.modifiedCount === 0) {
            return { error: "Song not found in this show or no changes were made." };
        }

        revalidatePath(`/dashboard/shows/${showId}`);
        return { data: "Song in show updated successfully." };

    } catch (e) {
        console.error(e);
        return { error: "Failed to update the song in the show." };
    }
}


export async function removeSongFromShow(showId: string, showSongId: string) {
    if (!showId || !showSongId) {
      return { error: "Show ID and Show Song ID are required." };
    }
  
    try {
      const { db } = await connectToDatabase();
      if (!ObjectId.isValid(showId) || !ObjectId.isValid(showSongId)) {
        return { error: "Invalid ID format." };
      }
      
      const show = await db.collection('shows').findOne({ _id: new ObjectId(showId) });
      if (!show) {
        return { error: "Show not found." };
      }
  
      // Pull the song from the array using its unique _id
      const updateResult = await db.collection('shows').updateOne(
        { _id: new ObjectId(showId) },
        { $pull: { songs: { _id: new ObjectId(showSongId) } } }
      );
  
      if (updateResult.modifiedCount === 0) {
        return { error: "Song not found in this show." };
      }
  
      // Now, re-fetch the show to re-order the remaining songs
      const updatedShow = await db.collection('shows').findOne({ _id: new ObjectId(showId) });
      if (!updatedShow) {
          // This should not happen if the previous step succeeded, but as a safeguard:
          return { error: "Failed to re-fetch show after song removal." };
      }

      const remainingSongs = (updatedShow.songs || [])
        .sort((a: any, b: any) => a.order - b.order)
        .map((song: any, index: number) => ({ ...song, order: index + 1 }));
  
      await db.collection('shows').updateOne(
        { _id: new ObjectId(showId) },
        { $set: { songs: remainingSongs } }
      );
  
      revalidatePath(`/dashboard/shows/${showId}`);
      return { data: "Song removed successfully." };
  
    } catch (e) {
      console.error(e);
      return { error: "Failed to remove song from the show." };
    }
}


export async function getSongs(songIds?: string[]): Promise<Song[]> {
    const { db } = await connectToDatabase();
    const query = songIds && songIds.length > 0 ? { id: { $in: songIds } } : {};
    const songs = await db.collection('songs').find(query).sort({ name: 1 }).toArray();
    
    // Manually convert all ObjectIds to strings
    return JSON.parse(JSON.stringify(songs));
}

export async function getShows(): Promise<Show[]> {
    const { db } = await connectToDatabase();
    const shows = await db.collection('shows').find({}).sort({ date: -1 }).toArray();
    return JSON.parse(JSON.stringify(shows));
}
    
