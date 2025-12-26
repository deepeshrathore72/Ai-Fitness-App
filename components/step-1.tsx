"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { User, Dumbbell } from "lucide-react"
import type { UserFormData } from "@/types/form"

interface Step1Props {
  formData: UserFormData
  updateFormData: (data: Partial<UserFormData>) => void
  onNext: () => void
}

export function FormStep1({ formData, updateFormData, onNext }: Step1Props) {
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
            <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: "25%" }} />
          </div>
          <p className="text-sm text-center text-muted-foreground">Step 1 of 4</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Basic Information</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => updateFormData({ name: e.target.value })}
                required
                className="bg-background/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">
                  Age <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => updateFormData({ age: e.target.value })}
                  required
                  min="10"
                  max="100"
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">
                  Gender <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.gender} onValueChange={(value) => updateFormData({ gender: value })}>
                  <SelectTrigger id="gender" className="bg-background/50">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" disabled className="px-8 rounded-lg bg-transparent">
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