"use client";

import { useState } from "react";
import { QrCode, Url } from "@/interfaces/url";
import { useConversionTracking } from "@/hooks/useConversionTracking";

/**
 * Modal states and handlers for QR codes
 * @interface QrCodeModalsState
 */
interface QrCodeModalsState {
  /** Selected QR code for operations */
  selectedQrCode: QrCode | null;
  /** URL for QR code creation (legacy flow) */
  urlForQrCode: Url | null;
  /** Create QR code modal state */
  createModalOpen: boolean;
  /** Edit modal state */
  editModalOpen: boolean;
  /** Preview modal state */
  previewModalOpen: boolean;
  /** Delete modal state */
  deleteModalOpen: boolean;
  /** Is deleting QR code state */
  isDeleting: boolean;
  /** Legacy QR modal state */
  legacyModalOpen: boolean;
}

/**
 * Modal actions and handlers for QR codes
 * @interface QrCodeModalsActions
 */
interface QrCodeModalsActions {
  /** Set selected QR code for operations */
  setSelectedQrCode: (qrCode: QrCode | null) => void;
  /** Open create QR code modal */
  openCreateModal: () => void;
  /** Close create QR code modal */
  closeCreateModal: () => void;
  /** Open edit QR code modal with the given QR code */
  openEditModal: (qrCode: QrCode) => void;
  /** Close edit QR code modal */
  closeEditModal: () => void;
  /** Open preview QR code modal with the given QR code */
  openPreviewModal: (qrCode: QrCode) => void;
  /** Close preview QR code modal */
  closePreviewModal: () => void;
  /** Open delete QR code modal with the given QR code */
  openDeleteModal: (qrCode: QrCode) => void;
  /** Close delete QR code modal */
  closeDeleteModal: () => void;
  /** Set is deleting QR code state */
  setIsDeleting: (isDeleting: boolean) => void;
  /** Open legacy QR code modal with the given URL */
  openLegacyModal: (url: Url) => void;
  /** Close legacy QR code modal */
  closeLegacyModal: () => void;
}

/**
 * Custom hook for managing QR code modal states and handlers
 * @returns Object containing modal states and handlers
 */
export const useQrCodeModals = (): [QrCodeModalsState, QrCodeModalsActions] => {
  const { trackQrCodePreviewEvent } = useConversionTracking();

  // Selected QR code for operations
  const [selectedQrCode, setSelectedQrCode] = useState<QrCode | null>(null);

  // URL for QR code creation (legacy flow)
  const [urlForQrCode, setUrlForQrCode] = useState<Url | null>(null);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [legacyModalOpen, setLegacyModalOpen] = useState(false);

  // Modal handlers
  const openCreateModal = () => setCreateModalOpen(true);
  const closeCreateModal = () => setCreateModalOpen(false);

  const openEditModal = (qrCode: QrCode) => {
    setSelectedQrCode(qrCode);
    setEditModalOpen(true);
  };
  const closeEditModal = () => setEditModalOpen(false);

  const openPreviewModal = (qrCode: QrCode) => {
    setSelectedQrCode(qrCode);
    setPreviewModalOpen(true);

    // Track preview interaction when modal is opened via shared helper
    // Source remains context-specific: list view
    trackQrCodePreviewEvent({
      qrCode,
      interactionType: "open_preview",
      previewSource: "list_view",
    });
  };
  const closePreviewModal = () => setPreviewModalOpen(false);

  const openDeleteModal = (qrCode: QrCode) => {
    setSelectedQrCode(qrCode);
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedQrCode(null);
  };

  const openLegacyModal = (url: Url) => {
    setUrlForQrCode(url);
    setLegacyModalOpen(true);
  };
  const closeLegacyModal = () => {
    setLegacyModalOpen(false);
    setUrlForQrCode(null);
  };

  return [
    {
      selectedQrCode,
      urlForQrCode,
      createModalOpen,
      editModalOpen,
      previewModalOpen,
      deleteModalOpen,
      isDeleting,
      legacyModalOpen,
    },
    {
      setSelectedQrCode,
      openCreateModal,
      closeCreateModal,
      openEditModal,
      closeEditModal,
      openPreviewModal,
      closePreviewModal,
      openDeleteModal,
      closeDeleteModal,
      setIsDeleting,
      openLegacyModal,
      closeLegacyModal,
    },
  ];
};
