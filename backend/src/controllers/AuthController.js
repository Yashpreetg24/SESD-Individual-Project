const AuthService = require('../services/AuthService');

class AuthController {
  constructor() {
    this.authService = new AuthService();
    this.register = this.register.bind(this);
    this.login    = this.login.bind(this);
    this.logout   = this.logout.bind(this);
  }

  async register(req, res) {
    try {
      const { name, email, password, age, height, weight, goal, gender, activityLevel } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }
      const result = await this.authService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      const result = await this.authService.login(req.body);
      res.json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }

  logout(req, res) {
    res.json({ message: 'Logged out successfully' });
  }
}

module.exports = AuthController;
