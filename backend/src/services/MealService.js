const MealLogRepository = require('../repositories/MealLogRepository');
const FoodRepository    = require('../repositories/FoodRepository');
const db = require('../config/database');

class MealService {
  constructor() {
    this.mealLogRepository = new MealLogRepository(db);
    this.foodRepository    = new FoodRepository(db);
  }

  _today() {
    return new Date().toISOString().split('T')[0];
  }

  async getDailyLog(userId, date) {
    const targetDate = date || this._today();
    const logs = await this.mealLogRepository.findByUserAndDate(userId, targetDate);
    const grouped = { breakfast: [], lunch: [], dinner: [], snacks: [] };
    for (const log of logs) {
      if (!grouped[log.mealType]) grouped[log.mealType] = [];
      grouped[log.mealType].push(log.toJSON());
    }
    return grouped;
  }

  async getDailyTotals(userId, date) {
    return await this.mealLogRepository.getDailyTotals(userId, date || this._today());
  }

  async logMeal(userId, foodId, mealType, quantity, date) {
    const food = await this.foodRepository.findById(foodId);
    if (!food) throw new Error('Food not found');

    const validTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];
    if (!validTypes.includes(mealType)) throw new Error('Invalid meal type');

    return await this.mealLogRepository.create({
      user_id:   userId,
      food_id:   foodId,
      meal_date: date || this._today(),
      meal_type: mealType,
      quantity:  parseFloat(quantity),
    });
  }

  async editMeal(mealId, userId, mealType, quantity) {
    const meal = await this.mealLogRepository.findById(mealId);
    if (!meal)              throw new Error('Meal entry not found');
    if (meal.userId !== userId) throw new Error('Unauthorized');

    return await this.mealLogRepository.update(mealId, {
      meal_type: mealType,
      quantity:  parseFloat(quantity),
    });
  }

  async deleteMeal(mealId, userId) {
    const deleted = await this.mealLogRepository.deleteByOwner(mealId, userId);
    if (!deleted) throw new Error('Meal entry not found or you are not authorized');
    return true;
  }
}

module.exports = MealService;
