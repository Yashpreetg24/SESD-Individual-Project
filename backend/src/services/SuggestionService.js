const FoodRepository = require('../repositories/FoodRepository');
const db = require('../config/database');

class SuggestionService {
  constructor() {
    this.foodRepository = new FoodRepository(db);
  }

  /**
   * Suggest foods based on remaining calorie & protein targets.
   */
  async suggestFoods(remainingCalories, remainingProtein) {
    if (remainingCalories <= 0 && remainingProtein <= 0) return [];

    const allFoods = await this.foodRepository.findAllPublic();

    const scored = allFoods.map(food => {
      let score = 0;

      // Calorie fit
      if (food.calories <= remainingCalories) {
        score += 3;
      } else if (food.calories <= remainingCalories * 1.2) {
        score += 1;
      } else if (food.calories > remainingCalories * 1.5) {
        score -= 2;
      }

      // Protein density bonus
      if (remainingProtein > 5) {
        const proteinDensity = food.protein / (food.calories || 1);
        score += proteinDensity * 80;
      }

      return { ...food.toJSON(), score };
    });

    return scored
      .filter(f => f.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }
}

module.exports = SuggestionService;
