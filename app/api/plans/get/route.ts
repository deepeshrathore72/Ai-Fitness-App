import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FitnessPlan from '@/models/FitnessPlan';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const planId = searchParams.get('planId');

    if (!email && !planId) {
      return NextResponse.json(
        { error: 'Email or planId is required' },
        { status: 400 }
      );
    }

    // Get specific plan by ID
    if (planId) {
      const plan = await FitnessPlan.findById(planId);
      if (!plan) {
        return NextResponse.json(
          { error: 'Plan not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(plan);
    }

    // Get all plans for a user by email
    if (email) {
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      const plans = await FitnessPlan.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .limit(10);

      return NextResponse.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        plans,
      });
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plans', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
