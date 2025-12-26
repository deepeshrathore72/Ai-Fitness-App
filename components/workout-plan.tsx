"use client"

import { useState } from "react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Clock, ImageIcon } from "lucide-react"
import { ImageModal } from "./image-modal"

interface Exercise {
  name: string
  sets: string
  reps: string
  rest: string
  description: string
}

interface DayPlan {
  day: string
  duration: string
  exercises: Exercise[]
}

interface WorkoutPlanProps {
  plan: DayPlan[]
}

export function WorkoutPlan({ plan }: WorkoutPlanProps) {
  const [selectedDay, setSelectedDay] = useState(0)
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null)

  return (
    <>
      <Card className="p-6 bg-card mb-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Workout Overview</h2>
            <p className="text-muted-foreground">
              A personalized {plan[0]?.duration || "intermediate"} level workout plan designed for your goals.
            </p>
          </div>

          {/* Day Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {plan.map((dayPlan, index) => (
              <Button
                key={index}
                onClick={() => setSelectedDay(index)}
                variant={selectedDay === index ? "default" : "outline"}
                className={`rounded-lg shrink-0 ${
                  selectedDay === index ? "bg-primary text-primary-foreground" : "bg-transparent hover:bg-muted"
                }`}
              >
                {dayPlan.day}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Selected Day Workout */}
      <Card className="p-6 bg-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">{plan[selectedDay].day} Workout</h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{plan[selectedDay].duration}</span>
          </div>
        </div>

        <div className="space-y-4">
          {plan[selectedDay].exercises.map((exercise, index) => (
            <Card key={index} className="p-4 bg-background hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">{exercise.name}</h4>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                    <span>
                      <strong>{exercise.sets}</strong> sets
                    </span>
                    <span>
                      <strong>{exercise.reps}</strong> reps
                    </span>
                    <span>Rest: {exercise.rest}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{exercise.description}</p>
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setSelectedExercise(exercise.name)}
                  className="shrink-0 bg-transparent rounded-lg"
                  aria-label="View exercise image"
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {selectedExercise && (
        <ImageModal
          isOpen={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
          title={selectedExercise}
          query={`${selectedExercise} exercise demonstration`}
        />
      )}
    </>
  )
}
