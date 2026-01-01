/**
 * Availability utility functions
 */

export type AvailabilityStatus = "Available" | "Busy" | "DoNotDisturb";
export type AvailabilityString = "1" | "2" | "3";

// Availability enum mapping
export const AvailabilityEnum = {
  Available: "1",
  Busy: "2",
  DoNotDisturb: "3",
} as const;

// Reverse mapping for display
export const AvailabilityLabels: Record<AvailabilityString, AvailabilityStatus> = {
  "1": "Available",
  "2": "Busy",
  "3": "DoNotDisturb",
};

/**
 * Convert string availability status to API string value
 */
export function availabilityStatusToString(
  availability: string | null | undefined
): AvailabilityString | undefined {
  if (!availability) return undefined;
  
  const normalized = availability.trim();
  
  switch (normalized) {
    case "Available":
      return "1";
    case "Busy":
      return "2";
    case "DoNotDisturb":
    case "NotAvailable": // Support legacy "NotAvailable" for backward compatibility
      return "3";
    default:
      return undefined;
  }
}

/**
 * Convert API string value to availability status string
 */
export function availabilityStringToStatus(
  availability: string | null | undefined
): AvailabilityStatus | undefined {
  if (availability === null || availability === undefined) return undefined;
  
  const normalized = String(availability).trim();
  
  if (normalized === "1") return "Available";
  if (normalized === "2") return "Busy";
  if (normalized === "3") return "DoNotDisturb";
  
  return undefined;
}

/**
 * Legacy function: Convert string availability to numeric enum (for backward compatibility)
 * @deprecated Use availabilityStatusToString instead
 */
export function availabilityStringToNumber(
  availability: string | null | undefined
): number | undefined {
  if (!availability) return undefined;
  
  const normalized = availability.trim();
  
  switch (normalized) {
    case "Available":
    case "1":
      return 0;
    case "Busy":
    case "2":
      return 1;
    case "NotAvailable":
    case "DoNotDisturb":
    case "3":
      return 2;
    default:
      return undefined;
  }
}

/**
 * Legacy function: Convert numeric availability to string (for backward compatibility)
 * @deprecated Use availabilityStringToStatus instead
 */
export function availabilityNumberToString(
  availability: number | null | undefined
): AvailabilityStatus | undefined {
  if (availability === null || availability === undefined) return undefined;
  
  if (availability === 0) return "Available";
  if (availability === 1) return "Busy";
  if (availability === 2) return "DoNotDisturb";
  
  return undefined;
}

/**
 * Get the color class for an availability status (accepts string status, API string value, or number)
 */
export function getAvailabilityColor(availability: string | number | null | undefined): string {
  if (availability === null || availability === undefined) return "";
  
  // Handle numeric values (legacy support)
  if (typeof availability === "number") {
    const status = availabilityNumberToString(availability);
    if (!status) return "";
    availability = status;
  }
  
  // Handle API string values ("1", "2", "3")
  const normalized = String(availability).trim();
  if (normalized === "1" || normalized === "2" || normalized === "3") {
    const status = availabilityStringToStatus(normalized);
    if (!status) return "";
    availability = status;
  }
  
  const statusStr = String(availability).trim();
  
  switch (statusStr) {
    case "Available":
      return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
    case "Busy":
      return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
    case "DoNotDisturb":
    case "NotAvailable": // Support legacy "NotAvailable"
      return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
    default:
      return "";
  }
}

/**
 * Get display label for availability (handles string status, API string value, or number)
 */
export function getAvailabilityLabel(availability: string | number | null | undefined): string {
  if (availability === null || availability === undefined) return "";
  
  // Handle numeric values (legacy support)
  if (typeof availability === "number") {
    const status = availabilityNumberToString(availability);
    if (!status) return "";
    return status === "DoNotDisturb" ? "Do Not Disturb" : status;
  }
  
  // Handle API string values ("1", "2", "3")
  const normalized = String(availability).trim();
  if (normalized === "1" || normalized === "2" || normalized === "3") {
    const status = availabilityStringToStatus(normalized);
    if (!status) return "";
    return status === "DoNotDisturb" ? "Do Not Disturb" : status;
  }
  
  // Handle string status values
  const statusStr = normalized;
  if (statusStr === "DoNotDisturb" || statusStr === "NotAvailable") {
    return "Do Not Disturb";
  }
  return statusStr;
}

/**
 * Check if availability value is valid (status string or API string value)
 */
export function isValidAvailability(value: string): boolean {
  const normalized = value.trim();
  return (
    normalized === "Available" ||
    normalized === "Busy" ||
    normalized === "DoNotDisturb" ||
    normalized === "NotAvailable" || // Legacy support
    normalized === "1" ||
    normalized === "2" ||
    normalized === "3"
  );
}

