"use client";

import React, { useState, useEffect } from "react";
import { useQrCodes } from "@/hooks/useQrCodes";
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
import { useQrCodeModals } from "@/hooks/useQrCodeModals";
import { useQrCodeSearch } from "@/hooks/useQrCodeSearch";
import { useQrCodeSelection } from "@/hooks/useQrCodeSelection";
import { useQrCodeFilter } from "@/hooks/useQrCodeFilter";
import { useQrCodeBulkActions } from "@/hooks/useQrCodeBulkActions";
import { useQrCodeActions } from "@/hooks/useQrCodeActions";
import "@/styles/qrcodesPage.css";
import { ONBOARDING_STEPS } from "@/config/onboardingConfig";
import OnboardingTour from "@/components/molecules/OnboardingTour";

/**
 * QrCodesPage Component
 *
 * @description Dedicated page for QR codes management with comprehensive features
 * @returns QR codes management page component
 */
export default function QrCodesPage() {
  // Set sidebar active item
  const { setActiveItemId } = useSidebar();
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

  // Modal states and handlers
  const [modalState, modalActions] = useQrCodeModals();

  // Search functionality
  const { searchTerm, handleSearch } = useQrCodeSearch(
    updateFilter,
    refreshQrCodes
  );

  // QR code selection
  const {
    selectedQrCodes,
    handleSelectQrCode,
    handleSelectAllQrCodes,
    clearSelection,
    removeFromSelection,
  } = useQrCodeSelection(qrCodes);

  // Filter and pagination handlers
  const {
    handlePageChange,
    handleFilterChange,
    handleSortChange,
    handleViewModeChange,
  } = useQrCodeFilter(updateFilter);

  // Bulk actions
  const { handleBulkDeleteQrCodes, handleDownloadQrCode } =
    useQrCodeBulkActions(deleteQrCode, refreshQrCodes, clearSelection);

  // Individual QR code actions
  const {
    isDeletingQrCode,
    confirmDeleteQrCode,
    handleQrCodeUpdated,
    handleQrCodeCreated,
  } = useQrCodeActions(deleteQrCode, refreshQrCodes, removeFromSelection);

  // Set sidebar active item on mount
  useEffect(() => {
    setActiveItemId("qrcodes");
  }, [setActiveItemId]);

  // Onboarding integration
  const onboardingSteps = ONBOARDING_STEPS.map((s) => ({
    element: s.element,
    popover: {
      title: s.title,
      description: s.description,
      position: s.position || "auto",
    },
  }));
  const totalSteps = ONBOARDING_STEPS.length;

  // State for onboarding step param and start step
  const [startStep, setStartStep] = useState<number>(11);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  // Hydration-safe: get onboardingStepParam and startStep from window.location in useEffect
  useEffect(() => {
    if (typeof window !== "undefined") {
      const param = new URLSearchParams(window.location.search).get(
        "onboardingStep"
      );
      setStartStep(param ? parseInt(param, 10) - 1 : 11);
      setShowOnboarding(!!param);
    }
  }, []);

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

  // When view mode changes, update the view mode state
  const onViewModeChange = (mode: "grid" | "list") => {
    setViewMode(handleViewModeChange(mode));
  };

  return (
    <>
      <QrCodesTemplate
        qrCodes={qrCodes}
        isLoading={isLoading}
        pagination={pagination}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        onPageChange={handlePageChange}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onSearch={handleSearch}
        searchTerm={searchTerm}
        onCreateQrCode={modalActions.openCreateModal}
        onPreviewQrCode={modalActions.openPreviewModal}
        onEditQrCode={modalActions.openEditModal}
        onDeleteQrCode={modalActions.openDeleteModal}
        selectedQrCodes={selectedQrCodes}
        onSelectQrCode={handleSelectQrCode}
        onSelectAllQrCodes={handleSelectAllQrCodes}
        onBulkDeleteQrCodes={() => handleBulkDeleteQrCodes(selectedQrCodes)}
        onDownloadQrCode={handleDownloadQrCode}
      />

      {/* New Create QR Code Modal with multi-step flow */}
      <CreateQrCodeModal
        isOpen={modalState.createModalOpen}
        onClose={modalActions.closeCreateModal}
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
      {modalState.legacyModalOpen && modalState.urlForQrCode && (
        <QrCodeModal
          url={modalState.urlForQrCode}
          isOpen={modalState.legacyModalOpen}
          onClose={modalActions.closeLegacyModal}
        />
      )}

      {/* Preview QR Code Modal */}
      {modalState.previewModalOpen && modalState.selectedQrCode && (
        <QrCodePreviewModal
          qrCode={modalState.selectedQrCode}
          isOpen={modalState.previewModalOpen}
          onClose={modalActions.closePreviewModal}
        />
      )}

      {/* Edit QR Code Modal */}
      {modalState.editModalOpen && modalState.selectedQrCode && (
        <QrCodeEditModal
          qrCode={modalState.selectedQrCode}
          isOpen={modalState.editModalOpen}
          onClose={modalActions.closeEditModal}
          onUpdated={handleQrCodeUpdated}
        />
      )}

      {/* Delete QR Code Modal */}
      {modalState.deleteModalOpen && modalState.selectedQrCode && (
        <DeleteQrCodeModal
          qrCode={modalState.selectedQrCode}
          isOpen={modalState.deleteModalOpen}
          onConfirm={() => {
            confirmDeleteQrCode(modalState.selectedQrCode!).then((success) => {
              if (success) {
                modalActions.closeDeleteModal();
              }
            });
          }}
          onCancel={modalActions.closeDeleteModal}
          isDeleting={isDeletingQrCode}
        />
      )}

      {/* Onboarding Tour */}
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
    </>
  );
}
