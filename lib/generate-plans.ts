import type { UserFormData } from "@/types/form"

export function generateWorkoutPlan(formData: UserFormData) {
  const isGym = formData.workoutLocation === "gym"
  const level = formData.fitnessLevel || "intermediate"

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  return days.map((day, index) => {
    if (index === 6) {
      return {
        day: "Sunday",
        duration: "Rest Day",
        exercises: [
          {
            name: "Active Recovery",
            sets: "-",
            reps: "-",
            rest: "-",
            description: "Light stretching, yoga, or a gentle walk to aid recovery.",
          },
        ],
      }
    }

    const exercises =
      index % 2 === 0
        ? [
            {
              name: isGym ? "Barbell Squat" : "Bodyweight Squat",
              sets: level === "beginner" ? "3" : level === "intermediate" ? "4" : "5",
              reps: "10-12",
              rest: "90s",
              description: "Start with feet shoulder-width apart and squat down keeping your back straight.",
            },
            {
              name: isGym ? "Bench Press" : "Push-ups",
              sets: level === "beginner" ? "3" : "4",
              reps: level === "beginner" ? "8-10" : "10-12",
              rest: "60s",
              description: "Focus on controlled movement and full range of motion.",
            },
            {
              name: isGym ? "Lat Pulldown" : "Pull-ups",
              sets: "3",
              reps: level === "beginner" ? "6-8" : "8-10",
              rest: "90s",
              description: "Pull with your back muscles, not your arms.",
            },
          ]
        : [
            {
              name: isGym ? "Deadlift" : "Romanian Deadlift",
              sets: level === "beginner" ? "3" : "4",
              reps: "8-10",
              rest: "120s",
              description: "Keep the bar close to your body and maintain a neutral spine.",
            },
            {
              name: isGym ? "Shoulder Press" : "Pike Push-ups",
              sets: "3",
              reps: "10-12",
              rest: "60s",
              description: "Press overhead with controlled motion.",
            },
            {
              name: "Plank Hold",
              sets: "3",
              reps: "30-60s",
              rest: "45s",
              description: "Maintain a straight line from head to heels.",
            },
          ]

    return {
      day,
      duration: "30 minutes",
      exercises,
    }
  })
}

export function generateDietPlan(formData: UserFormData) {
  const isDiet = formData.dietaryPreference
  const isVeg = isDiet === "vegetarian" || isDiet === "vegan"

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  return days.map((day) => ({
    day,
    breakfast: {
      name: isVeg ? "Oatmeal with Berries" : "Scrambled Eggs with Toast",
      calories: 400,
      ingredients: isVeg
        ? ["Rolled oats", "Mixed berries", "Almonds", "Honey", "Almond milk"]
        : ["3 eggs", "Whole wheat toast", "Butter", "Salt and pepper"],
    },
    lunch: {
      name: isVeg ? "Quinoa Buddha Bowl" : "Grilled Chicken Salad",
      calories: 600,
      ingredients: isVeg
        ? ["Quinoa", "Chickpeas", "Avocado", "Mixed greens", "Tahini dressing"]
        : ["Grilled chicken breast", "Mixed greens", "Cherry tomatoes", "Cucumber", "Olive oil dressing"],
    },
    dinner: {
      name: isVeg ? "Lentil Curry with Rice" : "Salmon with Vegetables",
      calories: 650,
      ingredients: isVeg
        ? ["Red lentils", "Brown rice", "Coconut milk", "Spinach", "Spices"]
        : ["Salmon fillet", "Broccoli", "Sweet potato", "Olive oil", "Lemon"],
    },
    snacks: {
      name: "Protein Smoothie",
      calories: 250,
      ingredients: ["Banana", "Protein powder", "Spinach", "Almond milk", "Peanut butter"],
    },
  }))
}
