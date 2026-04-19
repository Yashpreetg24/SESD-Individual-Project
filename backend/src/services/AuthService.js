const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
const db = require('../config/database');

class AuthService {
  constructor() {
    this.userRepository = new UserRepository(db);
  }

  async register({ name, email, password, age, height, weight, goal, gender, activityLevel }) {
    const existing = this.userRepository.findByEmail(email);
    if (existing) throw new Error('Email is already registered');

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      age:            age            || null,
      height:         height         || null,
      weight:         weight         || null,
      goal:           goal           || 'maintenance',
      gender:         gender         || 'male',
      activity_level: activityLevel  || 'moderate',
    });

    const token = this._generateToken(user.id);
    return { user: user.toJSON(), token };
  }

  async login({ email, password }) {
    const user = this.userRepository.findByEmail(email);
    if (!user) throw new Error('Invalid email or password');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid email or password');

    const token = this._generateToken(user.id);
    return { user: user.toJSON(), token };
  }

  _generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  }
}

module.exports = AuthService;
