import type { Path, UseFormSetError } from "react-hook-form";
import { extractValidationErrors, extractErrorMessage } from "./authApi";

/**
 * Set react-hook-form errors from server validation errors
 * @param error - The error from the server
 * @param setError - react-hook-form's setError function
 * @param fieldMapping - Optional mapping of server field names to form field names
 */
export const setFormErrors = <T extends Record<string, unknown>>(
  error: unknown,
  setError: UseFormSetError<T>,
  fieldMapping?: Record<string, keyof T>
): void => {
  const validationErrors = extractValidationErrors(error);

  // If no validation errors, set root error
  if (Object.keys(validationErrors).length === 0) {
    const message = extractErrorMessage(error);
    setError("root" as Path<T>, {
      type: "server",
      message,
    });
    return;
  }

  // Set errors for each field
  Object.entries(validationErrors).forEach(([fieldName, messages]) => {
    // Use field mapping if provided, otherwise use field name as-is
    const formFieldName = (fieldMapping?.[fieldName] || fieldName) as keyof T;

    // Get the first error message for this field
    const errorMessage = Array.isArray(messages) ? messages[0] : messages;

    if (errorMessage) {
      setError(formFieldName as Path<T>, {
        type: "server",
        message: errorMessage,
      });
    }
  });
};
