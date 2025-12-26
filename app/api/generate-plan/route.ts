import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      age,
      gender,
      height,
      weight,
      fitnessGoal,
      fitnessLevel,
      workoutLocation,
      dietaryPreference,
      medicalHistory,
      stressLevel,
    } = body;

    // Validate required fields
    if (!name || !age || !gender || !height || !weight || !fitnessGoal || !fitnessLevel || !workoutLocation || !dietaryPreference) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize Groq AI
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('Groq API key not configured');
      return NextResponse.json(
        { error: 'Groq API key not configured', message: 'Please add GROQ_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    console.log('Initializing Groq AI...');
    const groq = new Groq({ apiKey });

    // Create comprehensive prompt for workout plan
    const workoutPrompt = `Generate a detailed 7-day workout plan for:
- Name: ${name}
- Age: ${age}, Gender: ${gender}
- Height: ${height}cm, Weight: ${weight}kg
- Goal: ${fitnessGoal}
- Level: ${fitnessLevel}
- Location: ${workoutLocation}
${medicalHistory ? `- Medical: ${medicalHistory}` : ''}

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "workoutPlan": [
    {
      "day": "Monday",
      "exercises": [
        {"name": "Exercise Name", "sets": 3, "reps": "10-12", "rest": "60 seconds", "notes": "Form tips"}
      ]
    }
  ]
}

Include ALL 7 days: Monday through Sunday. IMPORTANT: Make Sunday a REST DAY with no exercises (just include a rest day message). Make the other 6 days personalized for ${fitnessLevel} level and ${workoutLocation}.`;

    // Create comprehensive prompt for diet plan
    const dietPrompt = `Generate a detailed 7-day diet plan for:
- Name: ${name}
- Age: ${age}, Gender: ${gender}  
- Height: ${height}cm, Weight: ${weight}kg
- Goal: ${fitnessGoal}
- Diet: ${dietaryPreference}

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "dietPlan": [
    {
      "day": "Monday",
      "meals": {
        "breakfast": {
          "name": "Oatmeal Power Bowl",
          "description": "Steel-cut oats with berries and almonds",
          "calories": 400,
          "ingredients": ["1 cup oats", "1/2 cup berries", "10 almonds"]
        },
        "lunch": {
          "name": "Grilled Chicken Salad",
          "description": "Mixed greens with grilled chicken",
          "calories": 500,
          "ingredients": ["150g chicken", "2 cups greens", "Olive oil"]
        },
        "dinner": {
          "name": "Salmon with Quinoa",
          "description": "Baked salmon with quinoa and vegetables",
          "calories": 600,
          "ingredients": ["200g salmon", "1 cup quinoa", "Vegetables"]
        },
        "snacks": {
          "name": "Greek Yogurt",
          "description": "Greek yogurt with fruit",
          "calories": 200,
          "ingredients": ["1 cup yogurt", "Fruit"]
        }
      },
      "totalCalories": 1700
    }
  ]
}

IMPORTANT: Include ALL 7 days (Monday through Sunday). Each meal MUST have: name, description, calories, and ingredients array. Follow ${dietaryPreference} preferences for ${fitnessGoal} goal. Make sure every single meal object has all four properties.`;

    // Generate plans using Groq AI - Sequential to avoid rate limits
    console.log('Generating workout plan...');
    const workoutCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: workoutPrompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 3000,
    });
    
    console.log('Generating diet plan...');
    const dietCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: dietPrompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 3000,
    });

    // Extract and parse responses
    const workoutText = workoutCompletion.choices[0]?.message?.content || '';
    const dietText = dietCompletion.choices[0]?.message?.content || '';

    console.log('Workout Response:', workoutText.substring(0, 200));
    console.log('Diet Response:', dietText.substring(0, 200));

    // Clean up responses (remove markdown if present)
    const cleanWorkout = workoutText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const cleanDiet = dietText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let workoutData, dietData;
    
    try {
      workoutData = JSON.parse(cleanWorkout);
    } catch (e) {
      console.error('Failed to parse workout data:', e);
      throw new Error('Invalid workout plan format from AI');
    }

    try {
      dietData = JSON.parse(cleanDiet);
    } catch (e) {
      console.error('Failed to parse diet data:', e);
      throw new Error('Invalid diet plan format from AI');
    }

    // Validate we have workout and diet plans
    if (!workoutData.workoutPlan || !Array.isArray(workoutData.workoutPlan)) {
      console.error('Invalid workout plan structure:', workoutData);
      throw new Error('Workout plan missing or invalid');
    }
    if (!dietData.dietPlan || !Array.isArray(dietData.dietPlan)) {
      console.error('Invalid diet plan structure:', dietData);
      throw new Error('Diet plan missing or invalid');
    }

    // Validate each diet day has proper meal structure
    for (const day of dietData.dietPlan) {
      if (!day.meals) {
        console.error('Day missing meals:', day);
        throw new Error('Invalid diet day structure');
      }
      // Ensure each meal has name, description, calories
      const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];
      for (const mealType of mealTypes) {
        const meal = day.meals[mealType];
        if (typeof meal === 'string') {
          // Convert old string format to object format
          day.meals[mealType] = {
            name: mealType.charAt(0).toUpperCase() + mealType.slice(1),
            description: meal,
            calories: 400,
            ingredients: []
          };
        } else if (!meal || !meal.name) {
          day.meals[mealType] = {
            name: mealType.charAt(0).toUpperCase() + mealType.slice(1),
            description: meal?.description || 'Healthy meal',
            calories: meal?.calories || 400,
            ingredients: meal?.ingredients || []
          };
        }
      }
    }

    // Combine all data
    const completeData = {
      userDetails: {
        name,
        age: Number(age),
        gender,
        height: Number(height),
        weight: Number(weight),
        fitnessGoal,
        fitnessLevel,
        workoutLocation,
        dietaryPreference,
        medicalHistory: medicalHistory || '',
        stressLevel: stressLevel || 'medium',
      },
      workoutPlan: workoutData.workoutPlan,
      dietPlan: dietData.dietPlan,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(completeData);
  } catch (error) {
    console.error('Error generating plan:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate fitness plan', 
        details: errorMessage,
        message: 'Please try again or check your API key'
      },
      { status: 500 }
    );
  }
}