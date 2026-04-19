const FoodService = require('../services/FoodService');

class FoodController {
  constructor() {
    this.foodService    = new FoodService();
    this.searchFoods    = this.searchFoods.bind(this);
    this.getFoodById    = this.getFoodById.bind(this);
    this.addCustomFood  = this.addCustomFood.bind(this);
  }

  async searchFoods(req, res) {
    try {
      const foods = await this.foodService.searchFoods(req.query.q, req.userId);
      res.json(foods.map(f => f.toJSON()));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getFoodById(req, res) {
    try {
      const food = await this.foodService.getFoodById(parseInt(req.params.id));
      res.json(food.toJSON());
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  async addCustomFood(req, res) {
    try {
      const food = await this.foodService.addCustomFood(req.body, req.userId);
      res.status(201).json(food.toJSON());
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = FoodController;
