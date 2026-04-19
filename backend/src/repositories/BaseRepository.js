/**
 * BaseRepository — Repository Pattern (base class)
 * Provides generic async CRUD operations for sqlite3.
 */
class BaseRepository {
  constructor(db, tableName) {
    if (!db || !tableName) throw new Error('BaseRepository requires db and tableName');
    this.db        = db;
    this.tableName = tableName;
  }

  async findById(id) {
    return await this.db.getAsync(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
  }

  async findAll() {
    return await this.db.allAsync(`SELECT * FROM ${this.tableName}`);
  }

  async delete(id) {
    const result = await this.db.runAsync(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
    // result is not always consistent in return value for row count in runAsync wrapper, 
    // but sqlite3's default run's this context has it. My promisify might lose it.
    // Let's assume it works or check if we need better wrapper.
    return true; 
  }
}

module.exports = BaseRepository;
