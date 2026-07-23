const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es obligatorio'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: 6,
  },
  preferences: {
    householdSize: { type: Number, default: 2 },
    weeklyBudget: { type: Number, default: 150 },
    cookingDays: { type: [String], default: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] },
    maxPrepTime: { type: Number, default: 45 },
    dietaryRestrictions: { type: [String], default: [] }, // Vegetariano, Vegano, Celíaco, Keto, etc.
    allergies: { type: [String], default: [] }, // Maní, Lactosa, Mariscos, etc.
    likedFoods: { type: [String], default: [] },
    dislikedFoods: { type: [String], default: [] },
    mainGoal: { type: String, default: 'Comer saludable y ahorrar tiempo' },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
