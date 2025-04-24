"use client";

import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import { RiAddLine, RiLinkM } from "react-icons/ri";

/**
 * CreateUrlModalProps interface
 * @interface CreateUrlModalProps
 */
interface CreateUrlModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Function to call when creation is canceled */
  onClose: () => void;
  /** Function to call when form is submitted */
  onSubmit: (data: CreateUrlFormData) => void;
  /** Whether creation is in progress */
  isCreating?: boolean;
}

/**
 * Form data structure
 * @interface CreateUrlFormData
 */
export interface CreateUrlFormData {
  title: string;
  originalUrl: string;
  customCode?: string;
  expiryDate: string;
}

// Zod schema for form validation
const createUrlSchema = z.object({
  title: z.string().min(1, "Title is required"),
  originalUrl: z.string().url("Please enter a valid URL"),
  customCode: z.string().optional(),
  expiryDate: z.string().min(1, "Expiry date is required"),
});

type CreateUrlFormSchema = z.infer<typeof createUrlSchema>;

/**
 * CreateUrlModal Component
 * @description Modal for creating a new URL with form validation
 */
const CreateUrlModal: React.FC<CreateUrlModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isCreating = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUrlFormSchema>({
    resolver: zodResolver(createUrlSchema),
    defaultValues: {
      title: "",
      originalUrl: "",
      customCode: "",
      expiryDate: "",
    },
  });

  const handleFormSubmit = (data: CreateUrlFormSchema) => {
    onSubmit(data);
    reset();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      title="Create New URL"
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
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isCreating}
            loading={isCreating}
            startIcon={<RiAddLine />}
          >
            {isCreating ? "Creating..." : "Create URL"}
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
            Easily shorten and personalize your links!
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

export default CreateUrlModal;
