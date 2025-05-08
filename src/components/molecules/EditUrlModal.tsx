"use client";

import Button from "@/components/atoms/Button";
import Modal from "@/components/atoms/Modal";
import { EditUrlFormData, Url } from "@/interfaces/url";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { RiEditLine, RiLinkM } from "react-icons/ri";
import { z } from "zod";

/**
 * EditUrlModalProps interface
 * @interface EditUrlModalProps
 */
interface EditUrlModalProps {
  url: Url | null;
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Function to call when creation is canceled */
  onClose: () => void;
  /** Function to call when form is submitted */
  onSubmit: (data: EditUrlFormData) => void;
  /** Whether creation is in progress */
  isEditing?: boolean;
}

// Zod schema for form validation
const EditUrlSchema = z.object({
  title: z.string().min(1, "Title is required"),
  originalUrl: z.string().url("Please enter a valid URL"),
  customCode: z.string().optional(),
  expiryDate: z.string().min(1, "Expiry date is required"),
});

type EditUrlFormSchema = z.infer<typeof EditUrlSchema>;

/**
 * EditUrlModal Component
 * @description Modal for creating a new URL with form validation
 */
const EditUrlModal: React.FC<EditUrlModalProps> = ({
  url,
  isOpen,
  isEditing,
  onClose,
  onSubmit,
}) => {
  console.log("[DEBUG] EditUrlModal - Received props:", {
    url: url ? { id: url.id, title: url.title } : null,
    isOpen,
    isEditing,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<EditUrlFormSchema>({
    resolver: zodResolver(EditUrlSchema),
    defaultValues: {
      title: "",
      originalUrl: "",
      customCode: "",
      expiryDate: "",
    },
  });

  // Function to format ISO date string to yyyy-MM-dd for date input
  const formatDateForInput = (
    dateString: string | undefined | null
  ): string => {
    // Return empty string if date is null or undefined
    if (!dateString) return "";

    console.log("[DEBUG] formatDateForInput - Input date string:", dateString);

    try {
      // Parse the ISO date string
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.log("[DEBUG] Invalid date format:", dateString);
        return "";
      }

      // Format as YYYY-MM-DD for date input
      const formattedDate = date.toISOString().split("T")[0];
      console.log(
        "[DEBUG] formatDateForInput - Formatted date:",
        formattedDate
      );
      return formattedDate;
    } catch (error) {
      console.error("[DEBUG] Error formatting date:", error);
      return "";
    }
  };

  // Effect untuk mengisi form ketika URL berubah atau modal dibuka
  React.useEffect(() => {
    console.log(
      "[DEBUG] EditUrlModal - useEffect triggered with url:",
      url
        ? JSON.stringify(
            {
              id: url?.id,
              title: url?.title,
              original_url: url?.original_url,
              short_code: url?.short_code,
              expiry_date: url?.expiry_date,
            },
            null,
            2
          )
        : "null"
    );
    console.log("[DEBUG] EditUrlModal - isOpen:", isOpen);

    if (url && isOpen) {
      console.log("[DEBUG] EditUrlModal - Resetting form with url data");

      // Format expiry date correctly for date input
      const formattedExpiryDate = formatDateForInput(url.expiry_date);
      console.log(
        "[DEBUG] EditUrlModal - Formatted expiry date:",
        formattedExpiryDate
      );

      // Memastikan semua properti yang dibutuhkan ada sebelum mengisi form
      const formData = {
        title: url.title || "",
        originalUrl: url.original_url || "",
        customCode: url.short_code || "", // Use short_code instead of customDomain
        expiryDate: formattedExpiryDate,
      };

      console.log("[DEBUG] EditUrlModal - Form data to be set:", formData);

      // Reset form dengan data URL
      reset(formData);

      console.log("[DEBUG] EditUrlModal - Form has been reset with URL data");
    }
  }, [url, isOpen, reset]);

  // Effect untuk mengisi form ketika modal dibuka
  React.useEffect(() => {
    console.log(
      "[DEBUG] EditUrlModal - useEffect triggered with isOpen:",
      isOpen
    );

    // Ketika modal dibuka, lakukan pengisian form secara langsung
    if (isOpen && url) {
      console.log(
        "[DEBUG] EditUrlModal - Modal opened with URL data:",
        url.id,
        url.title
      );
      console.log(
        "[DEBUG] EditUrlModal - Full URL data:",
        JSON.stringify(
          {
            id: url.id,
            title: url.title,
            original_url: url.original_url,
            short_code: url.short_code,
            expiry_date: url.expiry_date,
          },
          null,
          2
        )
      );

      // Tunggu sedikit untuk memastikan modal sudah sepenuhnya terbuka
      setTimeout(() => {
        console.log(
          "[DEBUG] EditUrlModal - Setting form values after small delay"
        );

        // Format expiry date correctly for date input
        const formattedExpiryDate = formatDateForInput(url.expiry_date);

        reset({
          title: url.title || "",
          originalUrl: url.original_url || "",
          customCode: url.short_code || "", // Use short_code instead of customDomain
          expiryDate: formattedExpiryDate,
        });
      }, 100);
    }
  }, [isOpen, url, reset]);

  // Reset form ketika modal ditutup
  React.useEffect(() => {
    if (!isOpen) {
      console.log("[DEBUG] EditUrlModal - Modal closed, reset form");
      reset({
        title: "",
        originalUrl: "",
        customCode: "",
        expiryDate: "",
      });
    }
  }, [isOpen, reset]);

  const [hasChanges, setHasChanges] = useState(false);

  const currentValues = watch();

  console.log("[DEBUG] EditUrlModal - Current form values:", currentValues);

  React.useEffect(() => {
    // For proper comparison, format the URL's expiry date the same way as the form's expiryDate
    const formattedUrlExpiryDate = url?.expiry_date
      ? formatDateForInput(url.expiry_date)
      : "";

    const hasValueChanged =
      currentValues.title !== url?.title ||
      currentValues.originalUrl !== url?.original_url ||
      currentValues.customCode !== url?.short_code ||
      currentValues.expiryDate !== formattedUrlExpiryDate;

    console.log("[DEBUG] EditUrlModal - Change detection:", {
      formValues: currentValues,
      urlValues: {
        title: url?.title,
        originalUrl: url?.original_url,
        customCode: url?.short_code,
        expiryDate: formattedUrlExpiryDate,
      },
      hasValueChanged,
    });

    setHasChanges(hasValueChanged);
  }, [
    currentValues.title,
    currentValues.originalUrl,
    currentValues.customCode,
    currentValues.expiryDate,
    url?.title,
    url?.original_url,
    url?.short_code,
    url?.expiry_date,
  ]);

  const handleCloseDialog = () => {
    console.log("[DEBUG] EditUrlModal - Closing dialog and resetting form");
    reset({
      title: "",
      originalUrl: "",
      customCode: "",
      expiryDate: "",
    });
    setHasChanges(false);
  };

  const handleFormSubmit = (data: EditUrlFormSchema) => {
    console.log(
      "[DEBUG] EditUrlModal - Form submitted with data:",
      JSON.stringify(data, null, 2)
    );

    // Format the URL's expiry date for proper comparison
    const formattedUrlExpiryDate = url?.expiry_date
      ? formatDateForInput(url.expiry_date)
      : "";

    console.log(
      "[DEBUG] EditUrlModal - Comparing with original url data:",
      url
        ? JSON.stringify(
            {
              title: url.title,
              originalUrl: url.original_url,
              customCode: url.short_code,
              expiryDate: formattedUrlExpiryDate,
            },
            null,
            2
          )
        : "null"
    );

    onSubmit(data);
    reset();
  };

  const handleCancel = () => {
    console.log(
      "[DEBUG] EditUrlModal - Cancel button clicked, hasChanges:",
      hasChanges
    );
    if (hasChanges) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to close this dialog?"
        )
      ) {
        handleCloseDialog();
      }
    } else {
      handleCloseDialog();
    }
    onClose();
  };

  return (
    <Modal
      title="Edit New URL"
      isOpen={isOpen}
      onClose={handleCancel}
      variant="default"
      size="md"
      overlayStyle="glassmorphism"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={isEditing}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isEditing}
            loading={isEditing}
            startIcon={<RiEditLine />}
          >
            {isEditing ? "Editing..." : "Edit URL"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col py-2">
        <div className="mb-4 flex flex-col items-center gap-4 justify-center">
          <div className="rounded-full bg-blue-100 p-3 text-blue-600">
            <RiLinkM className="h-6 w-6" />
          </div>
          <h4 className="mb-2 mx-10 text-center text-lg font-medium text-gray-900">
            Edit your URL here!
          </h4>
        </div>

        <form className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter a memorable title"
              {...register("title")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="originalUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Original URL
            </label>
            <input
              type="url"
              id="originalUrl"
              placeholder="https://"
              {...register("originalUrl")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.originalUrl && (
              <p className="mt-1 text-sm text-red-600">
                {errors.originalUrl.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="customCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Custom Back-half (Optional)
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                cylink.co/
              </span>
              <input
                type="text"
                id="customCode"
                placeholder="custom-url"
                {...register("customCode")}
                className="flex-1 p-2 border border-gray-300 rounded-r-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {errors.customCode && (
              <p className="mt-1 text-sm text-red-600">
                {errors.customCode.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="expiryDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Expiry Date
            </label>
            <input
              type="date"
              id="expiryDate"
              {...register("expiryDate")}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.expiryDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.expiryDate.message}
              </p>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditUrlModal;
