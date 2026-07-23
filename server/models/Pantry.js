const mongoose = require('mongoose');

const pantryItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, default: 'General' }, // Proteínas, Verduras, Frutas, Lácteos, Granos, Especias, etc.
  quantity: { type: Number, required: true, default: 1 },
  unit: { type: String, default: 'unid' }, // unid, kg, g, ml, l
  updatedAt: { type: Date, default: Date.now }
});

const pantrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [pantryItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('Pantry', pantrySchema);
