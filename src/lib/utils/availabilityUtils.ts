/**
 * Availability utility functions
 */

export type AvailabilityStatus = "Available" | "Busy" | "NotAvailable";

/**
 * Get the color class for an availability status
 */
export function getAvailabilityColor(availability: string | null | undefined): string {
  if (!availability) return "";
  
  const normalized = availability.trim();
  
  switch (normalized) {
    case "Available":
      return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
    case "Busy":
      return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
    case "NotAvailable":
      return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
    default:
      return "";
  }
}

/**
 * Check if availability value is valid
 */
export function isValidAvailability(value: string): value is AvailabilityStatus {
  return value === "Available" || value === "Busy" || value === "NotAvailable";
}

