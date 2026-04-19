const AuthService = require('../services/AuthService');
const UserRepository = require('../repositories/UserRepository');

class AuthController {
  async register(req, res) {
    try {
      const token = await AuthService.register(req.body);
      res.status(201).json({ token });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const data = await AuthService.login(email, password);
      res.json(data);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  async getProfile(req, res) {
    res.json(req.user);
  }
}

module.exports = new AuthController();
