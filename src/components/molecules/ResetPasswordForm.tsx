"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import PasswordStrengthIndicator from "@/components/atoms/PasswordStrengthIndicator";
import PasswordRequirements from "@/components/atoms/PasswordRequirements";
import ResetPasswordSuccessModal from "@/components/molecules/ResetPasswordSuccessModal";
import { analyzePasswordStrength } from "@/utils/passwordStrength";
import useResetPassword from "@/hooks/useResetPassword";
import { FiLock } from "react-icons/fi";

/**
 * Reset password form schema validation
 */
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/\d/, { message: "Password must contain at least one number" })
      .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
        message: "Password must contain at least one special character",
      }),
    password_confirmation: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

/**
 * Reset password form values type
 */
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

/**
 * Reset password form properties
 * @interface ResetPasswordFormProps
 */
interface ResetPasswordFormProps {
  /** Reset token from URL */
  token: string;
  /** Custom CSS class */
  className?: string;
}

/**
 * Reset password form component
 * @description Form for resetting password with strength validation and requirements checklist
 * @param props - Reset password form properties
 * @returns Reset password form component
 */
const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  token,
  className = "",
}) => {
  const [passwordStrength, setPasswordStrength] = useState(
    analyzePasswordStrength("")
  );

  const {
    isLoading,
    isSuccess,
    error,
    responseMessage,
    resetPassword,
    resetState,
  } = useResetPassword(token);

  // Form validation with react-hook-form and zod
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  // Watch password field for strength analysis
  const password = watch("password");

  // Update password strength when password changes
  useEffect(() => {
    setPasswordStrength(analyzePasswordStrength(password || ""));
  }, [password]);

  /**
   * Form submission handler
   * @param data - Form values
   */
  const onSubmit = async (data: ResetPasswordFormValues) => {
    await resetPassword(data.password, data.password_confirmation);
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
            Create a new secure password for your account.
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

        {/* Reset password form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* New password input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <Input
              label="New password"
              type="password"
              fullWidth
              error={errors.password?.message}
              autoComplete="new-password"
              showPasswordToggle
              startIcon={<FiLock className="w-5 h-5" />}
              {...register("password")}
            />

            {/* Password strength indicator */}
            {password && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PasswordStrengthIndicator strength={passwordStrength} />
              </motion.div>
            )}
          </motion.div>

          {/* Confirm password input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Input
              label="Confirm new password"
              type="password"
              fullWidth
              error={errors.password_confirmation?.message}
              autoComplete="new-password"
              showPasswordToggle
              startIcon={<FiLock className="w-5 h-5" />}
              {...register("password_confirmation")}
            />
          </motion.div>

          {/* Password requirements */}
          {password && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <PasswordRequirements strength={passwordStrength} />
            </motion.div>
          )}

          {/* Submit button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              type="submit"
              fullWidth
              disabled={isLoading || passwordStrength.score < 3}
              loading={isLoading}
              className="mb-4"
            >
              Reset Password
            </Button>
          </motion.div>
        </form>
      </motion.div>

      {/* Success Modal */}
      <ResetPasswordSuccessModal
        isOpen={isSuccess}
        onClose={handleModalClose}
        message={responseMessage}
      />
    </>
  );
};

export default ResetPasswordForm;
