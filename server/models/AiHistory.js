const mongoose = require('mongoose');

const aiHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  actionType: {
    type: String,
    enum: ['SMART_RECIPES', 'CART_OPTIMIZER', 'WEEKLY_PLANNER'],
    required: true,
  },
  promptInput: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  aiResponse: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('AiHistory', aiHistorySchema);
