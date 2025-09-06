
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
import { addSongToShow } from "@/app/actions";
import type { Song } from "@/lib/types";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "./ui/scroll-area";


const FormSchema = z.object({
  songId: z.string().min(1, "Please select a song."),
  performer: z.string().min(1, "Performer is required."),
  adjustedScale: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

interface AddSongToShowFormProps {
  showId: string;
  allSongs: Song[];
  onSongAdded: () => void;
}

export function AddSongToShowForm({ showId, allSongs, onSongAdded }: AddSongToShowFormProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        performer: "",
        adjustedScale: "",
        songId: "",
    }
  });

  const selectedSongId = form.watch("songId");

  useEffect(() => {
    if (selectedSongId) {
      const selectedSong = allSongs.find((song) => song.id === selectedSongId);
      if (selectedSong) {
        form.setValue("adjustedScale", selectedSong.myScale);
      }
    } else {
        form.setValue("adjustedScale", "");
    }
  }, [selectedSongId, allSongs, form]);


  async function onSubmit(data: FormValues) {
    const formData = new FormData();
    formData.append("showId", showId);
    formData.append("songId", data.songId);
    formData.append("performer", data.performer);
    if (data.adjustedScale) {
        formData.append("adjustedScale", data.adjustedScale);
    }
    
    const result = await addSongToShow(formData);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: typeof result.error === 'string' ? result.error : "There was a problem with your request.",
      });
    } else {
      toast({
        title: "Song Added!",
        description: `The song has been added to the show.`,
      });
      onSongAdded();
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Input placeholder="Defaults to the song's 'My Scale'" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Adding..." : "Add Song to Show"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

