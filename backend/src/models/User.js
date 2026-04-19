/**
 * User Model — Encapsulates user data with OOP
 */
class User {
  constructor({ id, name, email, password, age, height, weight, goal, gender, activity_level, created_at }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.age = age;
    this.height = height;
    this.weight = weight;
    this.goal = goal || 'maintenance';
    this.gender = gender || 'male';
    this.activityLevel = activity_level || 'moderate';
    this.createdAt = created_at;
  }

  /** Return safe public representation (no password) */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      age: this.age,
      height: this.height,
      weight: this.weight,
      goal: this.goal,
      gender: this.gender,
      activityLevel: this.activityLevel,
      createdAt: this.createdAt,
    };
  }
}

module.exports = User;
