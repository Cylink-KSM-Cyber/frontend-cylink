"use client";

import React from "react";
import { Url } from "@/interfaces/url";
import { QrCodeCreator } from "@/components/molecules/qr-code-creator";

/**
 * CreateQrCodeModal props
 * @interface CreateQrCodeModalProps
 */
interface CreateQrCodeModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Function to call when modal is closed */
  onClose: () => void;
  /** Function to call when QR code is created */
  onCreated: () => void;
  /** Function to create a new URL and return it */
  createUrl: (data: {
    title: string;
    original_url: string;
    custom_code?: string;
    expiry_date: string;
  }) => Promise<Url>;
  /** Whether URL creation is in progress */
  isCreatingUrl?: boolean;
}

/**
 * CreateQrCodeModal Component
 * @description Modal for creating new QR codes with URL selection/creation and customization options
 */
const CreateQrCodeModal: React.FC<CreateQrCodeModalProps> = (props) => {
  return <QrCodeCreator {...props} />;
};

export default CreateQrCodeModal;
