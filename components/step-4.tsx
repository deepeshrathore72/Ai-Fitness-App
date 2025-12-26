"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Utensils, Dumbbell } from "lucide-react"
import type { UserFormData } from "@/types/form"

interface Step4Props {
  formData: UserFormData
  updateFormData: (data: Partial<UserFormData>) => void
  onNext: () => void
  onPrevious: () => void
}

export function FormStep4({ formData, updateFormData, onNext, onPrevious }: Step4Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <Card className="p-8 bg-card border-border">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Dumbbell className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Tell Us About Yourself</h2>
          </div>
          <p className="text-muted-foreground">Help us create your perfect fitness and nutrition plan</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 bg-primary rounded-full overflow-hidden transition-all duration-300" />
          <p className="text-sm text-center text-muted-foreground">Step 4 of 4</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Utensils className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Dietary Preferences</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dietaryPreference">
                Dietary Preference <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.dietaryPreference}
                onValueChange={(value) => updateFormData({ dietaryPreference: value })}
              >
                <SelectTrigger id="dietaryPreference" className="bg-background/50">
                  <SelectValue placeholder="Select your dietary preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="keto">Keto</SelectItem>
                  <SelectItem value="paleo">Paleo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalHistory">Medical History (Optional)</Label>
              <Textarea
                id="medicalHistory"
                placeholder="Any injuries, conditions, or medications..."
                value={formData.medicalHistory}
                onChange={(e) => updateFormData({ medicalHistory: e.target.value })}
                className="bg-background/50 min-h-30 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onPrevious} className="px-8 rounded-lg bg-transparent">
              Previous
            </Button>
            <Button type="submit" className="px-8 bg-primary hover:bg-primary/90 rounded-lg">
              Generate My Plan
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}
