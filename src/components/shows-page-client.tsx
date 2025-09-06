
"use client";

import React, { useState, useEffect, startTransition } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Calendar, MapPin, Music, Trash2, Search } from 'lucide-react';
import Link from 'next/link';
import { ClientDateString } from '@/components/ui/client-date';
import type { Show } from '@/lib/types';
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
import { AddShowForm } from '@/components/add-show-form';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { deleteShow } from '@/app/actions';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from './ui/input';
import { useTable } from '@/hooks/use-table';
import { TablePagination } from './ui/table-pagination';

export function ShowsPageClient({ allShows: initialShows }: { allShows: Show[] }) {
  const [isAddShowOpen, setAddShowOpen] = useState(false);
  const [showToDelete, setShowToDelete] = useState<Show | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const {
    paginatedData,
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
    setData: setShows
  } = useTable<Show>({
      initialData: initialShows,
      searchKeys: ['name', 'venue'],
      initialRowsPerPage: 10
  });

  const onShowAdded = () => {
    setAddShowOpen(false);
    startTransition(() => {
        router.refresh();
    });
  }

  const handleDeleteShow = async () => {
    if (!showToDelete) return;
    const showId = showToDelete.id.toString();
    const showName = showToDelete.name || "The show";

    setShows(currentShows => currentShows.filter(s => s.id !== showId));
    setShowToDelete(null);
    
    const result = await deleteShow(showId);
    
    if(result.error) {
        toast({
            variant: "destructive",
            title: "Failed to delete show",
            description: result.error,
        });
        router.refresh();
    } else {
        toast({
            title: "Show Deleted",
            description: `"${showName}" has been deleted.`,
        });
    }
  }

  return (
    <div className="relative min-h-full">
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <h1 className="font-headline text-3xl font-bold tracking-tight">Shows</h1>
            <p className="text-muted-foreground">Manage your performances and show lists.</p>
          </div>
          <Dialog open={isAddShowOpen} onOpenChange={setAddShowOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Show
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create a New Show</DialogTitle>
                </DialogHeader>
                <AddShowForm onShowAdded={onShowAdded} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by show name or venue..."
            className="pl-9 backdrop-blur-[2px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {totalItems === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center backdrop-blur-[2px]">
              <h3 className="text-xl font-bold tracking-tight text-foreground">{searchTerm ? "No shows found" : "No shows yet"}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {searchTerm ? "Try a different search term." : "Get started by creating a new show."}
              </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
              {paginatedData.map(show => (
                <motion.div
                  key={show.id}
                  layout
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="h-full"
                >
                <Card 
                  className={cn(
                    "relative h-full transform transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 bg-transparent backdrop-blur-[2px]"
                  )}
                >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 z-10 h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      onClick={(e) => { 
                        e.stopPropagation();
                        e.preventDefault();
                        setShowToDelete(show);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  
                  <Link href={`/dashboard/shows/${show.id}`} className="block h-full">
                    <CardHeader>
                      <CardTitle className="font-headline tracking-wide pr-8">{show.name}</CardTitle>
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
                        <span>{show.songs?.length || 0} songs</span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
                </motion.div>
              ))}
              </AnimatePresence>
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
          </>
        )}
      </div>

       <AlertDialog open={!!showToDelete} onOpenChange={(isOpen) => !isOpen && setShowToDelete(null)}>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the show
                "{showToDelete?.name}".
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteShow}>Delete</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
