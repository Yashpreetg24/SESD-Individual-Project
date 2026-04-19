import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', age: '', height: '', weight: '', goal: 'maintain'
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px' }}>
      <div className="card my-4">
        <h2 className="text-center mb-4">Create Account</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group"><label>Name</label>
          <input required onChange={e => setFormData({...formData, name: e.target.value})} /></div>
          
          <div className="form-group"><label>Email</label>
          <input type="email" required onChange={e => setFormData({...formData, email: e.target.value})} /></div>
          
          <div className="form-group"><label>Password</label>
          <input type="password" required onChange={e => setFormData({...formData, password: e.target.value})} /></div>
          
          <div className="flex gap-4">
            <div className="form-group" style={{flex: 1}}><label>Age</label>
            <input type="number" required onChange={e => setFormData({...formData, age: e.target.value})} /></div>
            
            <div className="form-group" style={{flex: 1}}><label>Height (cm)</label>
            <input type="number" required onChange={e => setFormData({...formData, height: e.target.value})} /></div>
            
            <div className="form-group" style={{flex: 1}}><label>Weight (kg)</label>
            <input type="number" required onChange={e => setFormData({...formData, weight: e.target.value})} /></div>
          </div>

          <div className="form-group"><label>Goal</label>
            <select onChange={e => setFormData({...formData, goal: e.target.value})} value={formData.goal}>
              <option value="gain">Gain Weight</option>
              <option value="maintain">Maintain Weight</option>
              <option value="lose">Lose Weight</option>
            </select>
          </div>
          
          <button type="submit" className="btn mt-4">Register</button>
        </form>
        <p className="text-center mt-4">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
