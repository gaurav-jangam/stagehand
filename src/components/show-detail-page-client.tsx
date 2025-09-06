
"use client";

import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Trash2, ArrowLeft, User, Mic, PlusCircle, MoreHorizontal, Edit, Search, ExternalLink, ListMusic, UserSquare } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
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
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { ClientDate } from '@/components/ui/client-date';
import type { Show, Song, ShowSong } from '@/lib/types';
import { useState, useEffect } from 'react';
import { removeSongFromShow, getSongs } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { AddSongToShowForm } from '@/components/add-song-to-show-form';
import { EditSongInShowForm } from '@/components/edit-song-in-show-form';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { EditSongForm } from './edit-song-form';
import { Input } from './ui/input';
import { useTable } from '@/hooks/use-table';
import { TablePagination } from './ui/table-pagination';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ShowDetailPageClientProps {
    show: Show;
    initialShowSongs: ShowSongWithDetails[];
}

type ShowSongWithDetails = ShowSong & Partial<Omit<Song, '_id' | 'id'>>;


export function ShowDetailPageClient({ show, initialShowSongs }: ShowDetailPageClientProps) {
  const [isAddSongOpen, setAddSongOpen] = useState(false);
  const [songToEditInShow, setSongToEditInShow] = useState<ShowSongWithDetails | null>(null);
  const [songToDelete, setSongToDelete] = useState<ShowSongWithDetails | null>(null);
  const [songToEditInLibrary, setSongToEditInLibrary] = useState<Song | null>(null);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  const {
    paginatedData: paginatedShowSongs,
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
    setData: setShowSongs
  } = useTable<ShowSongWithDetails>({
    initialData: initialShowSongs,
    searchKeys: ['name', 'performer', 'singer'],
    initialSortConfig: { key: 'order', direction: 'ascending' }
  });

  useEffect(() => {
    setShowSongs(initialShowSongs);
  }, [initialShowSongs, setShowSongs]);

  useEffect(() => {
    async function fetchSongs() {
      try {
        const songs = await getSongs();
        setAllSongs(songs);
      } catch (error) {
        console.error("Failed to fetch songs for dialogs", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load song library for editing.",
        });
      }
    }
    fetchSongs();
  }, [toast]);


  const handleDeleteSongFromShow = async () => {
    if (!songToDelete) return;
    
    const showSongId = songToDelete._id.toString();
    const songName = songToDelete.name || "The song";

    const result = await removeSongFromShow(show.id.toString(), showSongId);

    if (result.error) {
        toast({
            variant: "destructive",
            title: "Failed to remove song",
            description: result.error,
        });
    } else {
        toast({
            title: "Song Removed",
            description: `"${songName}" has been removed from the show.`,
        });
        router.refresh();
    }
    setSongToDelete(null);
  }

  const onSongAdded = () => {
    setAddSongOpen(false);
    router.refresh();
  }

  const onSongInShowEdited = () => {
    setSongToEditInShow(null);
    router.refresh();
  }
  
  const onSongInLibraryEdited = () => {
    setSongToEditInLibrary(null);
    router.refresh();
  }

  const getSongFromLibrary = (songId: string | undefined): Song | null => {
    if (!songId) return null;
    const songDetails = allSongs.find(s => s.id === songId);
    if (!songDetails) return null;
    
    return songDetails;
}


  return (
    <div className="relative min-h-full">
        <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <a href="/dashboard/shows">
                            <ArrowLeft className="h-4 w-4" />
                        </a>
                    </Button>
                    <div className="space-y-1.5">
                        <h1 className="font-headline text-3xl font-bold tracking-tight">{show.name}</h1>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <Dialog open={isAddSongOpen} onOpenChange={setAddSongOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Song
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Song to "{show.name}"</DialogTitle>
                            </DialogHeader>
                            <AddSongToShowForm showId={show.id.toString()} allSongs={allSongs} onSongAdded={onSongAdded} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
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
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search this show..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
            </div>

            {/* Mobile View */}
            <div className="grid gap-4 md:hidden">
                <AnimatePresence>
                {paginatedShowSongs.length > 0 ? (
                paginatedShowSongs.map(song => (
                    <motion.div
                        key={song._id}
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
                                    <span className="font-bold text-primary text-lg">{song.order}.</span>
                                    <span className='text-base'>{song.name}</span>
                                    {song.youtubeLink && (
                                    <Link href={song.youtubeLink} target="_blank">
                                        <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-primary" />
                                    </Link>
                                    )}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                    <DropdownMenuItem onSelect={() => setSongToEditInShow(song)}>
                                        <Edit className='mr-2 h-4 w-4' /> Edit in Show
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => { const s = getSongFromLibrary(song.songId); if (s) setSongToEditInLibrary(s); }}>
                                        <Edit className='mr-2 h-4 w-4' /> Edit in Library
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => setSongToDelete(song)}>
                                        <Trash2 className="mr-2 h-4 w-4" /> Remove from Show
                                    </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <UserSquare className="h-4 w-4 text-muted-foreground" />
                                    <span>Performer: {song.performer}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ListMusic className="h-4 w-4 text-muted-foreground" />
                                    <span>Adjusted Scale: <Badge variant="default">{song.adjustedScale}</Badge></span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mic className="h-4 w-4" />
                                    <span>Original Singer: {song.singer}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))
                ) : (
                    <div className="col-span-full h-24 text-center flex items-center justify-center">
                        No songs found for this show.
                    </div>
                )}
                </AnimatePresence>
            </div>

            {/* Desktop View */}
            <div className={cn("rounded-lg border backdrop-blur-[2px] transition-all duration-500 hidden md:block")}>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead onClick={() => requestSort('order')} className="cursor-pointer min-w-[4rem] flex-nowrap">
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        ID {getSortIcon('order')}
                      </div>
                    </TableHead>
                    <TableHead onClick={() => requestSort('name')} className="cursor-pointer">
                      <div className="flex items-center gap-1">
                        Song {getSortIcon('name')}
                      </div>
                    </TableHead>
                    <TableHead onClick={() => requestSort('performer')} className="cursor-pointer">
                      <div className="flex items-center gap-1">
                        Performer(s) {getSortIcon('performer')}
                      </div>
                    </TableHead>
                    <TableHead onClick={() => requestSort('adjustedScale')} className="cursor-pointer">
                      <div className="flex items-center gap-1">
                        Adjusted Scale {getSortIcon('adjustedScale')}
                      </div>
                    </TableHead>
                    <TableHead onClick={() => requestSort('singer')} className="cursor-pointer">
                      <div className="flex items-center gap-1">
                        Original Singer {getSortIcon('singer')}
                      </div>
                    </TableHead>
                    <TableHead className="w-[50px] text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <AnimatePresence>
                    {paginatedShowSongs.length > 0 ? paginatedShowSongs.map(song => (
                    <motion.tr 
                        key={song._id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="bg-transparent hover:bg-muted/50"
                    >
                        <TableCell className="font-bold text-muted-foreground">{song.order}</TableCell>
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
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onSelect={() => setSongToEditInShow(song)}>
                                        <Edit className='mr-2 h-4 w-4' />
                                        Edit in Show
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => {
                                       const songFromLibrary = getSongFromLibrary(song.songId);
                                       if (songFromLibrary) {
                                           setSongToEditInLibrary(songFromLibrary)
                                       } else {
                                            toast({
                                                variant: "destructive",
                                                title: "Error",
                                                description: "Could not find the song in the library to edit.",
                                            });
                                       }
                                    }}>
                                       <Edit className='mr-2 h-4 w-4' />
                                        Edit in Library
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => setSongToDelete(song)}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Remove from Show
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </motion.tr>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24">
                                No songs found.
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
                setRowsPerPage={(val) => { setRowsPerPage(val as 5 | 10 | 20 | 50 | 100); setCurrentPage(1); }}
                onPageChange={setCurrentPage}
                canPreviousPage={canPrevPage}
                canNextPage={canNextPage}
                previousPage={prevPage}
                nextPage={nextPage}
            />
        </div>

        <Dialog open={!!songToEditInShow} onOpenChange={(isOpen) => !isOpen && setSongToEditInShow(null)}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Song in Show</DialogTitle>
                </DialogHeader>
                {songToEditInShow && <EditSongInShowForm showId={show._id.toString()} songInShow={songToEditInShow} onSongEdited={onSongInShowEdited} />}
            </DialogContent>
        </Dialog>

        <Dialog open={!!songToEditInLibrary} onOpenChange={(isOpen) => !isOpen && setSongToEditInLibrary(null)}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit "{songToEditInLibrary?.name}"</DialogTitle>
                </DialogHeader>
                {songToEditInLibrary && <EditSongForm song={songToEditInLibrary} onSongEdited={onSongInLibraryEdited} />}
            </DialogContent>
       </Dialog>

        <AlertDialog open={!!songToDelete} onOpenChange={(isOpen) => !isOpen && setSongToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will remove "{songToDelete?.name}" from this show. It will not delete the song from your main library.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteSongFromShow}>Remove</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
