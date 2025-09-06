
"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { songCategories } from "@/lib/data";
import { editSong } from "@/app/actions";
import type { Song } from "@/lib/types";

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

type SongFormValues = z.infer<typeof songSchema>;

interface EditSongFormProps {
  song: Song;
  onSongEdited: () => void;
}

export function EditSongForm({ song, onSongEdited }: EditSongFormProps) {
  const { toast } = useToast();

  const form = useForm<SongFormValues>({
    resolver: zodResolver(songSchema),
    defaultValues: {
      name: song.name || "",
      singer: song.singer || "",
      lyricist: song.lyricist || "",
      movie: song.movie || "",
      category: song.category || "Solo",
      originalScale: song.originalScale || "",
      myScale: song.myScale || "",
      youtubeLink: song.youtubeLink || "",
    },
  });

  async function onSubmit(data: SongFormValues) {
    const formData = new FormData();
    for (const key in data) {
        formData.append(key, (data as any)[key]);
    }
    
    const result = await editSong(song._id, formData);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: typeof result.error === 'string' ? result.error : "There was a problem with your request.",
      });
    } else {
      toast({
        title: "Song Updated!",
        description: `"${data.name}" has been updated.`,
      });
      onSongEdited();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Song Name</FormLabel>
                <FormControl>
                    <Input placeholder="Enter song name" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="singer"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Singer(s)</FormLabel>
                <FormControl>
                    <Input placeholder="Enter singer(s)" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="lyricist"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Lyricist</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter lyricist" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="movie"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Movie/Album</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter movie or album" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {songCategories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="originalScale"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Original Scale</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., C# Major" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="myScale"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>My Scale</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., A Minor" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        
        <FormField
            control={form.control}
            name="youtubeLink"
            render={({ field }) => (
                <FormItem>
                <FormLabel>YouTube Link</FormLabel>
                <FormControl>
                    <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
