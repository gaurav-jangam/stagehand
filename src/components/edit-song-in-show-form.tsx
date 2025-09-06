
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { editSongInShow, getSongs } from "@/app/actions";
import type { ShowSong, Song } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect, useState } from "react";


const FormSchema = z.object({
  songId: z.string().min(1, "Please select a song."),
  performer: z.string().min(1, "Performer is required."),
  adjustedScale: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;
type ShowSongWithDetails = ShowSong & Partial<Song>;

interface EditSongInShowFormProps {
  showId: string;
  songInShow: ShowSongWithDetails;
  onSongEdited: () => void;
}

export function EditSongInShowForm({ showId, songInShow, onSongEdited }: EditSongInShowFormProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSongs() {
        try {
            const songs = await getSongs();
            setAllSongs(songs);
        } catch (error) {
            console.error("Failed to fetch songs", error);
            toast({
                variant: "destructive",
                title: "Failed to load songs",
                description: "Could not fetch the song library. Please try again later.",
            });
        } finally {
            setLoading(false);
        }
    }
    fetchSongs();
  }, [toast]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      songId: songInShow.songId || "",
      performer: songInShow.performer || "",
      adjustedScale: songInShow.adjustedScale || "",
    },
  });

  const selectedSongId = form.watch("songId");

  useEffect(() => {
    // This effect runs when the selected song changes.
    // We want to update the adjustedScale, but only if the user hasn't already provided a custom value.
    const currentAdjustedScale = form.getValues("adjustedScale");
    
    // Find the original scale of the song that was initially being edited
    const originalSongForThisShowItem = allSongs.find(s => s.id === songInShow.songId);

    // If the selected song is the same as the initial song and the scale hasn't been changed from initial, don't auto-update.
    if(selectedSongId === songInShow.songId && currentAdjustedScale === songInShow.adjustedScale) {
        return;
    }

    if (selectedSongId) {
      const selectedSong = allSongs.find((song) => song.id === selectedSongId);
      if (selectedSong) {
        form.setValue("adjustedScale", selectedSong.myScale);
      }
    }
  }, [selectedSongId, allSongs, form, songInShow]);

  async function onSubmit(data: FormValues) {
    const formData = new FormData();
    formData.append("songId", data.songId);
    formData.append("performer", data.performer);
    if (data.adjustedScale) {
      formData.append("adjustedScale", data.adjustedScale);
    }
    
    const result = await editSongInShow(showId, songInShow._id.toString(), formData);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: typeof result.error === 'string' ? result.error : "There was a problem with your request.",
      });
    } else {
      toast({
        title: "Song Updated!",
        description: `The song details have been updated for this show.`,
      });
      onSongEdited();
    }
  }

  const filteredSongs = allSongs.filter(song => 
    song.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        
        <FormField
          control={form.control}
          name="songId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Song</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a song..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <div className="p-2">
                        <Input 
                            placeholder="Search by song name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <ScrollArea className="h-48">
                        {filteredSongs.length > 0 ? filteredSongs.map((song) => (
                            <SelectItem key={song.id} value={song.id.toString()}>
                                {song.name}
                            </SelectItem>
                        )) : <p className="p-2 text-sm text-muted-foreground">No songs found.</p>}
                    </ScrollArea>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="performer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Performer(s)</FormLabel>
              <FormControl>
                <Input placeholder="Enter performer name(s)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="adjustedScale"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adjusted Scale (Optional)</FormLabel>
              <FormControl>
                <Input placeholder={`Defaults to the song's 'My Scale'`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={form.formState.isSubmitting || loading}>
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
