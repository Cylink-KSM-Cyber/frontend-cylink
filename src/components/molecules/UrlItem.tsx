import React from "react";
import { Url } from "@/interfaces/url";

/**
 * Props for the UrlItem component
 */
interface UrlItemProps {
  url: Url;
  onDelete: (id: number) => Promise<boolean>;
  onToggleStatus: (id: number, isActive: boolean) => Promise<boolean>;
}

/**
 * URL Item Component
 * @description A component that displays a single URL item with actions
 */
const UrlItem = ({ url, onDelete, onToggleStatus }: UrlItemProps) => {
  const formattedDate = new Date(url.created_at).toLocaleDateString();

  return (
    <div className="border rounded-lg p-4 mb-4 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{url.title ?? "Untitled"}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onToggleStatus(url.id, !url.is_active)}
            className={`px-2 py-1 rounded text-xs ${
              url.is_active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {url.is_active ? "Active" : "Inactive"}
          </button>
          <button
            onClick={() => onDelete(url.id)}
            className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mb-2 text-sm text-gray-600 break-all">
        <div>
          Original:{" "}
          <a
            href={url.original_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {url.original_url}
          </a>
        </div>
        <div>
          Short:{" "}
          <a
            href={url.short_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {url.short_url}
          </a>
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <div>Created: {formattedDate}</div>
        <div>Clicks: {url.clicks}</div>
      </div>
    </div>
  );
};

export default UrlItem;
