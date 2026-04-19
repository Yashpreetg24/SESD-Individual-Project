const { CalorieStrategyFactory } = require('../strategies/CalorieStrategy');

const ACTIVITY_MULTIPLIERS = {
  sedentary:   1.2,
  light:       1.375,
  moderate:    1.55,
  active:      1.725,
  very_active: 1.9,
};

class NutritionService {
  /**
   * Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation
   */
  calculateBMR(user) {
    const { weight, height, age, gender } = user;
    if (!weight || !height || !age) return 2000; // safe default
    const base = 10 * weight + 6.25 * height - 5 * age;
    return gender === 'female' ? base - 161 : base + 5;
  }

  /**
   * Calculate daily calorie & protein goals using Strategy Pattern
   */
  calculateDailyGoals(user) {
    const bmr              = this.calculateBMR(user);
    const activityMult     = ACTIVITY_MULTIPLIERS[user.activityLevel] || 1.55;
    const strategy         = CalorieStrategyFactory.getStrategy(user.goal);
    const calorieGoal      = strategy.calculate(bmr, activityMult);
    const proteinGoal      = user.weight ? strategy.getProteinTarget(user.weight) : 50;

    return {
      calorieGoal,
      proteinGoal,
      bmr:      Math.round(bmr),
      tdee:     Math.round(bmr * activityMult),
      strategy: strategy.getDescription(),
    };
  }

  /**
   * Calculate how much nutrition remains for the day
   */
  calculateRemaining(goals, consumed) {
    return {
      calories:         Math.max(0, Math.round(goals.calorieGoal - consumed.total_calories)),
      protein:          Math.max(0, Math.round((goals.proteinGoal - consumed.total_protein) * 10) / 10),
      caloriesConsumed: Math.round(consumed.total_calories),
      proteinConsumed:  Math.round(consumed.total_protein  * 10) / 10,
      carbsConsumed:    Math.round(consumed.total_carbs     * 10) / 10,
      fatConsumed:      Math.round(consumed.total_fat       * 10) / 10,
    };
  }
}

module.exports = NutritionService;
