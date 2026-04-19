const BaseRepository = require('./BaseRepository');
const Food = require('../models/Food');

class FoodRepository extends BaseRepository {
  constructor(db) {
    super(db, 'foods');
  }

  async findById(id) {
    const row = await this.db.getAsync('SELECT * FROM foods WHERE id = ?', [id]);
    return row ? new Food(row) : null;
  }

  async search(query, userId) {
    const rows = await this.db.allAsync(`
      SELECT * FROM foods
      WHERE name LIKE ? AND (is_custom = 0 OR user_id = ?)
      ORDER BY is_custom ASC, name ASC
      LIMIT 25
    `, [`%${query}%`, userId]);
    return rows.map(r => new Food(r));
  }

  async findAll(userId) {
    const rows = await this.db.allAsync(`
      SELECT * FROM foods
      WHERE is_custom = 0 OR user_id = ?
      ORDER BY name ASC
      LIMIT 50
    `, [userId]);
    return rows.map(r => new Food(r));
  }

  async findAllPublic() {
    const rows = await this.db.allAsync('SELECT * FROM foods WHERE is_custom = 0');
    return rows.map(r => new Food(r));
  }

  async create(data) {
    const sql = `
      INSERT INTO foods (name, calories, protein, carbs, fat, serving_size, serving_unit, is_custom, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.name, data.calories, data.protein, data.carbs, data.fat, 
      data.serving_size, data.serving_unit, data.is_custom, data.user_id
    ];

    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) return reject(err);
        resolve(this.lastID);
      });
    }).then(id => this.findById(id));
  }
}

module.exports = FoodRepository;
