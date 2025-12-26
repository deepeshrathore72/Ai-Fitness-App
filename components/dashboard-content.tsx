"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MotivationQuote } from "./motivation-quote"
import { FormStep1 } from "./step-1"
import { FormStep2 } from "./step-2"
import { FormStep3 } from "./step-3"
import { FormStep4 } from "./step-4"
import type { UserFormData } from "@/types/form"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/hooks/useAuth"

export function DashboardContent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    sleepHours: "",
    waterIntake: "",
    fitnessGoal: "",
    fitnessLevel: "",
    workoutLocation: "",
    stressLevel: "",
    dietaryPreference: "",
    medicalHistory: "",
  })

  const updateFormData = (data: Partial<UserFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      // Save form data and navigate to results
      localStorage.setItem("fitnessFormData", JSON.stringify(formData))
      router.push("/results")
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MotivationQuote />
        </motion.div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && <FormStep1 formData={formData} updateFormData={updateFormData} onNext={handleNext} />}
                {currentStep === 2 && (
                  <FormStep2
                    formData={formData}
                    updateFormData={updateFormData}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                  />
                )}
                {currentStep === 3 && (
                  <FormStep3
                    formData={formData}
                    updateFormData={updateFormData}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                  />
                )}
                {currentStep === 4 && (
                  <FormStep4
                    formData={formData}
                    updateFormData={updateFormData}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
