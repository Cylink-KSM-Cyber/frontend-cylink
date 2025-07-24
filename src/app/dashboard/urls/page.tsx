"use client";

import CreateUrlModal from "@/components/molecules/CreateUrlModal";
import DeleteUrlModal from "@/components/molecules/DeleteUrlModal";
import EditUrlModal from "@/components/molecules/EditUrlModal";
import QrCodeModal from "@/components/molecules/QrCodeModal";
import UrlTemplate from "@/components/templates/URLsTemplate";
import { useSidebar } from "@/contexts/SidebarContext";
import { useToast } from "@/contexts/ToastContext";
import { useCreateUrl } from "@/hooks/url/useCreateUrl";
import { useEditUrl } from "@/hooks/url/useEditUrl";
import { useDeleteUrl } from "@/hooks/useDeleteUrl";
import { useUrls } from "@/hooks/useUrls";
import { useUrlStats } from "@/hooks/useUrlStats";
import type { CreateUrlFormData, EditUrlFormData, Url } from "@/interfaces/url";
import "@/styles/dashboard.css";
import "@/styles/statsSummary.css";
import "@/styles/totalClicks.css";
import OnboardingTour from "@/components/molecules/OnboardingTour";
import { ONBOARDING_STEPS } from "@/onboarding/onboardingConfig";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatShortUrl } from "@/utils/urlFormatter";

/**
 * Dashboard page
 * @description The user dashboard page with URL management and analytics
 * @returns Dashboard page component
 */
export default function UrlsPage() {
  // Get sidebar context to sync with tab changes
  const { setActiveItemId } = useSidebar();

  // Get toast context for notifications
  const { showToast } = useToast();

  // Get tab from URL query params
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get("tab") ?? null;

  // Initialize search state
  const [searchQuery, setSearchQuery] = useState("");

  // Delete URL modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState<Url | null>(null);

  // Create URL modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Edit URL modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [urlToEdit, setUrlToEdit] = useState<Url | null>(null);

  // QR Code modal state
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [urlForQrCode, setUrlForQrCode] = useState<Url | null>(null);

  const [urlFilters, setUrlFilters] = useState({
    status: "all" as "all" | "active" | "expired" | "inactive",
    limit: 10 as number,
  });

  // Initialize URL sort state
  const [urlSort, setUrlSort] = useState({
    sortBy: "created_at" as "created_at" | "clicks" | "title" | "expiry_date",
    sortOrder: "desc" as "asc" | "desc",
  });

  // Fetch dashboard stats data
  const { stats, isLoading: isStatsLoading } = useUrlStats();

  // Fetch URL data with filter
  const {
    urls,
    isLoading: isUrlsLoading,
    pagination,
    updateFilter,
    refreshUrls,
  } = useUrls({
    page: 1,
    limit: urlFilters.limit,
    search: searchQuery,
    sortBy: urlSort.sortBy,
    sortOrder: urlSort.sortOrder,
    status: urlFilters.status !== "all" ? urlFilters.status : undefined,
  });

  const { createUrl, isCreating } = useCreateUrl();

  const { editUrl, isEditing } = useEditUrl();

  // URL deletion hook
  const { deleteUrl, isDeleting } = useDeleteUrl();

  // Handle search query changes
  const handleSearch = (value: string) => {
    setSearchQuery(value);

    if (value) {
      updateFilter({ search: value });
    } else {
      updateFilter({ search: "" });
    }
  };

  // Add handler for filter changes
  const handleFilterChange = (filterType: string, value: string | number) => {
    setUrlFilters((prev) => ({ ...prev, [filterType]: value }));

    if (filterType === "status") {
      updateFilter({
        status:
          value !== "all"
            ? (value as "active" | "expired" | "inactive")
            : undefined,
      });
    } else if (filterType === "limit") {
      updateFilter({ limit: value as number });
    }
    // Add more conditions for other filter types as needed
  };

  // Handle URL page changes
  const handleUrlPageChange = (page: number) => {
    updateFilter({ page });
  };

  // Handle URL sort changes
  const handleUrlSortChange = (column: string, direction: "asc" | "desc") => {
    const sortBy = column as "created_at" | "clicks" | "title" | "expiry_date";

    setUrlSort({ sortBy, sortOrder: direction });
    updateFilter({ sortBy, sortOrder: direction });
  };

  // Handle URL copy
  const handleCopyUrl = (url: Url) => {
    const fullUrl = formatShortUrl(url.short_url);
    navigator.clipboard.writeText(fullUrl);
    showToast(`URL "${url.short_url}" copied to clipboard`, "success", 2000);
  };

  /**
   * Opens the edit modal with the selected URL data
   * @param {Url} url - The URL object to edit
   */
  const handleEditUrl = (url: Url) => {
    setUrlToEdit(url);
    setEditModalOpen(true);
  };

  // Open delete confirmation modal
  const handleDeleteUrl = (url: Url) => {
    setUrlToDelete(url);
    setDeleteModalOpen(true);
  };

  // Confirm URL deletion
  const confirmDeleteUrl = async (url: Url) => {
    const success = await deleteUrl(url.id, url);

    if (success) {
      // Close modal
      setDeleteModalOpen(false);
      setUrlToDelete(null);

      // Wait 1.3 seconds as requested before refreshing
      setTimeout(() => {
        refreshUrls();
      }, 1300);
    }
  };

  // Cancel URL deletion
  const cancelDeleteUrl = () => {
    setDeleteModalOpen(false);
    setUrlToDelete(null);
  };

  const closeCreateUrl = () => {
    setCreateModalOpen(false);
  };

  /**
   * Closes the edit URL modal with a short delay before cleaning up state
   */
  const closeEditUrl = () => {
    setEditModalOpen(false);
    setTimeout(() => {
      setUrlToEdit(null);
    }, 300);
  };

  // Handle QR code generation
  const handleGenerateQr = (url: Url) => {
    setUrlForQrCode(url);
    setQrModalOpen(true);
  };

  // Close QR code modal
  const handleCloseQrModal = () => {
    setQrModalOpen(false);
    // Wait for modal close animation to finish
    setTimeout(() => {
      setUrlForQrCode(null);
    }, 300);
  };

  // Handle create new URL
  const handleCreateUrl = () => {
    // This would typically open a modal or navigate to a create page
    setCreateModalOpen(true);
  };

  // Add a new function to handle the actual form submission
  const handleSubmitUrlForm = async (data: CreateUrlFormData) => {
    try {
      const response = await createUrl(data); // Call the hook's function

      showToast(
        `URL "${response.data.title}" created successfully`,
        "success",
        2000
      );
      setCreateModalOpen(false);
      refreshUrls();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Something went wrong",
        "error",
        3000
      );
    } finally {
      setCreateModalOpen(false);
    }
  };

  /**
   * Handles the form submission for editing a URL
   * @param {EditUrlFormData} data - The form data with updated URL information
   */
  const handleSubmitEditUrlForm = async (data: EditUrlFormData) => {
    try {
      const response = await editUrl(urlToEdit?.id as number, data);

      showToast(
        `URL "${response.data.title}" updated successfully`,
        "success",
        2000
      );
      setEditModalOpen(false);
      refreshUrls();
    } catch (err) {
      showToast(
        err instanceof Error
          ? err.message
          : "Something went wrong updating the URL",
        "error",
        3000
      );
    } finally {
      setEditModalOpen(false);
    }
  };

  // Set initial active tab based on URL params
  useEffect(() => {
    if (tabParam) {
      setActiveItemId(tabParam);
    } else {
      setActiveItemId("dashboard");
    }
  }, [tabParam, setActiveItemId]);

  // Pass seluruh step global ke OnboardingTour
  const onboardingSteps = ONBOARDING_STEPS.map((s) => ({
    element: s.element,
    popover: {
      title: s.title,
      description: s.description,
      position: s.position || "auto",
    },
  }));
  const totalSteps = ONBOARDING_STEPS.length;
  // Cari startStep dari query param onboardingStep (default: 4 untuk step 5)
  const onboardingStepParam = searchParams?.get("onboardingStep");
  const startStep = onboardingStepParam
    ? parseInt(onboardingStepParam, 10) - 1
    : 4;
  const [showOnboarding, setShowOnboarding] = useState<boolean>(
    !!onboardingStepParam
  );

  // OnboardingTour close handler: remove onboardingStep from URL
  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("onboardingStep");
      window.history.replaceState(
        {},
        document.title,
        url.pathname + url.search
      );
    }
  };

  // Default stats if none are available
  const urlStats = stats || {
    totalUrls: 0,
    totalClicks: 0,
    conversionRate: 0,
    qrCodesGenerated: 0,
    activeUrls: 0,
    urlsCreatedToday: 0,
    averageClicksPerUrl: 0,
    totalClicksData: undefined,
  };

  return (
    <>
      <UrlTemplate
        stats={urlStats}
        urls={urls ?? []}
        isUrlsLoading={isUrlsLoading}
        isStatsLoading={isStatsLoading}
        currentUrlPage={pagination?.page ?? 1}
        totalUrlPages={pagination?.total_pages ?? 1}
        onUrlPageChange={handleUrlPageChange}
        onUrlSortChange={handleUrlSortChange}
        urlSortBy={urlSort.sortBy}
        urlSortDirection={urlSort.sortOrder}
        onSearch={handleSearch}
        onCreateUrl={handleCreateUrl}
        onCopyUrl={handleCopyUrl}
        onGenerateQr={handleGenerateQr}
        onEditUrl={handleEditUrl}
        onDeleteUrl={handleDeleteUrl}
        urlFilters={urlFilters}
        onUrlFilterChange={handleFilterChange}
      />
      {/* OnboardingTour for URLs page */}
      <OnboardingTour
        steps={onboardingSteps}
        show={showOnboarding}
        onClose={handleOnboardingClose}
        startStep={startStep}
        options={{
          showProgress: true,
          progressText: "Step {{current}} of " + totalSteps,
        }}
      />
      {/* Create URL Modal */}
      <CreateUrlModal
        isOpen={createModalOpen}
        onClose={closeCreateUrl}
        onSubmit={handleSubmitUrlForm}
        isCreating={isCreating}
      />

      {/* Delete URL Modal */}
      <DeleteUrlModal
        url={urlToDelete}
        isOpen={deleteModalOpen}
        onConfirm={confirmDeleteUrl}
        onCancel={cancelDeleteUrl}
        isDeleting={isDeleting}
      />

      {/* Edit URL Modal */}
      <EditUrlModal
        url={urlToEdit}
        isOpen={editModalOpen}
        onClose={closeEditUrl}
        onSubmit={handleSubmitEditUrlForm}
        isEditing={isEditing}
      />

      {/* QR Code Modal */}
      <QrCodeModal
        url={urlForQrCode}
        isOpen={qrModalOpen}
        onClose={handleCloseQrModal}
      />
    </>
  );
}
