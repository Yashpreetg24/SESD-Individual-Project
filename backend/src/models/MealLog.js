const mongoose = require('mongoose');

const mealLogSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  food_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  meal_date: { type: Date, default: Date.now },
  meal_type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
  quantity: { type: Number, required: true, default: 1 },
});

module.exports = mongoose.model('MealLog', mealLogSchema);
