'use client'

import React from 'react'
import Sidebar from '@/components/organisms/Sidebar'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

/**
 * Props for DashboardClientLayout component
 */
interface DashboardClientLayoutProps {
  /**
   * Child components
   */
  children: React.ReactNode
}

/**
 * Dashboard Client Layout Component
 * @description Client-side layout component for dashboard that includes the sidebar and main content area
 */
const DashboardClientLayout: React.FC<DashboardClientLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth()
  const router = useRouter()

  // Handle profile click
  const handleProfileClick = () => {
    router.push('/settings/profile')
  }

  return (
    <div className='flex h-screen bg-gray-50 overflow-hidden'>
      {/* Sidebar */}
      <Sidebar
        userName={user?.name || 'User'}
        userEmail={user?.email || 'user@example.com'}
        onLogout={logout}
        onProfileClick={handleProfileClick}
      />

      {/* Main content */}
      <main className='flex-1 p-4 lg:p-6 overflow-y-auto transition-all duration-300 lg:ml-64'>
        <div className='container mx-auto max-w-7xl'>{children}</div>
      </main>
    </div>
  )
}

export default DashboardClientLayout
