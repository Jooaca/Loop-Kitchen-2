const mongoose = require('mongoose');

const groceryItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, default: 'General' },
  quantity: { type: Number, required: true, default: 1 },
  unit: { type: String, default: 'unid' },
  isBought: { type: Boolean, default: false },
  sourceMealPlan: { type: String, default: 'Manual' },
});

const groceryListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    default: 'Lista de Compras Semanal',
  },
  items: [groceryItemSchema],
  aiOptimizationNote: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active',
  },
}, { timestamps: true });

module.exports = mongoose.model('GroceryList', groceryListSchema);
