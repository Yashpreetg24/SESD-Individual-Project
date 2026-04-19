const BaseRepository = require('./BaseRepository');
const MealLog = require('../models/MealLog');

class MealLogRepository extends BaseRepository {
  constructor(db) {
    super(db, 'meal_logs');
  }

  _joinedQuery() {
    return `
      SELECT ml.*, f.name AS food_name, f.calories, f.protein, f.carbs, f.fat, f.serving_size
      FROM meal_logs ml
      JOIN foods f ON ml.food_id = f.id
    `;
  }

  async findById(id) {
    const row = await this.db.getAsync(`${this._joinedQuery()} WHERE ml.id = ?`, [id]);
    return row ? new MealLog(row) : null;
  }

  async findByUserAndDate(userId, date) {
    const rows = await this.db.allAsync(
      `${this._joinedQuery()} WHERE ml.user_id = ? AND ml.meal_date = ? ORDER BY ml.created_at ASC`,
      [userId, date]
    );
    return rows.map(r => new MealLog(r));
  }

  async findByUserAndDateRange(userId, startDate, endDate) {
    return await this.db.allAsync(`
      SELECT
        ml.meal_date,
        ROUND(SUM(f.calories * ml.quantity / f.serving_size), 1) AS total_calories,
        ROUND(SUM(f.protein  * ml.quantity / f.serving_size), 1) AS total_protein,
        ROUND(SUM(f.carbs    * ml.quantity / f.serving_size), 1) AS total_carbs,
        ROUND(SUM(f.fat      * ml.quantity / f.serving_size), 1) AS total_fat
      FROM meal_logs ml
      JOIN foods f ON ml.food_id = f.id
      WHERE ml.user_id = ? AND ml.meal_date BETWEEN ? AND ?
      GROUP BY ml.meal_date
      ORDER BY ml.meal_date ASC
    `, [userId, startDate, endDate]);
  }

  async getDailyTotals(userId, date) {
    const row = await this.db.getAsync(`
      SELECT
        COALESCE(ROUND(SUM(f.calories * ml.quantity / f.serving_size), 1), 0) AS total_calories,
        COALESCE(ROUND(SUM(f.protein  * ml.quantity / f.serving_size), 1), 0) AS total_protein,
        COALESCE(ROUND(SUM(f.carbs    * ml.quantity / f.serving_size), 1), 0) AS total_carbs,
        COALESCE(ROUND(SUM(f.fat      * ml.quantity / f.serving_size), 1), 0) AS total_fat
      FROM meal_logs ml
      JOIN foods f ON ml.food_id = f.id
      WHERE ml.user_id = ? AND ml.meal_date = ?
    `, [userId, date]);
    return row;
  }

  async create(data) {
    const sql = `
      INSERT INTO meal_logs (user_id, food_id, meal_date, meal_type, quantity)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [data.user_id, data.food_id, data.meal_date, data.meal_type, data.quantity];

    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) return reject(err);
        resolve(this.lastID);
      });
    }).then(id => this.findById(id));
  }

  async update(id, data) {
    await this.db.runAsync(
      'UPDATE meal_logs SET meal_type = ?, quantity = ? WHERE id = ?',
      [data.meal_type, data.quantity, id]
    );
    return await this.findById(id);
  }

  async deleteByOwner(id, userId) {
    const sql = 'DELETE FROM meal_logs WHERE id = ? AND user_id = ?';
    return new Promise((resolve, reject) => {
      this.db.run(sql, [id, userId], function(err) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      });
    });
  }
}

module.exports = MealLogRepository;
