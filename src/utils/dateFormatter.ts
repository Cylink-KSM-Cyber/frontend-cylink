/**
 * Format a date string into a readable format
 * @param dateString - The ISO date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "";
    }

    // Format the date using toLocaleDateString
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};
