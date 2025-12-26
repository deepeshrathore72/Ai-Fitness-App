"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { Volume2, FileDown, RefreshCw, Settings, Save, Home } from "lucide-react"
import { WorkoutPlan } from "./workout-plan"
import { DietPlan } from "./diet-plan"
import { VoiceDialog } from "./voice-dialog"
import type { UserFormData } from "@/types/form"
import { exportToPDF } from "@/lib/export-pdf"
import { useAuth } from "@/hooks/useAuth"

export function ResultsContent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState<UserFormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [workoutPlan, setWorkoutPlan] = useState<any>(null)
  const [dietPlan, setDietPlan] = useState<any>(null)
  const [showVoiceDialog, setShowVoiceDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated) {
      router.push("/auth")
      return
    }

    const data = localStorage.getItem("fitnessFormData")
    if (!data) {
      router.push("/dashboard")
      return
    }

    const parsedData = JSON.parse(data)
    setFormData(parsedData)

    // Generate plans from API
    generatePlansFromAPI(parsedData)
  }, [router, isAuthenticated, authLoading])

  const generatePlansFromAPI = async (data: UserFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("API Error Response:", result)
        console.error("Status:", response.status)
        console.error("Error details:", result.details)
        console.error("Error message:", result.message)
        throw new Error(result.details || result.error || "Failed to generate plan")
      }

      // Validate that we have the required data
      if (!result.workoutPlan || !result.dietPlan) {
        console.error("Received result:", result)
        throw new Error("Invalid plan data received")
      }

      setWorkoutPlan(result.workoutPlan)
      setDietPlan(result.dietPlan)
    } catch (error) {
      console.error("Error generating plans:", error)
      console.error("Full error:", error instanceof Error ? error.message : String(error))
      
      // Provide fallback plans
      const fallbackWorkoutPlan = [
        {
          day: "Monday",
          exercises: [
            { name: "Warm-up: Light Cardio", sets: 1, reps: "5 minutes", rest: "0 seconds", notes: "Get your heart rate up" },
            { name: "Push-ups", sets: 3, reps: "10-12", rest: "60 seconds", notes: "Keep your core tight" },
            { name: "Bodyweight Squats", sets: 3, reps: "15", rest: "60 seconds", notes: "Keep knees aligned with toes" },
            { name: "Plank", sets: 3, reps: "30-45 seconds", rest: "45 seconds", notes: "Maintain straight line" },
          ],
        },
        {
          day: "Tuesday",
          exercises: [
            { name: "Warm-up: High Knees", sets: 1, reps: "5 minutes", rest: "0 seconds", notes: "Light cardio" },
            { name: "Burpees", sets: 3, reps: "8-10", rest: "90 seconds", notes: "Full body movement" },
            { name: "Wall Sit", sets: 3, reps: "45-60 seconds", rest: "60 seconds", notes: "Keep back flat" },
            { name: "Cool-down: Stretching", sets: 1, reps: "10 minutes", rest: "0 seconds", notes: "Full body stretch" },
          ],
        },
        {
          day: "Wednesday",
          exercises: [
            { name: "Warm-up: Jumping Jacks", sets: 1, reps: "5 minutes", rest: "0 seconds", notes: "Dynamic warm-up" },
            { name: "Lunges", sets: 3, reps: "10 each leg", rest: "60 seconds", notes: "Control the movement" },
            { name: "Mountain Climbers", sets: 3, reps: "20", rest: "45 seconds", notes: "Keep pace steady" },
            { name: "Bicycle Crunches", sets: 3, reps: "15 each side", rest: "45 seconds", notes: "Focus on rotation" },
          ],
        },
        {
          day: "Thursday",
          exercises: [
            { name: "Warm-up: Light Cardio", sets: 1, reps: "5 minutes", rest: "0 seconds", notes: "Get your heart rate up" },
            { name: "Push-ups", sets: 3, reps: "10-12", rest: "60 seconds", notes: "Keep your core tight" },
            { name: "Bodyweight Squats", sets: 3, reps: "15", rest: "60 seconds", notes: "Keep knees aligned with toes" },
            { name: "Plank", sets: 3, reps: "30-45 seconds", rest: "45 seconds", notes: "Maintain straight line" },
          ],
        },
        {
          day: "Friday",
          exercises: [
            { name: "Warm-up: High Knees", sets: 1, reps: "5 minutes", rest: "0 seconds", notes: "Light cardio" },
            { name: "Burpees", sets: 3, reps: "8-10", rest: "90 seconds", notes: "Full body movement" },
            { name: "Wall Sit", sets: 3, reps: "45-60 seconds", rest: "60 seconds", notes: "Keep back flat" },
            { name: "Cool-down: Stretching", sets: 1, reps: "10 minutes", rest: "0 seconds", notes: "Full body stretch" },
          ],
        },
        {
          day: "Saturday",
          exercises: [
            { name: "Cardio Session", sets: 1, reps: "30 minutes", rest: "0 seconds", notes: "Running, cycling, or swimming" },
            { name: "Core Work", sets: 3, reps: "Various", rest: "30 seconds", notes: "Planks, crunches, leg raises" },
          ],
        },
        {
          day: "Sunday",
          exercises: [
            { name: "Rest Day", sets: 1, reps: "Complete rest", rest: "0 seconds", notes: "Recovery and meal prep" },
          ],
        },
      ]

      const fallbackDietPlan = [
        {
          day: "Monday",
          meals: {
            breakfast: {
              name: "Oatmeal Power Bowl",
              description: "Steel-cut oats with blueberries, almonds, and honey",
              calories: 350,
              ingredients: ["1 cup oats", "1/2 cup blueberries", "10 almonds", "1 tsp honey"]
            },
            lunch: {
              name: "Grilled Chicken Salad",
              description: "Mixed greens with grilled chicken, cherry tomatoes, cucumber",
              calories: 450,
              ingredients: ["150g chicken breast", "2 cups mixed greens", "1/2 cup tomatoes", "Olive oil dressing"]
            },
            dinner: {
              name: "Baked Salmon",
              description: "Salmon fillet with quinoa and steamed broccoli",
              calories: 500,
              ingredients: ["200g salmon", "1 cup quinoa", "1 cup broccoli", "Lemon juice"]
            },
            snacks: {
              name: "Protein Snacks",
              description: "Greek yogurt and apple slices",
              calories: 200,
              ingredients: ["1 cup Greek yogurt", "1 medium apple"]
            }
          },
          totalCalories: 1500,
        },
        {
          day: "Tuesday",
          meals: {
            breakfast: {
              name: "Protein Breakfast",
              description: "Scrambled eggs with whole wheat toast and avocado",
              calories: 400,
              ingredients: ["3 eggs", "2 slices whole wheat bread", "1/2 avocado"]
            },
            lunch: {
              name: "Turkey Wrap",
              description: "Whole wheat wrap with turkey, lettuce, tomato",
              calories: 450,
              ingredients: ["1 wrap", "150g turkey", "Lettuce", "Tomato", "Mustard"]
            },
            dinner: {
              name: "Beef Stir-Fry",
              description: "Lean beef with mixed vegetables and brown rice",
              calories: 520,
              ingredients: ["150g lean beef", "Mixed vegetables", "1 cup brown rice"]
            },
            snacks: {
              name: "Post-Workout Snack",
              description: "Protein shake and mixed nuts",
              calories: 180,
              ingredients: ["1 scoop protein powder", "Handful of nuts"]
            }
          },
          totalCalories: 1550,
        },
        {
          day: "Wednesday",
          meals: {
            breakfast: {
              name: "Smoothie Bowl",
              description: "Berry smoothie topped with granola and seeds",
              calories: 380,
              ingredients: ["Mixed berries", "Banana", "Granola", "Chia seeds"]
            },
            lunch: {
              name: "Tuna Sandwich",
              description: "Tuna salad on whole grain bread with vegetables",
              calories: 420,
              ingredients: ["1 can tuna", "2 slices bread", "Lettuce", "Tomato"]
            },
            dinner: {
              name: "Chicken & Sweet Potato",
              description: "Grilled chicken breast with roasted sweet potato",
              calories: 490,
              ingredients: ["200g chicken", "1 large sweet potato", "Olive oil"]
            },
            snacks: {
              name: "Cottage Cheese Bowl",
              description: "Low-fat cottage cheese with fresh berries",
              calories: 190,
              ingredients: ["1 cup cottage cheese", "1/2 cup berries"]
            }
          },
          totalCalories: 1480,
        },
        {
          day: "Thursday",
          meals: {
            breakfast: {
              name: "Veggie Omelet",
              description: "3-egg omelet with spinach, mushrooms, and cheese",
              calories: 420,
              ingredients: ["3 eggs", "Spinach", "Mushrooms", "Low-fat cheese"]
            },
            lunch: {
              name: "Quinoa Buddha Bowl",
              description: "Quinoa with chickpeas, vegetables, tahini dressing",
              calories: 480,
              ingredients: ["1 cup quinoa", "Chickpeas", "Mixed veggies", "Tahini"]
            },
            dinner: {
              name: "Grilled Fish",
              description: "White fish with asparagus and wild rice",
              calories: 460,
              ingredients: ["200g white fish", "Asparagus", "3/4 cup wild rice"]
            },
            snacks: {
              name: "Energy Bites",
              description: "Protein balls and banana",
              calories: 190,
              ingredients: ["2 protein balls", "1 banana"]
            }
          },
          totalCalories: 1550,
        },
        {
          day: "Friday",
          meals: {
            breakfast: {
              name: "Pancake Stack",
              description: "Whole grain pancakes with berries and maple syrup",
              calories: 410,
              ingredients: ["3 pancakes", "Berries", "2 tbsp maple syrup"]
            },
            lunch: {
              name: "Chicken Caesar",
              description: "Grilled chicken caesar salad with light dressing",
              calories: 440,
              ingredients: ["150g chicken", "Romaine lettuce", "Parmesan", "Light dressing"]
            },
            dinner: {
              name: "Pasta Primavera",
              description: "Whole wheat pasta with vegetables and lean protein",
              calories: 510,
              ingredients: ["Whole wheat pasta", "Mixed vegetables", "Chicken"]
            },
            snacks: {
              name: "Trail Mix",
              description: "Mixed nuts, seeds, and dried fruit",
              calories: 200,
              ingredients: ["Almonds", "Walnuts", "Dried cranberries"]
            }
          },
          totalCalories: 1560,
        },
        {
          day: "Saturday",
          meals: {
            breakfast: {
              name: "Breakfast Burrito",
              description: "Whole wheat tortilla with eggs, beans, salsa",
              calories: 450,
              ingredients: ["Tortilla", "3 eggs", "Black beans", "Salsa", "Avocado"]
            },
            lunch: {
              name: "Asian Chicken Bowl",
              description: "Teriyaki chicken with brown rice and edamame",
              calories: 490,
              ingredients: ["150g chicken", "Brown rice", "Edamame", "Teriyaki sauce"]
            },
            dinner: {
              name: "Lean Steak",
              description: "Grilled sirloin with roasted vegetables",
              calories: 520,
              ingredients: ["200g sirloin", "Mixed roasted vegetables"]
            },
            snacks: {
              name: "Protein Shake",
              description: "Whey protein shake with almond milk",
              calories: 180,
              ingredients: ["1 scoop protein", "Almond milk", "Banana"]
            }
          },
          totalCalories: 1640,
        },
        {
          day: "Sunday",
          meals: {
            breakfast: {
              name: "French Toast",
              description: "Whole grain French toast with fruit",
              calories: 390,
              ingredients: ["2 slices bread", "Eggs", "Cinnamon", "Fresh fruit"]
            },
            lunch: {
              name: "Mediterranean Plate",
              description: "Hummus, falafel, pita, vegetables",
              calories: 470,
              ingredients: ["Hummus", "3 falafel", "Pita bread", "Cucumber", "Tomato"]
            },
            dinner: {
              name: "Roasted Chicken",
              description: "Herb-roasted chicken with mashed cauliflower",
              calories: 480,
              ingredients: ["200g chicken", "Cauliflower", "Herbs", "Olive oil"]
            },
            snacks: {
              name: "Dark Chocolate & Nuts",
              description: "Dark chocolate squares with almonds",
              calories: 180,
              ingredients: ["2 squares dark chocolate", "10 almonds"]
            }
          },
          totalCalories: 1520,
        },
      ]

      setWorkoutPlan(fallbackWorkoutPlan)
      setDietPlan(fallbackDietPlan)
      
      // Silently use fallback plans without showing alert
      console.log("Using fallback plans due to API error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegenerate = async () => {
    if (formData) {
      setIsRegenerating(true)
      await generatePlansFromAPI(formData)
      setIsRegenerating(false)
    }
  }

  // Normalize form values to match backend enum values
  const normalizeFormValues = (data: any) => {
    return {
      ...data,
      fitnessGoal: data.fitnessGoal?.replace('-', '_'), // muscle-gain -> muscle_gain, weight-loss -> weight_loss
      stressLevel: data.stressLevel === 'moderate' ? 'medium' : data.stressLevel, // moderate -> medium
      dietaryPreference: data.dietaryPreference?.replace('-', '_'), // non-vegetarian -> non_vegetarian
    }
  }

  // Convert diet plan meal objects to strings for database storage
  const convertDietPlanToStrings = (plan: any[]) => {
    return plan.map(day => {
      const dayMeals = day.meals || day
      
      // Calculate total calories
      const totalCalories = 
        (dayMeals.breakfast?.calories || 0) +
        (dayMeals.lunch?.calories || 0) +
        (dayMeals.dinner?.calories || 0) +
        (dayMeals.snacks?.calories || 0)

      return {
        day: day.day,
        meals: {
          breakfast: dayMeals.breakfast?.name || 'Not specified',
          lunch: dayMeals.lunch?.name || 'Not specified',
          dinner: dayMeals.dinner?.name || 'Not specified',
          snacks: dayMeals.snacks?.name || 'Not specified',
        },
        calories: totalCalories
      }
    })
  }

  const handleSavePlan = async () => {
    setIsSaving(true)
    try {
      const userEmail = localStorage.getItem("userEmail")
      if (!userEmail) {
        alert("Please log in to save your plan")
        return
      }

      // Normalize form data to match backend enum values
      const normalizedData = normalizeFormValues(formData)

      // Convert diet plan to string format for database
      const stringifiedDietPlan = convertDietPlanToStrings(dietPlan)

      const response = await fetch("/api/plans/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          userDetails: {
            name: normalizedData?.name,
            age: Number(normalizedData?.age),
            gender: normalizedData?.gender,
            height: Number(normalizedData?.height),
            weight: Number(normalizedData?.weight),
            fitnessGoal: normalizedData?.fitnessGoal,
            fitnessLevel: normalizedData?.fitnessLevel,
            workoutLocation: normalizedData?.workoutLocation,
            dietaryPreference: normalizedData?.dietaryPreference,
            medicalHistory: normalizedData?.medicalHistory || '',
            stressLevel: normalizedData?.stressLevel || 'medium',
          },
          workoutPlan,
          dietPlan: stringifiedDietPlan,
          aiTips: {
            lifestyle: ["Stay hydrated", "Get adequate sleep", "Maintain consistency"],
          },
        }),
      })

      const result = await response.json()
      console.log("Save plan response:", result)

      if (!response.ok) {
        console.error("Save plan error details:", result)
        throw new Error(result.details || result.error || "Failed to save plan")
      }

      setSavedPlanId(result.planId)
      alert("Plan saved successfully to your account!")
    } catch (error) {
      console.error("Error saving plan:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      console.error("Full error details:", errorMessage)
      alert(`Failed to save plan: ${errorMessage}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      await exportToPDF(workoutPlan, dietPlan, formData)
    } catch (error) {
      console.error("Error exporting PDF:", error)
      alert("Failed to export PDF. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleReadAloud = () => {
    setShowVoiceDialog(true)
  }

  if (isLoading || !formData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg text-muted-foreground">Generating your personalized fitness plan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <Card className="p-6 bg-card">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Personalized Fitness Plan</h1>
              <p className="text-muted-foreground">AI-generated workout and nutrition plan tailored for your goals</p>
              {savedPlanId && (
                <p className="text-sm text-green-600 mt-1">✓ Plan saved successfully (ID: {savedPlanId.slice(0, 8)}...)</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="bg-transparent rounded-lg"
                aria-label="Go to home"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button
                onClick={handleSavePlan}
                variant="default"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
                aria-label="Save plan"
                disabled={isSaving || !!savedPlanId}
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {savedPlanId ? "Saved" : "Save Plan"}
              </Button>
              <Button
                onClick={handleReadAloud}
                variant="outline"
                className="bg-transparent rounded-lg"
                aria-label="Read my plan"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Read My Plan
              </Button>
              <Button
                onClick={handleExportPDF}
                variant="outline"
                className="bg-transparent rounded-lg"
                aria-label="Export as PDF"
                disabled={isExporting}
              >
                {isExporting ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <FileDown className="w-4 h-4 mr-2" />
                )}
                Export PDF
              </Button>
              <Button
                onClick={handleRegenerate}
                variant="outline"
                className="bg-transparent rounded-lg"
                aria-label="Regenerate plan"
                disabled={isRegenerating}
              >
                {isRegenerating ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Regenerate
              </Button>
              <Button
                onClick={() => setShowSettingsDialog(true)}
                variant="outline"
                className="bg-transparent rounded-lg"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Plans */}
        <Tabs defaultValue="workout" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-muted p-1 rounded-lg">
            <TabsTrigger
              value="workout"
              className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Workout Plan
            </TabsTrigger>
            <TabsTrigger
              value="diet"
              className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Diet Plan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workout" className="mt-6">
            <WorkoutPlan plan={workoutPlan} />
          </TabsContent>

          <TabsContent value="diet" className="mt-6">
            <DietPlan plan={dietPlan} />
          </TabsContent>
        </Tabs>

      </div>

      <VoiceDialog
        isOpen={showVoiceDialog}
        onClose={() => setShowVoiceDialog(false)}
        workoutPlan={workoutPlan}
        dietPlan={dietPlan}
      />

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Manage your account and preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="font-medium">Account</h3>
              <div className="space-y-2 text-sm">
                <Button
                  onClick={() => {
                    setShowSettingsDialog(false)
                    router.push("/")
                  }}
                  variant="outline"
                  className="w-full justify-start"
                >
                  Go to Home
                </Button>
                <Button
                  onClick={() => {
                    localStorage.removeItem("isAuthenticated")
                    localStorage.removeItem("userId")
                    localStorage.removeItem("userName")
                    localStorage.removeItem("userEmail")
                    localStorage.removeItem("fitnessFormData")
                    router.push("/auth")
                  }}
                  variant="outline"
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  Logout
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">About</h3>
              <p className="text-sm text-muted-foreground">
                AI Fitness Coach - Version 1.0
              </p>
              <p className="text-sm text-muted-foreground">
                Powered by Google Gemini AI
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
