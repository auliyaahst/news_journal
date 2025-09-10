'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Dashboard() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        // Redirect to login page after successful logout
        router.push('/login')
      } else {
        console.error('Logout failed')
        // Even if the API call fails, redirect to login for security
        router.push('/login')
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Even if there's an error, redirect to login for security
      router.push('/')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Your Dashboard!</h1>
            <p className="mt-2 text-gray-600">You have successfully logged in.</p>
          </div>
          
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Dashboard Content</h2>
          <p className="text-gray-600">Your dashboard content will appear here.</p>
        </div>
      </div>
    </div>
  )
}