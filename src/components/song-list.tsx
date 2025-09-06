
"use client";

import React, { useState, useEffect, startTransition } from 'react';
import type { Song } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
import { MoreHorizontal, PlusCircle, Search, ExternalLink, Music, User, Film, Tag, Mic } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AddSongForm } from '@/components/add-song-form';
import { EditSongForm } from '@/components/edit-song-form';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { deleteSong } from '@/app/actions';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useTable } from '@/hooks/use-table';
import { TablePagination } from './ui/table-pagination';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface SongListProps {
  initialSongs: Song[];
  isReadOnly?: boolean;
  rowsPerPage?: 5 | 10 | 20 | 50 | 100;
}

export function SongList({ initialSongs, isReadOnly = false, rowsPerPage: initialRowsPerPage = 10 }: SongListProps) {
  const [isAddSongOpen, setAddSongOpen] = useState(false);
  const [songToEdit, setSongToEdit] = useState<Song | null>(null);
  const [songToDelete, setSongToDelete] = useState<Song | null>(null);

  const { toast } = useToast();
  const router = useRouter();

  const {
    paginatedData,
    requestSort,
    getSortIcon,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    nextPage,
    prevPage,
    canNextPage,
    canPrevPage,
    rowsPerPage,
    setRowsPerPage,
    totalItems,
    setData: setSongs
  } = useTable<Song>({
      initialData: initialSongs,
      searchKeys: ['name', 'singer', 'lyricist', 'movie', 'category'],
      initialSortConfig: { key: 'name', direction: 'ascending'},
      initialRowsPerPage: initialRowsPerPage,
  });

  const onSongAdded = () => {
    setAddSongOpen(false);
    startTransition(() => {
        router.refresh();
    });
  }
  
  const onSongEdited = () => {
    setSongToEdit(null);
    startTransition(() => {
        router.refresh();
    });
  }

  const handleDeleteSong = async () => {
    if (!songToDelete) return;

    const songId = songToDelete._id.toString();
    const songName = songToDelete.name;

    setSongs((prevSongs) => prevSongs.filter((s) => s._id.toString() !== songId));
    setSongToDelete(null);

    const result = await deleteSong(songId);
    
    if (result.error) {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: result.error,
        });
        router.refresh();
    } else {
        toast({
            title: "Song Deleted!",
            description: `"${songName}" has been removed from your library.`,
        });
    }
  }
  
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search songs..."
            className="pl-9 backdrop-blur-[2px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {!isReadOnly && (
            <Dialog open={isAddSongOpen} onOpenChange={setAddSongOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Song
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add a New Song</DialogTitle>
                </DialogHeader>
                <AddSongForm onSongAdded={onSongAdded} />
              </DialogContent>
            </Dialog>
          )}
      </div>

      {/* Mobile View - Cards */}
      <div className="grid gap-4 md:hidden">
        <AnimatePresence>
        {paginatedData.length > 0 ? (
          paginatedData.map((song) => (
            <motion.div
              key={song.id}
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Card className="bg-transparent backdrop-blur-[2px]">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Music className="h-5 w-5 text-primary" />
                        <span className='text-base'>{song.name}</span>
                        {song.youtubeLink && (
                          <Link href={song.youtubeLink} target="_blank">
                            <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-primary" />
                          </Link>
                        )}
                    </div>
                    {!isReadOnly && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => setSongToEdit(song)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => setSongToDelete(song)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                   <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{song.singer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Film className="h-4 w-4 text-muted-foreground" />
                      <span>{song.movie || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mic className="h-4 w-4 text-muted-foreground" />
                      <span>{song.myScale}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="secondary">{song.category}</Badge>
                    </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
            <div className="col-span-full h-24 text-center flex items-center justify-center">
                No songs found.
                {!isReadOnly && " Add a song to get started."}
            </div>
        )}
        </AnimatePresence>
      </div>
      
      {/* Desktop View - Table */}
      <div className={cn("rounded-lg border backdrop-blur-[2px] transition-all duration-500 hidden md:block")}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => requestSort('name')} className="cursor-pointer">
                Song Name {getSortIcon('name')}
              </TableHead>
              <TableHead onClick={() => requestSort('singer')} className="cursor-pointer">
                Singer {getSortIcon('singer')}
              </TableHead>
              <TableHead onClick={() => requestSort('movie')} className="cursor-pointer">
                Movie/Album {getSortIcon('movie')}
              </TableHead>
              <TableHead onClick={() => requestSort('category')} className="cursor-pointer">
                Category {getSortIcon('category')}
              </TableHead>
              <TableHead onClick={() => requestSort('myScale')} className="cursor-pointer">
                My Scale {getSortIcon('myScale')}
              </TableHead>
              {!isReadOnly && <TableHead className="w-[50px] text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {paginatedData.length > 0 ? (
                paginatedData.map((song) => (
                  <motion.tr 
                    key={song.id}
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="bg-transparent hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{song.name}</span>
                        {song.youtubeLink && (
                          <Link href={song.youtubeLink} target="_blank">
                            <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-primary" />
                          </Link>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{song.singer}</TableCell>
                    <TableCell>{song.movie || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{song.category}</Badge>
                    </TableCell>
                    <TableCell>{song.myScale}</TableCell>
                    {!isReadOnly && (
                      <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                               <DropdownMenuItem onSelect={() => setSongToEdit(song)}>
                                Edit
                              </DropdownMenuItem>
                                <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive"
                                    onSelect={() => setSongToDelete(song)}
                                >
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                      </TableCell>
                    )}
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isReadOnly ? 5 : 6} className="h-24 text-center">
                    No songs found.
                    {!isReadOnly && " Add a song to get started."}
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        totalItems={totalItems}
        setRowsPerPage={(val) => { setRowsPerPage(val); setCurrentPage(1); }}
        onPageChange={setCurrentPage}
        canPreviousPage={canPrevPage}
        canNextPage={canNextPage}
        previousPage={prevPage}
        nextPage={nextPage}
      />

      <Dialog open={!!songToEdit} onOpenChange={(isOpen) => !isOpen && setSongToEdit(null)}>
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>Edit "{songToEdit?.name}"</DialogTitle>
            </DialogHeader>
            {songToEdit && <EditSongForm song={songToEdit} onSongEdited={onSongEdited} />}
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!songToDelete} onOpenChange={(isOpen) => !isOpen && setSongToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the song
                "{songToDelete?.name}".
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteSong}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
