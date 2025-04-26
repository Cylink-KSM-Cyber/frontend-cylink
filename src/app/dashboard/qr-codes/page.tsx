"use client";

import React, { useState, useEffect } from "react";
import { useQrCodes } from "@/hooks/useQrCodes";
import { QrCode, Url } from "@/interfaces/url";
import { useToast } from "@/contexts/ToastContext";
import { useSidebar } from "@/contexts/SidebarContext";
import QrCodesTemplate from "@/components/templates/QrCodesTemplate";
import QrCodeModal from "@/components/molecules/QrCodeModal";
import QrCodePreviewModal from "@/components/molecules/QrCodePreviewModal";
import QrCodeEditModal from "@/components/molecules/QrCodeEditModal";
import DeleteQrCodeModal from "@/components/molecules/DeleteQrCodeModal";
import CreateQrCodeModal from "@/components/molecules/CreateQrCodeModal";
import useCreateUrl from "@/hooks/url/useCreateUrl";
import { QrCodeFilter } from "@/interfaces/qrcode";
import "@/styles/qrcodesPage.css";

/**
 * QrCodesPage Component
 *
 * @description Dedicated page for QR codes management with comprehensive features
 * @returns QR codes management page component
 */
export default function QrCodesPage() {
  // Access sidebar context to set active item
  const { setActiveItemId } = useSidebar();

  // Access toast context for notifications
  const { showToast } = useToast();

  // Set initial filter with 12 items per page for grid view
  const [filter] = useState<QrCodeFilter>({
    page: 1,
    limit: 12,
    sortBy: "created_at",
    sortOrder: "desc",
    includeUrl: true,
  });

  // View mode state (grid or list)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Search term state
  const [searchTerm, setSearchTerm] = useState("");
  // Track if there's an active search
  const [isSearchActive, setIsSearchActive] = useState(false);

  // QR code selection for bulk actions
  const [selectedQrCodes, setSelectedQrCodes] = useState<QrCode[]>([]);

  // Fetch QR codes with the current filter
  const {
    qrCodes,
    isLoading,
    pagination,
    updateFilter,
    deleteQrCode,
    refreshQrCodes,
  } = useQrCodes(filter);

  // Get URL creation hook
  const { createUrl, isCreating: isCreatingUrl } = useCreateUrl();

  // Modal states
  const [createQrCodeModalOpen, setCreateQrCodeModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeletingQrCode, setIsDeletingQrCode] = useState(false);

  // Selected QR code for operations
  const [selectedQrCode, setSelectedQrCode] = useState<QrCode | null>(null);
  // URL for QR code creation (legacy flow - to be deprecated)
  const [urlForQrCode, setUrlForQrCode] = useState<Url | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Set sidebar active item on mount
  useEffect(() => {
    setActiveItemId("qrcodes");
  }, [setActiveItemId]);

  // Apply search filter with debounce
  useEffect(() => {
    // Only proceed with the search if searchTerm has actually changed
    const timeoutId = setTimeout(() => {
      // Store the current search value to compare against
      const currentSearchTerm = searchTerm.trim();

      console.log("Search effect running with:", {
        currentSearchTerm,
        isSearchActive,
      });

      if (currentSearchTerm !== "") {
        // Set active search flag when searching
        setIsSearchActive(true);
        updateFilter({ search: currentSearchTerm, page: 1 });
      } else if (isSearchActive) {
        // Only clear search and refresh when coming from an active search state
        setIsSearchActive(false);
        updateFilter({ search: undefined, page: 1 });
        // Force refresh to get all QR codes
        refreshQrCodes();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle page change
  const handlePageChange = (page: number) => {
    updateFilter({ page });
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle filter change
  const handleFilterChange = (newFilter: Partial<QrCodeFilter>) => {
    // Reset to page 1 when filter changes
    updateFilter({ ...newFilter, page: 1 });
  };

  // Handle sort change
  const handleSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    updateFilter({ sortBy, sortOrder });
  };

  // Handle view mode change
  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    // Adjust items per page based on view mode
    updateFilter({ limit: mode === "grid" ? 12 : 10, page: 1 });
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Handle create QR code button click - open the new modal
  const handleCreateQrCode = () => {
    setCreateQrCodeModalOpen(true);
  };

  // Handle QR code creation completion
  const handleQrCodeCreated = () => {
    refreshQrCodes();
    showToast("QR code created successfully", "success", 3000);
  };

  // Handle legacy QR code modal (to be deprecated)
  const handleCloseQrModal = () => {
    setQrModalOpen(false);
    setUrlForQrCode(null);
    setTimeout(() => {
      refreshQrCodes();
    }, 300);
  };

  // Handle preview QR code
  const handlePreviewQrCode = (qrCode: QrCode) => {
    setSelectedQrCode(qrCode);
    setPreviewModalOpen(true);
  };

  // Handle edit QR code
  const handleEditQrCode = (qrCode: QrCode) => {
    setSelectedQrCode(qrCode);
    setEditModalOpen(true);
  };

  // Handle QR code update success
  const handleQrCodeUpdated = () => {
    // Wait for the modal to close and refresh the QR codes
    setTimeout(() => {
      refreshQrCodes();
    }, 500);
  };

  // Handle delete QR code
  const handleDeleteQrCode = (qrCode: QrCode) => {
    setSelectedQrCode(qrCode);
    setDeleteModalOpen(true);
  };

  // Confirm QR code deletion
  const confirmDeleteQrCode = async (qrCode: QrCode) => {
    if (!qrCode) return;

    setIsDeletingQrCode(true);
    try {
      const success = await deleteQrCode(qrCode.id);
      if (success) {
        // Close modal
        setDeleteModalOpen(false);
        // Remove from selected QR codes if present
        setSelectedQrCodes((prev) =>
          prev.filter((code) => code.id !== qrCode.id)
        );

        // Wait for the modal to close and refresh the QR codes
        setTimeout(() => {
          refreshQrCodes();
        }, 500);
      }
    } catch (error) {
      console.error("Error deleting QR code:", error);
      showToast("Failed to delete QR code", "error", 5000);
    } finally {
      setIsDeletingQrCode(false);
      setSelectedQrCode(null);
    }
  };

  // Cancel QR code deletion
  const cancelDeleteQrCode = () => {
    setDeleteModalOpen(false);
    setSelectedQrCode(null);
  };

  // Handle QR code selection for bulk actions
  const handleSelectQrCode = (qrCode: QrCode, selected: boolean) => {
    if (selected) {
      setSelectedQrCodes((prev) => [...prev, qrCode]);
    } else {
      setSelectedQrCodes((prev) =>
        prev.filter((code) => code.id !== qrCode.id)
      );
    }
  };

  // Handle select all QR codes
  const handleSelectAllQrCodes = (selected: boolean) => {
    if (selected) {
      setSelectedQrCodes(qrCodes);
    } else {
      setSelectedQrCodes([]);
    }
  };

  // Handle bulk delete QR codes
  const handleBulkDeleteQrCodes = async () => {
    if (selectedQrCodes.length === 0) return;

    // Confirm before proceeding
    if (window.confirm(`Delete ${selectedQrCodes.length} selected QR codes?`)) {
      let successCount = 0;

      for (const qrCode of selectedQrCodes) {
        try {
          const success = await deleteQrCode(qrCode.id);
          if (success) successCount++;
        } catch (error) {
          console.error(`Error deleting QR code ${qrCode.id}:`, error);
        }
      }

      if (successCount > 0) {
        showToast(
          `${successCount} QR codes deleted successfully`,
          "success",
          3000
        );
        setSelectedQrCodes([]);
        refreshQrCodes();
      }
    }
  };

  // Handle download QR code
  const handleDownloadQrCode = (qrCode: QrCode, format: "png" | "svg") => {
    // This will be handled in the preview modal, but we can implement a direct download here
    if (qrCode.shortUrl) {
      // For demonstration, let's show a toast
      showToast(
        `Downloading QR code for ${qrCode.shortUrl} as ${format}`,
        "info",
        3000
      );
    }
  };

  return (
    <>
      <QrCodesTemplate
        qrCodes={qrCodes}
        isLoading={isLoading}
        pagination={pagination}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onPageChange={handlePageChange}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onSearch={handleSearch}
        searchTerm={searchTerm}
        onCreateQrCode={handleCreateQrCode}
        onPreviewQrCode={handlePreviewQrCode}
        onEditQrCode={handleEditQrCode}
        onDeleteQrCode={handleDeleteQrCode}
        selectedQrCodes={selectedQrCodes}
        onSelectQrCode={handleSelectQrCode}
        onSelectAllQrCodes={handleSelectAllQrCodes}
        onBulkDeleteQrCodes={handleBulkDeleteQrCodes}
        onDownloadQrCode={handleDownloadQrCode}
      />

      {/* New Create QR Code Modal with multi-step flow */}
      <CreateQrCodeModal
        isOpen={createQrCodeModalOpen}
        onClose={() => setCreateQrCodeModalOpen(false)}
        onCreated={handleQrCodeCreated}
        createUrl={async (data) => {
          try {
            const response = await createUrl({
              title: data.title,
              originalUrl: data.original_url,
              customCode: data.custom_code,
              expiryDate: data.expiry_date,
            });
            return response.data;
          } catch (error) {
            console.error("Error creating URL:", error);
            showToast("Failed to create URL. Please try again.", "error", 5000);
            throw error;
          }
        }}
        isCreatingUrl={isCreatingUrl}
      />

      {/* Legacy QR Code Modal - will be deprecated when new flow is fully integrated */}
      {qrModalOpen && urlForQrCode && (
        <QrCodeModal
          url={urlForQrCode}
          isOpen={qrModalOpen}
          onClose={handleCloseQrModal}
        />
      )}

      {/* Preview QR Code Modal */}
      {previewModalOpen && selectedQrCode && (
        <QrCodePreviewModal
          qrCode={selectedQrCode}
          isOpen={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
        />
      )}

      {/* Edit QR Code Modal */}
      {editModalOpen && selectedQrCode && (
        <QrCodeEditModal
          qrCode={selectedQrCode}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onUpdated={handleQrCodeUpdated}
        />
      )}

      {/* Delete QR Code Modal */}
      {deleteModalOpen && selectedQrCode && (
        <DeleteQrCodeModal
          qrCode={selectedQrCode}
          isOpen={deleteModalOpen}
          onConfirm={() => confirmDeleteQrCode(selectedQrCode)}
          onCancel={cancelDeleteQrCode}
          isDeleting={isDeletingQrCode}
        />
      )}
    </>
  );
}
