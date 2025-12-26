import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FitnessPlan from '@/models/FitnessPlan';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      email,
      userDetails,
      workoutPlan,
      dietPlan,
      aiTips,
    } = body;

    if (!email || !userDetails || !workoutPlan || !dietPlan) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: userDetails.name,
        email,
        age: userDetails.age,
        gender: userDetails.gender,
        height: userDetails.height,
        weight: userDetails.weight,
        fitnessGoal: userDetails.fitnessGoal,
        fitnessLevel: userDetails.fitnessLevel,
        workoutLocation: userDetails.workoutLocation,
        dietaryPreference: userDetails.dietaryPreference,
        medicalHistory: userDetails.medicalHistory || '',
        stressLevel: userDetails.stressLevel || 'medium',
      });
    } else {
      // Update user details
      user.age = userDetails.age;
      user.gender = userDetails.gender;
      user.height = userDetails.height;
      user.weight = userDetails.weight;
      user.fitnessGoal = userDetails.fitnessGoal;
      user.fitnessLevel = userDetails.fitnessLevel;
      user.workoutLocation = userDetails.workoutLocation;
      user.dietaryPreference = userDetails.dietaryPreference;
      user.medicalHistory = userDetails.medicalHistory || '';
      user.stressLevel = userDetails.stressLevel || 'medium';
      await user.save();
    }

    // Save fitness plan
    const fitnessPlan = await FitnessPlan.create({
      userId: user._id,
      userDetails,
      workoutPlan,
      dietPlan,
      aiTips,
    });

    return NextResponse.json({
      success: true,
      planId: fitnessPlan._id,
      userId: user._id,
      message: 'Plan saved successfully',
    });
  } catch (error) {
    console.error('Error saving plan:', error);
    return NextResponse.json(
      { error: 'Failed to save plan', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
