import mongoose from 'mongoose';

const WorkoutPlanSchema = new mongoose.Schema({
  day: { type: String, required: true },
  exercises: [
    {
      name: { type: String, required: true },
      sets: { type: Number, required: true },
      reps: { type: String, required: true },
      rest: { type: String, required: true },
      notes: { type: String, default: '' },
    },
  ],
});

const DietPlanSchema = new mongoose.Schema({
  day: { type: String, required: true },
  meals: {
    breakfast: { type: String, required: true },
    lunch: { type: String, required: true },
    dinner: { type: String, required: true },
    snacks: { type: String, required: true },
  },
  calories: { type: Number, required: true },
});

const FitnessPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userDetails: {
      name: { type: String, required: true },
      age: { type: Number, required: true },
      gender: { type: String, required: true },
      height: { type: Number, required: true },
      weight: { type: Number, required: true },
      fitnessGoal: { type: String, required: true },
      fitnessLevel: { type: String, required: true },
      workoutLocation: { type: String, required: true },
      dietaryPreference: { type: String, required: true },
      medicalHistory: { type: String, default: '' },
      stressLevel: { type: String, default: 'medium' },
    },
    workoutPlan: [WorkoutPlanSchema],
    dietPlan: [DietPlanSchema],
    aiTips: {
      lifestyle: [{ type: String }],
      posture: [{ type: String }],
      motivation: { type: String },
    },
    generatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.FitnessPlan ||
  mongoose.model('FitnessPlan', FitnessPlanSchema);
