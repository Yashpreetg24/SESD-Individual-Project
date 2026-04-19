const BaseRepository = require('./BaseRepository');
const User = require('../models/User');

class UserRepository extends BaseRepository {
  constructor(db) {
    super(db, 'users');
  }

  async findById(id) {
    const row = await this.db.getAsync('SELECT * FROM users WHERE id = ?', [id]);
    return row ? new User(row) : null;
  }

  async findByEmail(email) {
    const row = await this.db.getAsync('SELECT * FROM users WHERE email = ?', [email]);
    return row ? new User(row) : null;
  }

  async create(data) {
    const sql = `
      INSERT INTO users (name, email, password, age, height, weight, goal, gender, activity_level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.name, data.email, data.password, data.age, data.height, 
      data.weight, data.goal, data.gender, data.activity_level
    ];
    
    // We need the lastID. sqlite3 run() callback has this.lastID.
    // Our runAsync wrapper needs to be tweaked to return the whole context if possible,
    // or we just use a helper.
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) return reject(err);
        // 'this' has lastID
        const repo = new UserRepository(this.db); // This is tricky because 'this' is the statement context
        // Let's just use the ID we got
        resolve(this.lastID);
      });
    }).then(id => this.findById(id));
  }

  async update(id, data) {
    const allowed = ['name', 'age', 'height', 'weight', 'goal', 'gender', 'activity_level'];
    const fields  = [];
    const values  = [];
    for (const key of allowed) {
      if (data[key] !== undefined && data[key] !== null) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }
    if (fields.length === 0) return await this.findById(id);
    values.push(id);
    await this.db.runAsync(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    return await this.findById(id);
  }

  async updatePassword(id, hashedPassword) {
    await this.db.runAsync('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
  }
}

module.exports = UserRepository;
