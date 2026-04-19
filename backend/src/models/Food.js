/**
 * Food Model — Represents a food item with calculated nutrition
 */
class Food {
  constructor({ id, name, calories, protein, carbs, fat, serving_size, serving_unit, is_custom, user_id, created_at }) {
    this.id = id;
    this.name = name;
    this.calories = calories;
    this.protein = protein;
    this.carbs = carbs || 0;
    this.fat = fat || 0;
    this.servingSize = serving_size || 100;
    this.servingUnit = serving_unit || 'g';
    this.isCustom = Boolean(is_custom);
    this.userId = user_id || null;
    this.createdAt = created_at;
  }

  /** Calculate nutrition for a given quantity */
  getNutritionForQuantity(quantity) {
    const ratio = quantity / this.servingSize;
    return {
      calories: Math.round(this.calories * ratio * 10) / 10,
      protein:  Math.round(this.protein  * ratio * 10) / 10,
      carbs:    Math.round(this.carbs    * ratio * 10) / 10,
      fat:      Math.round(this.fat      * ratio * 10) / 10,
    };
  }

  toJSON() {
    return {
      id:          this.id,
      name:        this.name,
      calories:    this.calories,
      protein:     this.protein,
      carbs:       this.carbs,
      fat:         this.fat,
      servingSize: this.servingSize,
      servingUnit: this.servingUnit,
      isCustom:    this.isCustom,
    };
  }
}

module.exports = Food;
