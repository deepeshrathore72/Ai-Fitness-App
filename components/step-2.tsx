"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Activity, Dumbbell } from "lucide-react"
import type { UserFormData } from "@/types/form"

interface Step2Props {
  formData: UserFormData
  updateFormData: (data: Partial<UserFormData>) => void
  onNext: () => void
  onPrevious: () => void
}

export function FormStep2({ formData, updateFormData, onNext, onPrevious }: Step2Props) {
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
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: "50%" }} />
          </div>
          <p className="text-sm text-center text-muted-foreground">Step 2 of 4</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Physical Measurements</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">
                  Height (cm) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  value={formData.height}
                  onChange={(e) => updateFormData({ height: e.target.value })}
                  required
                  min="100"
                  max="250"
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">
                  Weight (kg) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={formData.weight}
                  onChange={(e) => updateFormData({ weight: e.target.value })}
                  required
                  min="30"
                  max="300"
                  className="bg-background/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sleepHours">Sleep Hours</Label>
                <Input
                  id="sleepHours"
                  type="number"
                  placeholder="7"
                  value={formData.sleepHours}
                  onChange={(e) => updateFormData({ sleepHours: e.target.value })}
                  min="0"
                  max="24"
                  step="0.5"
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="waterIntake">Water Intake (L/day)</Label>
                <Input
                  id="waterIntake"
                  type="number"
                  placeholder="2"
                  value={formData.waterIntake}
                  onChange={(e) => updateFormData({ waterIntake: e.target.value })}
                  min="0"
                  max="10"
                  step="0.5"
                  className="bg-background/50"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onPrevious} className="px-8 rounded-lg bg-transparent">
              Previous
            </Button>
            <Button type="submit" className="px-8 bg-primary hover:bg-primary/90 rounded-lg">
              Next
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}
