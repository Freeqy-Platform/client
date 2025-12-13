import { QueryClient } from "@tanstack/react-query";

// Type guard to check if error has axios response structure
const isAxiosError = (
  error: unknown
): error is { response?: { status?: number } } => {
  return error !== null && typeof error === "object" && "response" in error;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Global query defaults
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: unknown) => {
        // Don't retry on 4xx errors (client errors)
        if (isAxiosError(error)) {
          const status = error.response?.status;
          if (status && status >= 400 && status < 500) {
            return false;
          }
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      // Global mutation defaults
      retry: (failureCount, error: unknown) => {
        // Don't retry on 4xx errors
        if (isAxiosError(error)) {
          const status = error.response?.status;
          if (status && status >= 400 && status < 500) {
            return false;
          }
        }
        // Retry once for network errors
        return failureCount < 1;
      },
      retryDelay: 1000,
    },
  },
});
