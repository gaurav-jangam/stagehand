
"use client";

import * as React from 'react';
import { useState, useMemo, useCallback } from 'react';

type SortDirection = 'ascending' | 'descending';

interface SortConfig<T> {
  key: keyof T | null;
  direction: SortDirection;
}

interface UseTableProps<T> {
  initialData: T[];
  initialSortConfig?: SortConfig<T>;
  initialRowsPerPage?: 5 | 10 | 20 | 50 | 100;
  searchKeys?: (keyof T)[];
}

export function useTable<T>({
  initialData,
  initialSortConfig = { key: null, direction: 'ascending' },
  initialRowsPerPage = 10,
  searchKeys = [],
}: UseTableProps<T>) {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>(initialSortConfig);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const sortedAndFilteredData = useMemo(() => {
    let processData = [...data];

    // --- Search/Filter Logic ---
    if (searchTerm && searchKeys.length > 0) {
      const lowercasedFilter = searchTerm.toLowerCase();
      processData = processData.filter(item => {
        return searchKeys.some(key => {
          const value = item[key];
          return value && String(value).toLowerCase().includes(lowercasedFilter);
        });
      });
    }
    
    // --- Sorting Logic ---
    if (sortConfig.key) {
      processData.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return processData;
  }, [data, searchTerm, searchKeys, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedAndFilteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedAndFilteredData, currentPage, rowsPerPage]);

  const requestSort = useCallback((key: keyof T) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page after sorting
  }, [sortConfig]);

  const totalPages = Math.ceil(sortedAndFilteredData.length / rowsPerPage);

  const nextPage = () => {
    setCurrentPage((current) => Math.min(current + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((current) => Math.max(current - 1, 1));
  };
  
  const canNextPage = currentPage < totalPages;
  const canPrevPage = currentPage > 1;

  const getSortIcon = (key: keyof T) => {
    if (sortConfig.key !== key) {
        return null;
    }
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  }


  return {
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
    totalItems: sortedAndFilteredData.length,
    setData, // Expose setData to allow optimistic updates
  };
}
