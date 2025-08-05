import React, { useState, useCallback, useMemo } from "react";

export interface PaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalItems?: number;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
}

export interface PaginationActions {
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotalItems: (total: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  goToPage: (page: number) => void;
  reset: () => void;
}

export interface UsePaginationReturn extends PaginationState, PaginationActions {}

export function usePagination(options: PaginationOptions = {}): UsePaginationReturn {
  const {
    initialPage = 1,
    initialPageSize = 10,
    totalItems: initialTotalItems = 0,
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [totalItems, setTotalItemsState] = useState(initialTotalItems);

  const paginationState = useMemo((): PaginationState => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    return {
      currentPage,
      pageSize,
      totalItems,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      startIndex,
      endIndex,
    };
  }, [currentPage, pageSize, totalItems]);

  const setPage = useCallback((page: number) => {
    const { totalPages } = paginationState;
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [paginationState]);

  const setPageSize = useCallback((size: number) => {
    if (size > 0) {
      setPageSizeState(size);
      // Reset to first page when page size changes
      setCurrentPage(1);
    }
  }, []);

  const setTotalItems = useCallback((total: number) => {
    if (total >= 0) {
      setTotalItemsState(total);
      // Adjust current page if it becomes invalid
      const newTotalPages = Math.ceil(total / pageSize);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    }
  }, [currentPage, pageSize]);

  const nextPage = useCallback(() => {
    if (paginationState.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [paginationState.hasNextPage]);

  const previousPage = useCallback(() => {
    if (paginationState.hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [paginationState.hasPreviousPage]);

  const firstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const lastPage = useCallback(() => {
    if (paginationState.totalPages > 0) {
      setCurrentPage(paginationState.totalPages);
    }
  }, [paginationState.totalPages]);

  const goToPage = useCallback((page: number) => {
    setPage(page);
  }, [setPage]);

  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setPageSizeState(initialPageSize);
    setTotalItemsState(initialTotalItems);
  }, [initialPage, initialPageSize, initialTotalItems]);

  return {
    ...paginationState,
    setPage,
    setPageSize,
    setTotalItems,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    goToPage,
    reset,
  };
}

// Hook for paginated data fetching
export function usePaginatedData<T>(
  fetchFn: (page: number, pageSize: number) => Promise<{
    data: T[];
    total: number;
    page: number;
    pageSize: number;
  } | null>,
  options: PaginationOptions & {
    autoFetch?: boolean;
    dependencies?: any[];
  } = {}
) {
  const { autoFetch = true, dependencies = [], ...paginationOptions } = options;
  
  const pagination = usePagination(paginationOptions);
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (page?: number, size?: number) => {
    const targetPage = page ?? pagination.currentPage;
    const targetSize = size ?? pagination.pageSize;
    
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn(targetPage, targetSize);
      
      if (result) {
        setData(result.data);
        pagination.setTotalItems(result.total);
        
        // Update pagination state if page/size changed
        if (result.page !== targetPage) {
          pagination.setPage(result.page);
        }
        if (result.pageSize !== targetSize) {
          pagination.setPageSize(result.pageSize);
        }
      } else {
        setData([]);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, pagination]);

  // Auto-fetch data when pagination changes or dependencies change
  React.useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [pagination.currentPage, pagination.pageSize, ...dependencies]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const goToPageAndFetch = useCallback((page: number) => {
    pagination.setPage(page);
    // Data will be fetched automatically due to useEffect
  }, [pagination]);

  const changePageSizeAndFetch = useCallback((size: number) => {
    pagination.setPageSize(size);
    // Data will be fetched automatically due to useEffect
  }, [pagination]);

  return {
    ...pagination,
    data,
    loading,
    error,
    fetchData,
    refresh,
    goToPageAndFetch,
    changePageSizeAndFetch,
  };
}