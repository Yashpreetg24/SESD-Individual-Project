class NutritionService {
  /**
   * Calculates Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
   * Assumes a general multiplier for daily activity
   */
  calculateDailyCalories(user) {
    // Basic approximation (male formula used as default simplification, normally requires gender)
    // BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age(y) + 5
    let bmr = (10 * user.weight) + (6.25 * user.height) - (5 * user.age) + 5;
    
    // Activity multiplier (assuming sedentary to light activity = 1.3)
    let tdee = bmr * 1.3;

    if (user.goal === 'lose') {
      return tdee - 500;
    } else if (user.goal === 'gain') {
      return tdee + 500;
    }
    return tdee; // maintain
  }

  calculateDailyProtein(user) {
    // General rule: 1.6g to 2.2g per kg of body weight for active/goals
    if (user.goal === 'lose') {
      return user.weight * 2.0; // Higher protein to preserve muscle
    } else if (user.goal === 'gain') {
      return user.weight * 1.8;
    }
    return user.weight * 1.6;
  }

  calculateRemainingNutrition(user, mealLogs) {
    const targetCalories = this.calculateDailyCalories(user);
    const targetProtein = this.calculateDailyProtein(user);

    let consumedCalories = 0;
    let consumedProtein = 0;

    mealLogs.forEach(log => {
      // log.food_id should be populated
      if (log.food_id) {
        consumedCalories += (log.food_id.calories * log.quantity);
        consumedProtein += (log.food_id.protein * log.quantity);
      }
    });

    return {
      targetCalories,
      targetProtein,
      consumedCalories,
      consumedProtein,
      remainingCalories: Math.max(0, targetCalories - consumedCalories),
      remainingProtein: Math.max(0, targetProtein - consumedProtein)
    };
  }
}

module.exports = new NutritionService();
