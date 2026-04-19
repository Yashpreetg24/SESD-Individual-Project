/**
 * MealLog Model — Represents a logged meal entry (joined with food data)
 */
class MealLog {
  constructor({
    id, user_id, food_id, meal_date, meal_type, quantity, created_at,
    food_name, calories, protein, carbs, fat, serving_size,
  }) {
    this.id        = id;
    this.userId    = user_id;
    this.foodId    = food_id;
    this.mealDate  = meal_date;
    this.mealType  = meal_type;
    this.quantity  = quantity;
    this.createdAt = created_at;
    // Joined food data
    this.foodName   = food_name;
    this.calories   = calories;
    this.protein    = protein;
    this.carbs      = carbs  || 0;
    this.fat        = fat    || 0;
    this.servingSize = serving_size || 100;
  }

  /** Calculate actual nutrition consumed based on quantity logged */
  getConsumedNutrition() {
    const ratio = this.quantity / this.servingSize;
    return {
      calories: Math.round(this.calories * ratio * 10) / 10,
      protein:  Math.round(this.protein  * ratio * 10) / 10,
      carbs:    Math.round(this.carbs    * ratio * 10) / 10,
      fat:      Math.round(this.fat      * ratio * 10) / 10,
    };
  }

  toJSON() {
    const nutrition = this.getConsumedNutrition();
    return {
      id:          this.id,
      foodId:      this.foodId,
      foodName:    this.foodName,
      mealDate:    this.mealDate,
      mealType:    this.mealType,
      quantity:    this.quantity,
      servingSize: this.servingSize,
      ...nutrition,
    };
  }
}

module.exports = MealLog;
