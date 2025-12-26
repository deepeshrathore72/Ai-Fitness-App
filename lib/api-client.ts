/**
 * API Client Utilities for AI Fitness Coach
 * Helper functions to interact with backend API endpoints
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export interface UserFormData {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  fitnessGoal: string;
  fitnessLevel: string;
  workoutLocation: string;
  dietaryPreference: string;
  medicalHistory?: string;
  stressLevel?: string;
}

export interface FitnessPlanResponse {
  userDetails: UserFormData;
  workoutPlan: Array<{
    day: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: string;
      rest: string;
      notes: string;
    }>;
  }>;
  dietPlan: Array<{
    day: string;
    meals: {
      breakfast: string;
      lunch: string;
      dinner: string;
      snacks: string;
    };
    calories: number;
  }>;
  aiTips: {
    lifestyle: string[];
    posture: string[];
    motivation: string;
  };
  generatedAt: string;
}

/**
 * Generate a personalized fitness plan
 */
export async function generateFitnessPlan(
  userData: UserFormData
): Promise<FitnessPlanResponse> {
  const response = await fetch(`${API_BASE_URL}/api/generate-plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate fitness plan');
  }

  return response.json();
}

/**
 * Save fitness plan to database
 */
export async function saveFitnessPlan(
  email: string,
  planData: FitnessPlanResponse
): Promise<{ success: boolean; planId: string; userId: string }> {
  const response = await fetch(`${API_BASE_URL}/api/plans/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      ...planData,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to save fitness plan');
  }

  return response.json();
}

/**
 * Get fitness plans for a user
 */
export async function getFitnessPlans(email: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/plans/get?email=${encodeURIComponent(email)}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch fitness plans');
  }

  return response.json();
}

/**
 * Get a specific fitness plan by ID
 */
export async function getFitnessPlanById(planId: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/plans/get?planId=${encodeURIComponent(planId)}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch fitness plan');
  }

  return response.json();
}

/**
 * Delete a fitness plan
 */
export async function deleteFitnessPlan(planId: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/plans/delete?planId=${encodeURIComponent(planId)}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete fitness plan');
  }

  return response.json();
}

/**
 * Generate voice from text using ElevenLabs
 */
export async function generateVoice(
  text: string,
  voiceId?: string
): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/api/voice/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, voiceId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate voice');
  }

  return response.blob();
}

/**
 * Get available voices from ElevenLabs
 */
export async function getAvailableVoices() {
  const response = await fetch(`${API_BASE_URL}/api/voice/list`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch voices');
  }

  return response.json();
}

/**
 * Generate an image for an exercise or meal
 */
export async function generateImage(
  prompt: string,
  type: 'exercise' | 'meal'
): Promise<{ type: string; imageUrl?: string; description?: string }> {
  const response = await fetch(`${API_BASE_URL}/api/images/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, type }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate image');
  }

  return response.json();
}

/**
 * Get a motivational quote
 */
export async function getMotivationQuote(
  goal?: string,
  name?: string
): Promise<{ quote: string; author: string }> {
  const params = new URLSearchParams();
  if (goal) params.append('goal', goal);
  if (name) params.append('name', name);

  const response = await fetch(
    `${API_BASE_URL}/api/motivation?${params.toString()}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch motivation quote');
  }

  return response.json();
}

/**
 * Play audio from blob
 */
export function playAudio(audioBlob: Blob): HTMLAudioElement {
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
  return audio;
}

/**
 * Format plan text for voice generation
 */
export function formatPlanForVoice(
  plan: FitnessPlanResponse,
  section: 'workout' | 'diet' | 'both' = 'both'
): string {
  let text = `Hello ${plan.userDetails.name}! Here's your personalized fitness plan. `;

  if (section === 'workout' || section === 'both') {
    text += 'Starting with your workout plan. ';
    plan.workoutPlan.slice(0, 2).forEach((day) => {
      text += `${day.day}: `;
      day.exercises.slice(0, 3).forEach((exercise) => {
        text += `${exercise.name}, ${exercise.sets} sets of ${exercise.reps} with ${exercise.rest} rest. `;
      });
    });
  }

  if (section === 'diet' || section === 'both') {
    text += 'Now for your diet plan. ';
    plan.dietPlan.slice(0, 2).forEach((day) => {
      text += `${day.day}: Breakfast - ${day.meals.breakfast}. Lunch - ${day.meals.lunch}. `;
    });
  }

  text += `Remember, ${plan.aiTips.motivation}. Good luck with your fitness journey!`;

  return text;
}
