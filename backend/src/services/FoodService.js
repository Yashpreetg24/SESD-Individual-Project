const FoodRepository = require('../repositories/FoodRepository');
const db = require('../config/database');

class FoodService {
  constructor() {
    this.foodRepository = new FoodRepository(db);
  }

  async searchFoods(query, userId) {
    if (!query || query.trim() === '') {
      return await this.foodRepository.findAll(userId);
    }
    return await this.foodRepository.search(query.trim(), userId);
  }

  async getFoodById(id) {
    const food = await this.foodRepository.findById(id);
    if (!food) throw new Error('Food not found');
    return food;
  }

  async addCustomFood(data, userId) {
    if (!data.name || !data.calories || !data.protein) {
      throw new Error('name, calories, and protein are required');
    }
    return await this.foodRepository.create({
      name:         data.name,
      calories:     parseFloat(data.calories),
      protein:      parseFloat(data.protein),
      carbs:        parseFloat(data.carbs)       || 0,
      fat:          parseFloat(data.fat)         || 0,
      serving_size: parseFloat(data.servingSize) || 100,
      serving_unit: data.servingUnit             || 'g',
      is_custom:    1,
      user_id:      userId,
    });
  }
}

module.exports = FoodService;
