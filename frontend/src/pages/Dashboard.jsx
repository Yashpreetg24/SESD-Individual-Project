import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import CircularProgress from '../components/CircularProgress';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/suggestions');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex-center h-[80vh]"><div className="loader"></div></div>;

  const { remaining, suggestions } = data || {};
  const goals = remaining?.goals || { calorieGoal: 2000, proteinGoal: 150 };
  const consumed = remaining || { caloriesConsumed: 0, proteinConsumed: 0, carbsConsumed: 0, fatConsumed: 0 };

  return (
    <div className="container py-8 animate-fade-in">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">Today's Overview</h1>
        <p className="text-text-muted mt-1">Keep track of your daily nutrition targets</p>
      </header>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 glass-card flex flex-col md:flex-row items-center justify-around py-10 gap-8">
          <CircularProgress 
            value={consumed.caloriesConsumed} 
            max={goals.calorieGoal} 
            label="Calories" 
            color="#4ade80" 
          />
          <CircularProgress 
            value={consumed.proteinConsumed} 
            max={goals.proteinGoal} 
            label="Protein (g)" 
            color="#6366f1" 
          />
          <div className="flex flex-col gap-4 text-center md:text-left">
            <div>
              <span className="text-3xl font-bold">{remaining?.calories || 0}</span>
              <p className="text-xs text-text-muted uppercase font-bold tracking-widest">Kcal Remaining</p>
            </div>
            <div>
              <span className="text-3xl font-bold">{remaining?.protein || 0}g</span>
              <p className="text-xs text-text-muted uppercase font-bold tracking-widest">Protein Remaining</p>
            </div>
          </div>
        </div>

        <div className="glass-card flex flex-col justify-center">
          <h3 className="text-lg font-bold mb-4">Macro breakdown</h3>
          <div className="space-y-4">
            <MacroItem label="Carbs" value={consumed.carbsConsumed} color="#f59e0b" />
            <MacroItem label="Fat" value={consumed.fatConsumed} color="#ef4444" />
          </div>
          <Link to="/meal-log" className="btn btn-primary w-full mt-8 no-underline">Log a Meal</Link>
        </div>
      </div>

      {/* Suggestions */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Smart Suggestions</h2>
          <p className="text-sm text-text-muted italic">Based on your remaining targets</p>
        </div>
        
        {suggestions?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestions.map((food) => (
              <div key={food.id} className="glass-card flex items-center justify-between group">
                <div>
                  <h4 className="font-bold group-hover:text-primary transition-colors">{food.name}</h4>
                  <p className="text-xs text-text-muted">{food.calories} kcal • {food.protein}g protein</p>
                </div>
                <Link to={`/food-search?q=${food.name}`} className="w-8 h-8 rounded-full bg-slate-800 flex-center hover:bg-primary hover:text-[#064e3b] transition-all no-underline">+</Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card text-center py-12">
            <p className="text-text-muted">You've reached your goals! No suggestions needed.</p>
          </div>
        )}
      </section>
    </div>
  );
};

const MacroItem = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-text-muted font-medium">{label}</span>
      <span className="font-bold">{value}g</span>
    </div>
    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
      <div 
        className="h-full rounded-full transition-all duration-1000" 
        style={{ width: `${Math.min(100, (value / 100) * 100)}%`, backgroundColor: color }}
      ></div>
    </div>
  </div>
);

export default Dashboard;
