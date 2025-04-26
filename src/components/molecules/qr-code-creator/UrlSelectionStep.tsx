"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { QrCodeCreateFormSchema } from "@/hooks/useQrCodeCreation";
import { Url } from "@/interfaces/url";

/**
 * Props for URL Selection Step component
 */
interface UrlSelectionStepProps {
  /**
   * Form instance from react-hook-form
   */
  form: UseFormReturn<QrCodeCreateFormSchema>;
  /**
   * List of existing URLs
   */
  existingUrls: Url[];
  /**
   * Whether URLs are currently being loaded
   */
  isLoadingUrls: boolean;
}

/**
 * URL Selection Step Component for QR Code Creation
 *
 * @description First step in QR code creation process that allows selecting an existing URL or creating a new one
 */
const UrlSelectionStep: React.FC<UrlSelectionStepProps> = ({
  form,
  existingUrls,
  isLoadingUrls,
}) => {
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const urlSource = watch("urlSource");

  return (
    <div className="space-y-4">
      {/* URL Selection Method */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select URL Source
        </label>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="existing"
              {...register("urlSource")}
              className="mr-2"
            />
            <span>Use Existing URL</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="new"
              {...register("urlSource")}
              className="mr-2"
            />
            <span>Create New URL</span>
          </label>
        </div>
      </div>

      {/* Existing URL Selection */}
      {urlSource === "existing" && (
        <div className="mb-4">
          <label
            htmlFor="existingUrlId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select URL <span className="text-red-500">*</span>
          </label>
          <select
            id="existingUrlId"
            {...register("existingUrlId", {
              valueAsNumber: true,
              required: urlSource === "existing",
            })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoadingUrls}
          >
            <option value="">Select a URL</option>
            {existingUrls.map((url) => (
              <option key={url.id} value={url.id}>
                {url.title} ({url.short_url})
              </option>
            ))}
          </select>
          {errors.existingUrlId && (
            <p className="mt-1 text-sm text-red-600">Please select a URL</p>
          )}
          {isLoadingUrls && (
            <p className="mt-1 text-sm text-gray-500">Loading URLs...</p>
          )}
        </div>
      )}

      {/* New URL Creation Form */}
      {urlSource === "new" && (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title <span className="text-red-500">*</span>
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
              Original URL <span className="text-red-500">*</span>
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
              Expiry Date <span className="text-red-500">*</span>
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
        </div>
      )}
    </div>
  );
};

export default UrlSelectionStep;
