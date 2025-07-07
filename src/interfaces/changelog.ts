/**
 * Changelog Interfaces
 * @description TypeScript interfaces for changelog feature data structures
 */

/**
 * Changelog entry category types
 */
export type ChangelogCategory =
  | "Feature"
  | "Bug Fix"
  | "Improvement"
  | "Security"
  | "Performance"
  | "Documentation"
  | "Breaking Change";

/**
 * Changelog entry frontmatter metadata
 */
export interface ChangelogFrontmatter {
  /** Entry title */
  title: string;
  /** Publication date in YYYY-MM-DD format */
  date: string;
  /** Version number (e.g., "1.2.0") */
  version: string;
  /** Category tags for the update */
  category: ChangelogCategory[];
  /** Author of the update */
  author: string;
  /** Brief summary of the update */
  summary: string;
  /** Whether this entry is published */
  published?: boolean;
  /** Featured flag for highlighting important updates */
  featured?: boolean;
  /** Tags for additional categorization */
  tags?: string[];
}

/**
 * Changelog entry with parsed content
 */
export interface ChangelogEntry {
  /** Unique identifier (filename without extension) */
  id: string;
  /** Frontmatter metadata */
  frontmatter: ChangelogFrontmatter;
  /** Parsed markdown content */
  content: string;
  /** File path */
  filePath: string;
  /** URL slug for the entry */
  slug: string;
}

/**
 * Props for ChangelogEntry component
 */
export interface ChangelogEntryProps {
  /** Changelog entry data */
  entry: ChangelogEntry;
  /** Whether the entry is expanded by default */
  defaultExpanded?: boolean;
  /** Whether to show the full content or just preview */
  showFullContent?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Callback when entry is expanded/collapsed */
  onToggle?: (expanded: boolean) => void;
}

/**
 * Props for ChangelogList component
 */
export interface ChangelogListProps {
  /** Array of changelog entries */
  entries: ChangelogEntry[];
  /** Number of entries to show initially */
  initialCount?: number;
  /** Whether to enable pagination */
  enablePagination?: boolean;
  /** Items per page for pagination */
  itemsPerPage?: number;
  /** Custom CSS classes */
  className?: string;
}

/**
 * Props for ChangelogCategoryBadge component
 */
export interface ChangelogCategoryBadgeProps {
  /** Category type */
  category: ChangelogCategory;
  /** Badge size */
  size?: "sm" | "md" | "lg";
  /** Custom CSS classes */
  className?: string;
}

/**
 * Props for ChangelogDateDisplay component
 */
export interface ChangelogDateDisplayProps {
  /** Date string in YYYY-MM-DD format */
  date: string;
  /** Display format */
  format?: "short" | "long" | "relative";
  /** Custom CSS classes */
  className?: string;
}

/**
 * Props for ChangelogTemplate component
 */
export interface ChangelogTemplateProps {
  /** Array of changelog entries */
  entries: ChangelogEntry[];
  /** Page title */
  title?: string;
  /** Page description */
  description?: string;
  /** Custom CSS classes */
  className?: string;
}

/**
 * Changelog filter options
 */
export interface ChangelogFilter {
  /** Filter by categories */
  categories?: ChangelogCategory[];
  /** Filter by date range */
  dateRange?: {
    start: string;
    end: string;
  };
  /** Filter by tags */
  tags?: string[];
  /** Search query */
  search?: string;
  /** Show only featured entries */
  featuredOnly?: boolean;
}

/**
 * Props for ChangelogFilter component
 */
export interface ChangelogFilterProps {
  /** Current filter state */
  filter: ChangelogFilter;
  /** Callback when filter changes */
  onFilterChange: (filter: ChangelogFilter) => void;
  /** Available categories for filtering */
  availableCategories: ChangelogCategory[];
  /** Available tags for filtering */
  availableTags: string[];
  /** Custom CSS classes */
  className?: string;
}

/**
 * Category color mapping configuration
 */
export interface CategoryColorConfig {
  /** Background color class */
  bg: string;
  /** Text color class */
  text: string;
  /** Border color class */
  border: string;
}

/**
 * Changelog page static props
 */
export interface ChangelogPageProps {
  /** Pre-sorted changelog entries */
  entries: ChangelogEntry[];
  /** Available categories for filtering */
  categories: ChangelogCategory[];
  /** Available tags for filtering */
  tags: string[];
}

/**
 * Changelog generation options
 */
export interface ChangelogGenerationOptions {
  /** Directory path for changelog files */
  changelogDir: string;
  /** Whether to include draft entries */
  includeDrafts?: boolean;
  /** Sort order */
  sortOrder?: "asc" | "desc";
  /** Limit number of entries */
  limit?: number;
}
