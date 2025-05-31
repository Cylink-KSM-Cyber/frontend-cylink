"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Link from "next/link";
import useForgotPassword from "@/hooks/useForgotPassword";
import EmailSentModal from "@/components/molecules/EmailSentModal";
import { FiMail, FiArrowLeft } from "react-icons/fi";

/**
 * Forgot password form schema validation
 */
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
});

/**
 * Forgot password form values type
 */
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

/**
 * Forgot password form properties
 * @interface ForgotPasswordFormProps
 */
interface ForgotPasswordFormProps {
  /** Custom CSS class */
  className?: string;
}

/**
 * Forgot password form component
 * @description Form for requesting password reset with validation and modal success display
 * @param props - Forgot password form properties
 * @returns Forgot password form component
 */
const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  className = "",
}) => {
  const {
    isLoading,
    isSuccess,
    error,
    responseMessage,
    requestPasswordReset,
    resetState,
  } = useForgotPassword();

  // Form validation with react-hook-form and zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  /**
   * Form submission handler
   * @param data - Form values
   */
  const onSubmit = async (data: ForgotPasswordFormValues) => {
    await requestPasswordReset(data.email);
  };

  /**
   * Handle modal close
   */
  const handleModalClose = () => {
    resetState();
    reset();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full ${className}`}
      >
        {/* Form description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <p className="text-gray-600 leading-relaxed">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </motion.div>

        {/* Error message display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-600 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Forgot password form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Input
              label="Email address"
              type="email"
              fullWidth
              error={errors.email?.message}
              autoComplete="email"
              startIcon={<FiMail className="w-5 h-5" />}
              {...register("email")}
            />
          </motion.div>

          {/* Submit button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              type="submit"
              fullWidth
              disabled={isLoading}
              loading={isLoading}
              className="mb-4"
            >
              Send reset link
            </Button>
          </motion.div>

          {/* Back to login link */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Link
              href="/login"
              className="inline-flex items-center text-sm font-medium text-black hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to sign in
            </Link>
          </motion.div>
        </form>
      </motion.div>

      {/* Email Sent Modal */}
      <EmailSentModal
        isOpen={isSuccess}
        onClose={handleModalClose}
        message={responseMessage}
      />
    </>
  );
};

export default ForgotPasswordForm;
