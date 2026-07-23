const mongoose = require('mongoose');

const mealItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  prepTimeMinutes: { type: Number, default: 25 },
  ingredients: [{
    name: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unit: { type: String, default: 'unid' },
    category: { type: String, default: 'General' }
  }],
  nutritionalInfo: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 }
  },
  healthyTip: { type: String, default: '' }
});

const dayPlanSchema = new mongoose.Schema({
  dayName: { type: String, required: true }, // Lunes, Martes...
  breakfast: mealItemSchema,
  lunch: mealItemSchema,
  snack: mealItemSchema,
  dinner: mealItemSchema
});

const mealPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'Plan Semanal Personalizado'
  },
  preferencesSnapshot: {
    householdSize: Number,
    weeklyBudget: Number,
    dietaryRestrictions: [String],
    allergies: [String],
    mainGoal: String
  },
  days: [dayPlanSchema],
  isFavorite: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('MealPlan', mealPlanSchema);
