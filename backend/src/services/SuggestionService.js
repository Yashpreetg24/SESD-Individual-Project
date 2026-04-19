const FoodRepository = require('../repositories/FoodRepository');

class SuggestionService {
  async suggestFoods(remainingCalories, remainingProtein) {
    if (remainingCalories <= 0 || remainingProtein <= 0) {
      return [];
    }
    
    // Instead of AI, we use DB query based on remaining targets
    // Fetch foods that fit within the remaining constraints
    let suggested = await FoodRepository.findFoodsMatchingMacros(remainingCalories, remainingProtein);
    
    return suggested;
  }
}

module.exports = new SuggestionService();
