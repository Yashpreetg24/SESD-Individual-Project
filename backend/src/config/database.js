const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { promisify } = require('util');

/**
 * DatabaseConnection — Singleton Pattern using sqlite3
 */
class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    
    const dbPath = path.join(__dirname, '../../diet_planner.db');
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Could not connect to database', err);
      } else {
        console.log('✅ Connected to SQLite database');
        this._initialize();
      }
    });

    // Promisify common methods for easier use in repositories
    this.db.runAsync = promisify(this.db.run.bind(this.db));
    this.db.getAsync = promisify(this.db.get.bind(this.db));
    this.db.allAsync = promisify(this.db.all.bind(this.db));

    DatabaseConnection.instance = this;
  }

  async _initialize() {
    try {
      await this.db.runAsync(`
        CREATE TABLE IF NOT EXISTS users (
          id              INTEGER PRIMARY KEY AUTOINCREMENT,
          name            TEXT    NOT NULL,
          email           TEXT    UNIQUE NOT NULL,
          password        TEXT    NOT NULL,
          age             INTEGER,
          height          REAL,
          weight          REAL,
          goal            TEXT    DEFAULT 'maintenance',
          gender          TEXT    DEFAULT 'male',
          activity_level  TEXT    DEFAULT 'moderate',
          created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await this.db.runAsync(`
        CREATE TABLE IF NOT EXISTS foods (
          id            INTEGER PRIMARY KEY AUTOINCREMENT,
          name          TEXT  NOT NULL,
          calories      REAL  NOT NULL,
          protein       REAL  NOT NULL,
          carbs         REAL  DEFAULT 0,
          fat           REAL  DEFAULT 0,
          serving_size  REAL  DEFAULT 100,
          serving_unit  TEXT  DEFAULT 'g',
          is_custom     INTEGER DEFAULT 0,
          user_id       INTEGER,
          created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      await this.db.runAsync(`
        CREATE TABLE IF NOT EXISTS meal_logs (
          id          INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id     INTEGER NOT NULL,
          food_id     INTEGER NOT NULL,
          meal_date   TEXT    NOT NULL,
          meal_type   TEXT    NOT NULL CHECK(meal_type IN ('breakfast','lunch','dinner','snacks')),
          quantity    REAL    NOT NULL DEFAULT 1,
          created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (food_id) REFERENCES foods(id)
        )
      `);

      const count = await this.db.getAsync('SELECT COUNT(*) as c FROM foods');
      if (count.c === 0) {
        await this._seedFoods();
      }
    } catch (err) {
      console.error('❌ Database initialization failed', err);
    }
  }

  async _seedFoods() {
    const foods = [
      ['Chicken Breast',      165, 31.0,  0.0,  3.6, 100, 'g'],
      ['Brown Rice',          216,  5.0, 45.0,  1.8, 100, 'g'],
      ['Eggs (Whole)',        155, 13.0,  1.1, 11.0, 100, 'g'],
      ['Oats',                389, 17.0, 66.0,  7.0, 100, 'g'],
      ['Banana',               89,  1.1, 23.0,  0.3, 100, 'g'],
      ['Broccoli',             55,  3.7, 11.0,  0.6, 100, 'g'],
      ['Greek Yogurt',        100, 17.0,  3.6,  0.7, 100, 'g'],
      ['Almonds',             579, 21.0, 22.0, 50.0, 100, 'g'],
      ['Salmon',              208, 20.0,  0.0, 13.0, 100, 'g'],
      ['Sweet Potato',         86,  1.6, 20.0,  0.1, 100, 'g'],
      ['Whole Milk',           61,  3.2,  4.8,  3.3, 100, 'ml'],
      ['Paneer',              265, 18.0,  2.7, 20.0, 100, 'g'],
      ['Dal (Lentils)',       116,  9.0, 20.0,  0.4, 100, 'g'],
      ['Wheat Roti',          297, 10.6, 57.0,  1.7, 100, 'g'],
      ['White Rice',          130,  2.7, 28.0,  0.3, 100, 'g'],
      ['Apple',                52,  0.3, 14.0,  0.2, 100, 'g'],
      ['Peanut Butter',       588, 25.0, 20.0, 50.0, 100, 'g'],
      ['Cottage Cheese',      206, 25.0,  3.4,  9.0, 100, 'g'],
      ['Tuna (Canned)',       116, 26.0,  0.0,  1.0, 100, 'g'],
      ['Spinach',              23,  2.9,  3.6,  0.4, 100, 'g'],
      ['Quinoa',              368, 14.0, 64.0,  6.0, 100, 'g'],
      ['Potato',               77,  2.0, 17.0,  0.1, 100, 'g'],
      ['Curd / Yogurt',        61,  3.5,  4.7,  3.3, 100, 'g'],
      ['Orange',               47,  0.9, 12.0,  0.1, 100, 'g'],
      ['Whole Wheat Bread',   247, 13.0, 41.0,  4.2, 100, 'g'],
      ['Protein Whey (Scoop)',120, 24.0,  3.0,  1.5,  30, 'g'],
      ['Avocado',             160,  2.0,  9.0, 15.0, 100, 'g'],
      ['Tofu',                 76,  8.0,  2.0,  4.8, 100, 'g'],
      ['Chickpeas',           164,  8.9, 27.0,  2.6, 100, 'g'],
    ];

    for (const food of foods) {
      await this.db.runAsync(
        `INSERT INTO foods (name, calories, protein, carbs, fat, serving_size, serving_unit)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        food
      );
    }
    console.log(`✅ Seeded ${foods.length} food items`);
  }

  getDb() {
    return this.db;
  }
}

const instance = new DatabaseConnection();
module.exports = instance.getDb();
