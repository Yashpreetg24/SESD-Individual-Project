const Food = require('../models/Food');

class FoodRepository {
  async create(foodData) {
    return await Food.create(foodData);
  }

  async findAll() {
    return await Food.find({});
  }

  async searchByName(name) {
    return await Food.find({ name: { $regex: name, $options: 'i' } });
  }

  async findById(id) {
    return await Food.findById(id);
  }

  async findFoodsMatchingMacros(maxCalories, maxProtein) {
    // Basic algorithmic search for suggestion
    return await Food.find({
      calories: { $lte: maxCalories },
      protein: { $lte: maxProtein }
    }).sort('-protein').limit(15); // Prioritize high protein within limits
  }
}

module.exports = new FoodRepository();
