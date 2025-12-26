"use client"

import { useState } from "react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { ImageIcon } from "lucide-react"
import { ImageModal } from "./image-modal"

interface Meal {
  name: string
  calories: number
  ingredients: string[]
  description?: string
}

interface DayMeals {
  day: string
  breakfast?: Meal
  lunch?: Meal
  dinner?: Meal
  snacks?: Meal
  meals?: {
    breakfast: Meal
    lunch: Meal
    dinner: Meal
    snacks: Meal
  }
}

interface DietPlanProps {
  plan: DayMeals[]
}

export function DietPlan({ plan }: DietPlanProps) {
  const [selectedDay, setSelectedDay] = useState(0)
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null)

  // Handle both nested and flat structure
  const currentDay = plan[selectedDay]
  const dayMeals = currentDay.meals || currentDay

  const meals = [
    { key: "breakfast", label: "Breakfast", meal: dayMeals.breakfast },
    { key: "lunch", label: "Lunch", meal: dayMeals.lunch },
    { key: "dinner", label: "Dinner", meal: dayMeals.dinner },
    { key: "snacks", label: "Snacks", meal: dayMeals.snacks },
  ].filter(({ meal }) => meal && meal.name) // Filter out undefined meals

  return (
    <>
      <Card className="p-6 bg-card mb-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Nutrition Overview</h2>
            <p className="text-muted-foreground">
              A balanced diet plan supporting your fitness goals with proper nutrition.
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

      {/* Selected Day Meals */}
      <div className="grid gap-6 md:grid-cols-2">
        {meals.map(({ key, label, meal }) => {
          if (!meal) return null
          return (
            <Card key={key} className="p-6 bg-card">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{label}</h3>
                    <p className="text-2xl font-bold text-primary mt-1">{meal.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">Calories: {meal.calories}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setSelectedMeal(meal.name)}
                    className="shrink-0 bg-transparent rounded-lg"
                    aria-label="View meal image"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-sm">Ingredients:</h4>
                  <ul className="space-y-1">
                    {meal.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <ImageModal
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
        title={selectedMeal || ""}
        query={selectedMeal || ""}
      />
    </>
  )
}
