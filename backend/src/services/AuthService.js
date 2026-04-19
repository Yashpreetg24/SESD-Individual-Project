const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserRepository = require('../repositories/UserRepository');

class AuthService {
  async register(userData) {
    const { name, email, password, age, height, weight, goal } = userData;
    
    let user = await UserRepository.findByEmail(email);
    if (user) {
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await UserRepository.create({
      name,
      email,
      password: hashedPassword,
      age,
      height,
      weight,
      goal,
    });

    return this.generateToken(user._id);
  }

  async login(email, password) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    return { token: this.generateToken(user._id), userId: user._id };
  }

  generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: '30d',
    });
  }
}

module.exports = new AuthService();
