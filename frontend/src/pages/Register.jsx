import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', age: '', height: '', weight: '',
    goal: 'maintenance', gender: 'male', activityLevel: 'moderate'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        ...formData,
        age: parseInt(formData.age),
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight)
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center min-h-screen bg-bg-dark py-12 px-4">
      <div className="glass p-8 rounded-2xl w-full max-w-2xl animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">Create Account</h1>
          <p className="text-text-muted mt-2">Start your personalized nutrition journey</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="form-label">Full Name</label>
            <input name="name" className="form-input" placeholder="John Doe" onChange={handleChange} required />
          </div>
          <div>
            <label className="form-label">Email Address</label>
            <input name="email" type="email" className="form-input" placeholder="john@example.com" onChange={handleChange} required />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-input" placeholder="••••••••" onChange={handleChange} required />
          </div>

          <div className="border-t border-border md:col-span-2 my-2"></div>

          <div>
            <label className="form-label">Age</label>
            <input name="age" type="number" className="form-input" placeholder="25" onChange={handleChange} required />
          </div>
          <div>
            <label className="form-label">Gender</label>
            <select name="gender" className="form-input" onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="form-label">Height (cm)</label>
            <input name="height" type="number" step="0.1" className="form-input" placeholder="175" onChange={handleChange} required />
          </div>
          <div>
            <label className="form-label">Weight (kg)</label>
            <input name="weight" type="number" step="0.1" className="form-input" placeholder="70" onChange={handleChange} required />
          </div>
          <div>
            <label className="form-label">Fitness Goal</label>
            <select name="goal" className="form-input" onChange={handleChange}>
              <option value="weight_loss">Weight Loss</option>
              <option value="maintenance">Maintenance</option>
              <option value="muscle_gain">Muscle Gain</option>
            </select>
          </div>
          <div>
            <label className="form-label">Activity Level</label>
            <select name="activityLevel" className="form-input" onChange={handleChange}>
              <option value="sedentary">Sedentary</option>
              <option value="light">Lightly Active</option>
              <option value="moderate">Moderately Active</option>
              <option value="active">Very Active</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary md:col-span-2 mt-4" disabled={loading}>
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <p className="text-center text-text-muted mt-8 text-sm">
          Already have an account? <Link to="/login" className="text-primary font-semibold no-underline ml-1">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
