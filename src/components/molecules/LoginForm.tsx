"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";

/**
 * Login form schema validation
 */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
  rememberMe: z.boolean().optional(),
});

/**
 * Login form values type
 */
type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Login form properties
 * @interface LoginFormProps
 */
interface LoginFormProps {
  /** Custom CSS class */
  className?: string;
}

/**
 * Login form component
 * @description Form for user authentication with validation and error handling
 * @param props - Login form properties
 * @returns Login form component
 */
const LoginForm: React.FC<LoginFormProps> = ({ className = "" }) => {
  const { login, isLoading, error: authError } = useAuth();
  // const { showToast } = useToast();

  // Form validation with react-hook-form and zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  /**
   * Form submission handler
   * @param data - Form values
   */
  const onSubmit = async (data: LoginFormValues) => {
    await login({
      email: data.email,
      password: data.password,
    });
    // console.log("ini onSubmit");

    // showToast("Login successful", "success");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full ${className}`}
    >
      {/* Login form with validation */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email input */}
        <div className="login-input">
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
        <div className="login-input">
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

        {/* Remember me and forgot password */}
        <div className="flex items-center justify-between">
          <Checkbox label="Remember me" {...register("rememberMe")} />

          <Link
            href="/forgot-password"
            className="text-sm font-medium text-black hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Forgot password?
          </Link>
        </div>

        {/* Auth error message */}
        {authError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-md bg-red-50 text-red-500 text-sm"
          >
            {authError}
          </motion.div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          fullWidth
          disabled={isLoading}
          className="login-button"
        >
          Sign in
        </Button>

        {/* Register link */}
        <div className="text-center text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-black hover:underline"
          >
            Sign up
          </Link>
        </div>
      </form>
    </motion.div>
  );
};

export default LoginForm;
