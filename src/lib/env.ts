// Environment configuration
export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "https://localhost:7226/api/v1",
  APP_NAME: import.meta.env.VITE_APP_NAME || "Freeqy",
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",
  ENABLE_DEVTOOLS:
    import.meta.env.VITE_ENABLE_DEVTOOLS === "true" || import.meta.env.DEV,
} as const;
