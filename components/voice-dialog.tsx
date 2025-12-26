"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Volume2, VolumeX, Loader2 } from "lucide-react";

interface VoiceDialogProps {
  isOpen: boolean
  onClose: () => void
  workoutPlan: any
  dietPlan: any
}

export function VoiceDialog({ isOpen, onClose, workoutPlan, dietPlan }: VoiceDialogProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedType, setSelectedType] = useState<"workout" | "diet" | null>(null)

  const handlePlay = (type: "workout" | "diet") => {
    setSelectedType(type)
    setIsPlaying(true)

    // Generate text to speech
    const text = type === "workout" ? generateWorkoutText() : generateDietText()

    // Use Web Speech API for demo
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.onend = () => {
        setIsPlaying(false)
        setSelectedType(null)
      }
      window.speechSynthesis.speak(utterance)
    } else {
      alert("Text-to-speech is not supported in your browser. In production, this would use ElevenLabs API.")
      setIsPlaying(false)
      setSelectedType(null)
    }
  }

  const handleStop = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
    setIsPlaying(false)
    setSelectedType(null)
  }

  const generateWorkoutText = () => {
    let text = "Here is your weekly workout plan. "

    workoutPlan?.slice(0, 3).forEach((day: any) => {
      text += `${day.day}: `
      if (day.day === "Sunday") {
        text += "Rest day for recovery. "
      } else {
        text += `${day.duration} workout including `
        day.exercises.forEach((exercise: any, index: number) => {
          text += `${exercise.name}`
          if (index < day.exercises.length - 1) {
            text += ", "
          }
        })
        text += ". "
      }
    })

    return text
  }

  const generateDietText = () => {
    let text = "Here is your nutrition plan. "

    dietPlan?.slice(0, 2).forEach((day: any) => {
      // Handle both nested and flat structure
      const meals = day.meals || day
      
      text += `${day.day}: `
      
      if (meals.breakfast?.name) {
        text += `For breakfast, ${meals.breakfast.name}. `
      }
      if (meals.lunch?.name) {
        text += `For lunch, ${meals.lunch.name}. `
      }
      if (meals.dinner?.name) {
        text += `For dinner, ${meals.dinner.name}. `
      }
      if (meals.snacks?.name) {
        text += `And snacks include ${meals.snacks.name}. `
      }
    })

    return text
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Read My Plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">Choose which section you'd like to listen to:</p>

          <div className="grid gap-3">
            <Button
              onClick={() => handlePlay("workout")}
              disabled={isPlaying}
              variant="outline"
              className="w-full justify-start h-auto p-4 bg-transparent hover:bg-muted"
            >
              <div className="flex items-center gap-3 w-full">
                {isPlaying && selectedType === "workout" ? (
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                ) : (
                  <Volume2 className="w-5 h-5 text-primary" />
                )}
                <div className="flex-1 text-left">
                  <div className="font-semibold">Workout Plan</div>
                  <div className="text-xs text-muted-foreground">Listen to your weekly workout routine</div>
                </div>
              </div>
            </Button>

            <Button
              onClick={() => handlePlay("diet")}
              disabled={isPlaying}
              variant="outline"
              className="w-full justify-start h-auto p-4 bg-transparent hover:bg-muted"
            >
              <div className="flex items-center gap-3 w-full">
                {isPlaying && selectedType === "diet" ? (
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                ) : (
                  <Volume2 className="w-5 h-5 text-primary" />
                )}
                <div className="flex-1 text-left">
                  <div className="font-semibold">Diet Plan</div>
                  <div className="text-xs text-muted-foreground">Listen to your nutrition guide</div>
                </div>
              </div>
            </Button>
          </div>

          {isPlaying && (
            <Button onClick={handleStop} variant="destructive" className="w-full rounded-lg">
              <VolumeX className="w-4 h-4 mr-2" />
              Stop Reading
            </Button>
          )}

          <p className="text-xs text-muted-foreground text-center">
            Using Web Speech API for demo. In production, this would integrate with ElevenLabs for higher quality voice.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
