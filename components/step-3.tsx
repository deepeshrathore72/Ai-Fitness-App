"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Target, Dumbbell } from "lucide-react"
import type { UserFormData } from "@/types/form"

interface Step3Props {
  formData: UserFormData
  updateFormData: (data: Partial<UserFormData>) => void
  onNext: () => void
  onPrevious: () => void
}

export function FormStep3({ formData, updateFormData, onNext, onPrevious }: Step3Props) {
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
            <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: "75%" }} />
          </div>
          <p className="text-sm text-center text-muted-foreground">Step 3 of 4</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Fitness Goals & Preferences</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fitnessGoal">
                Fitness Goal <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.fitnessGoal} onValueChange={(value) => updateFormData({ fitnessGoal: value })}>
                <SelectTrigger id="fitnessGoal" className="bg-background/50">
                  <SelectValue placeholder="Select your primary goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight-loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                  <SelectItem value="general-fitness">General Fitness</SelectItem>
                  <SelectItem value="endurance">Endurance</SelectItem>
                  <SelectItem value="flexibility">Flexibility</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fitnessLevel">
                Current Fitness Level <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.fitnessLevel} onValueChange={(value) => updateFormData({ fitnessLevel: value })}>
                <SelectTrigger id="fitnessLevel" className="bg-background/50">
                  <SelectValue placeholder="Select your fitness level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workoutLocation">
                Workout Location <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.workoutLocation}
                onValueChange={(value) => updateFormData({ workoutLocation: value })}
              >
                <SelectTrigger id="workoutLocation" className="bg-background/50">
                  <SelectValue placeholder="Where will you work out?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="gym">Gym</SelectItem>
                  <SelectItem value="outdoor">Outdoor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stressLevel">Stress Level</Label>
              <Select value={formData.stressLevel} onValueChange={(value) => updateFormData({ stressLevel: value })}>
                <SelectTrigger id="stressLevel" className="bg-background/50">
                  <SelectValue placeholder="Select stress level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
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
