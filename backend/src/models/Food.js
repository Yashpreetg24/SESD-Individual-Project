const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
});

module.exports = mongoose.model('Food', foodSchema);
