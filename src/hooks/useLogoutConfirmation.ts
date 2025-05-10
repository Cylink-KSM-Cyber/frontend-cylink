import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Custom hook for managing logout confirmation
 * @description Provides state and handlers for logout confirmation modal
 * @returns Object containing modal state and handlers
 */
const useLogoutConfirmation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();

  /**
   * Open the logout confirmation modal
   */
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  /**
   * Close the logout confirmation modal
   */
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  /**
   * Handle logout confirmation
   * @description Executes logout process with loading state
   */
  const handleLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      // Small delay to show the loading state for better UX
      await new Promise((resolve) => setTimeout(resolve, 800));
      await logout();
    } finally {
      setIsLoggingOut(false);
      closeModal();
    }
  }, [logout, closeModal]);

  return {
    isModalOpen,
    isLoggingOut,
    openModal,
    closeModal,
    handleLogout,
  };
};

export default useLogoutConfirmation;
