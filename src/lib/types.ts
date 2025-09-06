
import type { ObjectId } from 'mongodb';

export type SongCategory = "Solo" | "Duet" | "Group" | "Male" | "Female" | "Mixed";

export interface Song {
  _id: string; // Changed from ObjectId
  id: string;
  name: string;
  youtubeLink?: string;
  originalScale: string;
  myScale: string;
  lyricist: string;
  singer: string;
  actor?: string;
  director?: string;
  movie?: string;
  category: SongCategory;
  notes?: string;
}

export interface ShowSong {
  _id: string; // Changed from ObjectId
  songId: string;
  performer: string;
  adjustedScale: string;
  order: number;
}

export interface Show {
  _id: string; // Changed from ObjectId
  id: string;
  name: string;
  date: string;
  venue?: string;
  songs: ShowSong[];
}
