"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication on mount
    const checkAuth = () => {
      try {
        const authStatus = localStorage.getItem("isAuthenticated")
        const userId = localStorage.getItem("userId")
        
        if (authStatus === "true" && userId) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          router.push("/auth")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    // Small delay to ensure localStorage is available
    setTimeout(checkAuth, 100)
  }, [router])

  return { isAuthenticated, isLoading }
}
