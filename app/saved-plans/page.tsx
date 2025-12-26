"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, Plus, Eye, Trash2, TrendingUp, Calendar } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

interface SavedPlan {
  id: string
  userName: string
  userDetails: any
  workoutPlan: any[]
  dietPlan: any[]
  createdAt: string
}

export default function SavedPlansPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated) {
      router.push("/auth")
      return
    }

    loadSavedPlans()
  }, [isAuthenticated, authLoading, router])

  const loadSavedPlans = () => {
    try {
      const plans = JSON.parse(localStorage.getItem("savedFitnessPlans") || "[]")
      setSavedPlans(plans)
    } catch (error) {
      console.error("Error loading plans:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePlan = (planId: string) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      const updatedPlans = savedPlans.filter(plan => plan.id !== planId)
      localStorage.setItem("savedFitnessPlans", JSON.stringify(updatedPlans))
      setSavedPlans(updatedPlans)
    }
  }

  const handleViewPlan = (plan: SavedPlan) => {
    // Store plan data temporarily for viewing
    localStorage.setItem("viewingPlan", JSON.stringify(plan))
    router.push("/results")
  }

  const calculateStats = () => {
    const totalPlans = savedPlans.length
    const workoutDays = savedPlans.reduce((acc, plan) => {
      return acc + (plan.workoutPlan?.length || 0)
    }, 0)
    const dietDays = savedPlans.reduce((acc, plan) => {
      return acc + (plan.dietPlan?.length || 0)
    }, 0)
    const latestPlan = savedPlans.length > 0 
      ? new Date(savedPlans[savedPlans.length - 1].createdAt).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        })
      : 'N/A'

    return { totalPlans, workoutDays, dietDays, latestPlan }
  }

  const stats = calculateStats()

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg text-muted-foreground">Loading your plans...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-primary" />
              Saved Fitness Plans
            </h1>
            <p className="text-muted-foreground">
              View and manage your saved workout and diet plans
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="bg-transparent rounded-lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Plan
            </Button>
          </div>
        </div>

        {/* Saved Plans */}
        {savedPlans.length === 0 ? (
          <Card className="p-12 text-center bg-card">
            <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Saved Plans Yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first personalized fitness plan to get started!
            </p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Plan
            </Button>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {savedPlans.map((plan) => (
                <Card key={plan.id} className="p-6 bg-card hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{plan.userName}'s Plan</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(plan.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Goal:</span>
                      <span className="font-medium">{plan.userDetails?.fitnessGoal || 'General Fitness'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Level:</span>
                      <span className="font-medium">{plan.userDetails?.fitnessLevel || 'Beginner'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium">{plan.userDetails?.workoutLocation || 'Gym'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Diet:</span>
                      <span className="font-medium">{plan.userDetails?.dietaryPreference || 'No Preference'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleViewPlan(plan)}
                      variant="outline"
                      className="flex-1 bg-transparent"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      onClick={() => handleDeletePlan(plan.id)}
                      variant="outline"
                      className="bg-transparent hover:bg-red-50 hover:text-red-600 hover:border-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Summary Stats */}
            <Card className="p-6 bg-card">
              <h2 className="text-xl font-bold mb-4">Summary</h2>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="bg-blue-500/10 p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-500 mb-2">{stats.totalPlans}</div>
                  <div className="text-sm text-muted-foreground">Total Plans</div>
                </div>
                <div className="bg-green-500/10 p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-500 mb-2">{stats.workoutDays-1}</div>
                  <div className="text-sm text-muted-foreground">Workout Days</div>
                </div>
                <div className="bg-purple-500/10 p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-purple-500 mb-2">{stats.dietDays}</div>
                  <div className="text-sm text-muted-foreground">Diet Days</div>
                </div>
                <div className="bg-orange-500/10 p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">{stats.latestPlan}</div>
                  <div className="text-sm text-muted-foreground">Latest Plan</div>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
