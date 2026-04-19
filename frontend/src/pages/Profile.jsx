import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        setProfile(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/profile', formData);
      setProfile(res.data);
      setUser(res.data);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  if (loading) return <div className="flex-center h-[80vh]"><div className="loader"></div></div>;

  const { goals } = profile;

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Personal Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Metrics & Calculation */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">Personal Metrics</h3>
              {!editing && <button onClick={() => setEditing(true)} className="btn btn-outline text-xs">Edit Metrics</button>}
            </div>

            {editing ? (
              <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input type="number" className="form-input" value={formData.age || ''} onChange={(e) => setFormData({...formData, age: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Height (cm)</label>
                  <input type="number" className="form-input" value={formData.height || ''} onChange={(e) => setFormData({...formData, height: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Weight (kg)</label>
                  <input type="number" className="form-input" value={formData.weight || ''} onChange={(e) => setFormData({...formData, weight: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Fitness Goal</label>
                  <select className="form-input" value={formData.goal || ''} onChange={(e) => setFormData({...formData, goal: e.target.value})}>
                    <option value="weight_loss">Weight Loss</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="muscle_gain">Muscle Gain</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Activity Level</label>
                  <select className="form-input" value={formData.activityLevel || ''} onChange={(e) => setFormData({...formData, activityLevel: e.target.value})}>
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Lightly Active</option>
                    <option value="moderate">Moderately Active</option>
                    <option value="active">Very Active</option>
                    <option value="very_active">Extremely Active</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex gap-4 mt-4">
                  <button type="submit" className="btn btn-primary flex-grow">Save Changes</button>
                  <button type="button" onClick={() => { setEditing(false); setFormData(profile); }} className="btn btn-outline">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <MetricDisplay label="Age" value={`${profile.age} yrs`} />
                <MetricDisplay label="Height" value={`${profile.height} cm`} />
                <MetricDisplay label="Weight" value={`${profile.weight} kg`} />
                <MetricDisplay label="Gender" value={profile.gender} />
                <div className="md:col-span-2">
                   <MetricDisplay label="Activity Level" value={profile.activityLevel.replace('_', ' ')} />
                </div>
                <div className="md:col-span-2">
                   <MetricDisplay label="Primary Goal" value={profile.goal.replace('_', ' ')} />
                </div>
              </div>
            )}
          </div>

          <div className="glass-card bg-primary/5 border-primary/20">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
               🔬 Goal Calculations
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <CalculationItem label="BMR" value={goals.bmr} unit="kcal/day" desc="Basal Metabolic Rate" />
               <CalculationItem label="TDEE" value={goals.tdee} unit="kcal/day" desc="Total Daily Expenditure" />
               <CalculationItem label="Strategy" value={goals.strategy.split(' ')[0]} unit="" desc={goals.strategy.includes('(') ? goals.strategy.split('(')[1].replace(')', '') : ''} />
             </div>
          </div>
        </div>

        {/* Goal Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card h-full bg-gradient-to-br from-indigo-500/10 to-primary/10">
            <h3 className="text-xl font-bold mb-8">Daily Target</h3>
            <div className="space-y-8">
              <GoalRow label="Daily Calories" value={goals.calorieGoal} unit="kcal" color="var(--primary)" />
              <GoalRow label="Daily Protein" value={goals.proteinGoal} unit="g" color="var(--secondary)" />
              
              <div className="pt-8 border-t border-border">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Account Security</h4>
                <button className="btn btn-outline w-full text-xs" onClick={() => alert('Change password feature coming soon!')}>Change Password</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricDisplay = ({ label, value }) => (
  <div>
    <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1">{label}</p>
    <p className="text-xl font-bold capitalize">{value}</p>
  </div>
);

const CalculationItem = ({ label, value, unit, desc }) => (
  <div className="text-center md:text-left">
    <div className="flex items-baseline gap-1 justify-center md:justify-start">
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-xs text-text-muted">{unit}</span>
    </div>
    <p className="text-xs font-bold uppercase tracking-tighter text-primary">{label}</p>
    <p className="text-[10px] text-text-muted mt-1">{desc}</p>
  </div>
);

const GoalRow = ({ label, value, unit, color }) => (
  <div className="flex items-center gap-4">
    <div className="w-1.5 h-12 rounded-full" style={{ backgroundColor: color }}></div>
    <div>
      <p className="text-xs text-text-muted uppercase font-bold tracking-widest">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-extrabold">{value}</span>
        <span className="text-sm font-medium opacity-60">{unit}</span>
      </div>
    </div>
  </div>
);

export default Profile;
