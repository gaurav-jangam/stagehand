
"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Music, Search } from 'lucide-react';
import Link from 'next/link';
import { ClientDateString } from '@/components/ui/client-date';
import type { Show } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from './ui/input';
import { useTable } from '@/hooks/use-table';
import { TablePagination } from './ui/table-pagination';

export function PublicShowsList({ allShows: initialShows }: { allShows: Show[] }) {
  
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
  } = useTable<Show>({
      initialData: initialShows,
      searchKeys: ['name', 'venue'],
      initialRowsPerPage: 5
  });

  return (
    <div className="flex flex-col gap-6">
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
                {searchTerm ? "Try a different search term." : "Check back later for upcoming shows."}
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
                <Card className="h-full transform transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 bg-transparent backdrop-blur-[2px]">
                  <Link href={`/shows/${show.id}`} className="block h-full">
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
  );
}
