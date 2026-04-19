const MealLogRepository = require('../repositories/MealLogRepository');
const db = require('../config/database');

class AnalyticsService {
  constructor() {
    this.mealLogRepository = new MealLogRepository(db);
  }

  async getDailySummary(userId, date) {
    const target = date || new Date().toISOString().split('T')[0];
    const totals = await this.mealLogRepository.getDailyTotals(userId, target);
    return {
      date:     target,
      calories: Math.round(totals.total_calories || 0),
      protein:  Math.round((totals.total_protein || 0) * 10) / 10,
      carbs:    Math.round((totals.total_carbs || 0)   * 10) / 10,
      fat:      Math.round((totals.total_fat || 0)     * 10) / 10,
    };
  }

  async getWeeklyProgress(userId) {
    const today     = new Date();
    const endDate   = today.toISOString().split('T')[0];
    const start     = new Date(today); start.setDate(start.getDate() - 6);
    const startDate = start.toISOString().split('T')[0];

    const rows = await this.mealLogRepository.findByUserAndDateRange(userId, startDate, endDate);

    const result  = [];
    let cursor  = new Date(startDate);
    const endObj  = new Date(endDate);

    while (cursor <= endObj) {
      const ds   = cursor.toISOString().split('T')[0];
      const found = rows.find(r => r.meal_date === ds);
      result.push({
        date:     ds,
        day:      cursor.toLocaleDateString('en', { weekday: 'short' }),
        calories: found ? Math.round(found.total_calories) : 0,
        protein:  found ? Math.round(found.total_protein * 10) / 10 : 0,
        carbs:    found ? Math.round(found.total_carbs   * 10) / 10 : 0,
        fat:      found ? Math.round(found.total_fat     * 10) / 10 : 0,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    return result;
  }

  async getNutritionTrends(userId) {
    const weekly     = await this.getWeeklyProgress(userId);
    const activeDays = weekly.filter(d => d.calories > 0);
    if (activeDays.length === 0) {
      return { avgCalories: 0, avgProtein: 0, avgCarbs: 0, avgFat: 0, activeDays: 0, weekly };
    }
    const avg = (key) =>
      Math.round(activeDays.reduce((s, d) => s + d[key], 0) / activeDays.length);
    return {
      avgCalories: avg('calories'),
      avgProtein:  avg('protein'),
      avgCarbs:    avg('carbs'),
      avgFat:      avg('fat'),
      activeDays:  activeDays.length,
      weekly,
    };
  }
}

module.exports = AnalyticsService;
