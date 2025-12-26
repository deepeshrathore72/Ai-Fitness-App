import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with default values
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      age: 25, // Default values
      gender: 'male',
      height: 170,
      weight: 70,
      fitnessGoal: 'maintenance',
      fitnessLevel: 'beginner',
      workoutLocation: 'home',
      dietaryPreference: 'vegetarian',
      medicalHistory: '',
      stressLevel: 'medium',
    });

    return NextResponse.json({
      success: true,
      userId: user._id,
      name: user.name,
      email: user.email,
      message: 'Account created successfully',
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create account', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
