import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    fitnessGoal: {
      type: String,
      required: true,
      enum: ['weight_loss', 'muscle_gain', 'maintenance', 'endurance', 'flexibility'],
    },
    fitnessLevel: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    workoutLocation: {
      type: String,
      required: true,
      enum: ['home', 'gym', 'outdoor'],
    },
    dietaryPreference: {
      type: String,
      required: true,
      enum: ['vegetarian', 'non_vegetarian', 'vegan', 'keto'],
    },
    medicalHistory: { type: String, default: '' },
    stressLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
