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
  shortCode: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^[a-zA-Z0-9-]+$/.test(value),
      "Short code must contain only letters, numbers, and hyphens"
    )
    .refine(
      (value) => !value || value.length <= 50,
      "Short code must be 50 characters or less"
    ),
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
      shortCode: "",
      expiryDate: "",
    },
  });

  React.useEffect(() => {
    if (url) {
      reset({
        title: url.title,
        originalUrl: url.original_url,
        shortCode: url.short_code,
        expiryDate: url.expiry_date,
      });
    }
  }, [url, reset]);

  const [hasChanges, setHasChanges] = useState(false);

  const currentValues = watch();

  console.log("url from modal", url);

  React.useEffect(() => {
    const hasValueChanged =
      currentValues.title !== url?.title ||
      currentValues.originalUrl !== url?.original_url ||
      currentValues.shortCode !== url?.short_code ||
      currentValues.expiryDate !== url?.expiry_date;

    setHasChanges(hasValueChanged);
  }, [
    currentValues.title,
    currentValues.originalUrl,
    currentValues.shortCode,
    currentValues.expiryDate,
    url?.title,
    url?.original_url,
    url?.short_code,
    url?.expiry_date,
  ]);

  const handleCloseDialog = () => {
    reset();
    setHasChanges(false);
  };

  const handleFormSubmit = (data: EditUrlFormSchema) => {
    onSubmit(data);
    reset();
  };

  const handleCancel = () => {
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
              htmlFor="shortCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Custom Back-half
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                cylink.co/
              </span>
              <input
                type="text"
                id="shortCode"
                placeholder="custom-url"
                {...register("shortCode")}
                className="flex-1 p-2 border border-gray-300 rounded-r-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <p className="mt-1 text-xs text-gray-600">
              Use letters, numbers, and hyphens for your custom URL
            </p>
            {errors.shortCode && (
              <p className="mt-1 text-sm text-red-600">
                {errors.shortCode.message}
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
