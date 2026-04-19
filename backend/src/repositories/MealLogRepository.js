const MealLog = require('../models/MealLog');

class MealLogRepository {
  async create(logData) {
    const log = await MealLog.create(logData);
    return await log.populate('food_id');
  }

  async findByUserAndDate(userId, dateStart, dateEnd) {
    return await MealLog.find({
      user_id: userId,
      meal_date: {
        $gte: dateStart,
        $lt: dateEnd
      }
    }).populate('food_id');
  }

  async delete(id, userId) {
    return await MealLog.findOneAndDelete({ _id: id, user_id: userId });
  }
}

module.exports = new MealLogRepository();
