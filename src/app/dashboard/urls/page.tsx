import React from "react";
import UrlList from "@/components/organisms/UrlList";

/**
 * URLs Page
 * @description Dashboard page for displaying and managing URLs
 */
export default function UrlsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Your URLs</h1>
        <p className="text-gray-600">View and manage all your shortened URLs</p>
      </div>

      <UrlList />
    </div>
  );
}
