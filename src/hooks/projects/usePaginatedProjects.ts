import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { projectService } from "@/services/projectService";
import type { ProjectFilter, PaginatedProjectsResponse } from "@/types/projects";

const DEFAULT_PAGE_SIZE = 10;

/**
 * Custom hook for paginated projects with React Query caching and URL-aware pagination
 * 
 * Features:
 * - React Query caching for instant page switching
 * - URL-aware pagination (page number in query params)
 * - Proper loading states
 * - Automatic cache management
 */
export const usePaginatedProjects = (filter?: Omit<ProjectFilter, "pageNumber" | "pageSize">) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get page number from URL, default to 1
  const pageNumber = parseInt(searchParams.get("page") || "1", 10) || 1;
  const pageSize = parseInt(searchParams.get("pageSize") || String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE;

  // Build query key with all filter params + pagination
  const queryKey = [
    "projects",
    "paginated",
    { ...filter, pageNumber, pageSize },
  ] as const;

  // Fetch paginated projects
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    isPlaceholderData,
  } = useQuery<PaginatedProjectsResponse>({
    queryKey,
    queryFn: async () => {
      const response = await projectService.getProjects({
        ...filter,
        pageNumber,
        pageSize,
      });
      return response;
    },
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    // Keep previous data while fetching new page for smooth transitions
    placeholderData: (previousData) => previousData,
  });

  // Navigation functions
  const goToPage = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    if (newPage === 1) {
      newParams.delete("page");
    } else {
      newParams.set("page", String(newPage));
    }
    setSearchParams(newParams, { replace: false });
  };

  const nextPage = () => {
    if (data?.hasNextPage) {
      goToPage(pageNumber + 1);
    }
  };

  const previousPage = () => {
    if (data?.hasPreviousPage) {
      goToPage(pageNumber - 1);
    }
  };

  const setPageSize = (newPageSize: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("pageSize", String(newPageSize));
    // Reset to page 1 when changing page size
    newParams.delete("page");
    setSearchParams(newParams, { replace: false });
  };

  return {
    // Data
    projects: data?.items || [],
    pageNumber,
    totalPages: data?.totalPages || 0,
    hasNextPage: data?.hasNextPage || false,
    hasPreviousPage: data?.hasPreviousPage || false,
    
    // Loading states
    isLoading, // Initial load
    isFetching, // Any fetch (including background refetch)
    isError,
    error,
    
    // Smooth transitions - true when showing cached data while fetching new page
    isPlaceholderData,
    
    // Navigation
    goToPage,
    nextPage,
    previousPage,
    setPageSize,
    
    // Current page size
    pageSize,
  };
};

