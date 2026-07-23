const mongoose = require('mongoose');

const recipeIngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  unit: { type: String, default: 'unid' },
  inPantry: { type: Boolean, default: true },
});

const recipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  prepTimeMinutes: { type: Number, default: 20 },
  difficulty: { type: String, enum: ['Fácil', 'Media', 'Avanzada'], default: 'Fácil' },
  ingredients: [recipeIngredientSchema],
  steps: [{ type: String }],
  nutritionalInfo: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
  },
  healthyVariants: [{ type: String }],
  tips: [{ type: String }],
  isFavorite: { type: Boolean, default: false },
  isAiGenerated: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
