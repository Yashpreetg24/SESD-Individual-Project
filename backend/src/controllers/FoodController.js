const FoodRepository = require('../repositories/FoodRepository');

class FoodController {
  async addFood(req, res) {
    try {
      const food = await FoodRepository.create(req.body);
      res.status(201).json(food);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllFoods(req, res) {
    try {
      const foods = await FoodRepository.findAll();
      res.json(foods);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async searchFoods(req, res) {
    try {
      const { query } = req.query;
      const foods = await FoodRepository.searchByName(query || '');
      res.json(foods);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new FoodController();
