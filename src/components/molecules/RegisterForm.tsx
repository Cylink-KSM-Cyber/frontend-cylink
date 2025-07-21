"use client";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import RegisterSuccessModal from "./RegisterSuccessModal";

/**
 * Register form schema validation
 */
const registerSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
  username: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
  password_confirmation: z
    .string()
    .min(1, { message: "Confirm password is required" })
    .min(8, { message: "Confirm password must be at least 8 characters" }),
});

/**
 * Register form values type
 */
type RegisterFormValues = z.infer<typeof registerSchema>;

/**
 * Register form properties
 * @interface RegisterFormProps
 */
interface RegisterFormProps {
  /** Custom CSS class */
  className?: string;
}

/**
 * Register form component
 * @description Form for user authentication with validation and error handling
 * @param props - Register form properties
 * @returns Register form component
 */
const RegisterForm: React.FC<RegisterFormProps> = ({ className = "" }) => {
  const { signup, isLoading, isModalOpen } = useAuth();

  // Form validation with react-hook-form and zod
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      password_confirmation: "",
      username: "",
    },
  });

  /**
   * Form submission handler
   * @param data - Form values
   */
  const onSubmit = async (data: RegisterFormValues) => {
    await signup({
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
      username: data.username,
    });
  };

  const handleClose = () => {
    reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full ${className}`}
    >
      {/* Register form with validation */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name input */}
        <div className="register-input">
          <Input
            label="Username"
            type="text"
            fullWidth
            error={errors.username?.message}
            autoComplete="username"
            {...register("username")}
          />
        </div>

        {/* Email input */}
        <div className="register-input">
          <Input
            label="Email"
            type="email"
            fullWidth
            error={errors.email?.message}
            autoComplete="email"
            {...register("email")}
          />
        </div>

        {/* Password input */}
        <div className="register-input">
          <Input
            label="Password"
            type="password"
            fullWidth
            error={errors.password?.message}
            showPasswordToggle
            autoComplete="current-password"
            {...register("password")}
          />
        </div>

        {/* Confirm password input */}
        <div className="register-input">
          <Input
            label="Confirm Password"
            type="password"
            fullWidth
            error={errors.password_confirmation?.message}
            showPasswordToggle
            autoComplete="retype-password"
            {...register("password_confirmation")}
          />
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          fullWidth
          disabled={isLoading}
          className="register-button"
        >
          Sign up
        </Button>

        {/* Register link */}
        <div className="text-center text-sm mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-black hover:underline"
          >
            Sign in
          </Link>
        </div>
      </form>
      <RegisterSuccessModal isOpen={isModalOpen} onClose={handleClose} />
    </motion.div>
  );
};

export default RegisterForm;
