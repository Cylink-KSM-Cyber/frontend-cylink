/**
 * ChangelogDateDisplay component
 * @description Component for displaying changelog entry dates in various formats
 */

"use client";

import React from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ChangelogDateDisplayProps } from "@/interfaces/changelog";

/**
 * ChangelogDateDisplay component with flexible date formatting
 * @param props - Component properties
 * @returns ChangelogDateDisplay component
 */
const ChangelogDateDisplay: React.FC<ChangelogDateDisplayProps> = ({
  date,
  format: displayFormat = "long",
  className = "",
}) => {
  const parseDate = () => {
    try {
      return parseISO(date);
    } catch {
      console.error(`Invalid date format: ${date}`);
      return new Date();
    }
  };

  const formatDate = () => {
    const parsedDate = parseDate();

    switch (displayFormat) {
      case "short":
        return format(parsedDate, "MMM d, yyyy");
      case "relative":
        return formatDistanceToNow(parsedDate, { addSuffix: true });
      case "long":
      default:
        return format(parsedDate, "MMMM d, yyyy");
    }
  };

  return (
    <time dateTime={date} className={`text-gray-600 ${className}`}>
      {formatDate()}
    </time>
  );
};

export default ChangelogDateDisplay;
