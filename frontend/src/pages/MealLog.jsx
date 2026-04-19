import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const MealLog = () => {
  const [meals, setMeals] = useState({});
  const [totals, setTotals] = useState({});
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchLog = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/meals?date=${date}`);
      setMeals(res.data.meals);
      setTotals(res.data.totals);
    } catch (err) {
      console.error('Failed to fetch meal log', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLog();
  }, [date]);

  const handleDelete = async (id) => {
    if (window.confirm('Remove this food entry?')) {
      try {
        await api.delete(`/meals/${id}`);
        fetchLog();
      } catch (err) {
        alert('Failed to delete meal');
      }
    }
  };

  if (loading) return <div className="flex-center h-[80vh]"><div className="loader"></div></div>;

  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { id: 'lunch', label: 'Lunch', icon: '☀️' },
    { id: 'dinner', label: 'Dinner', icon: '🌙' },
    { id: 'snacks', label: 'Snacks', icon: '🍎' },
  ];

  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Food Diary</h1>
          <p className="text-text-muted mt-1">Detailed breakdown of your daily intake</p>
        </div>
        <div className="flex items-center gap-4">
          <input 
            type="date" 
            className="form-input w-auto" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />
          <Link to="/food-search" className="btn btn-primary no-underline">+ Log Food</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {mealTypes.map((type) => (
            <section key={type.id} className="glass-card">
              <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{type.icon}</span>
                  <h3 className="text-xl font-bold">{type.label}</h3>
                </div>
                <Link to={`/food-search?mealType=${type.id}`} className="text-primary text-sm font-bold no-underline hover:underline">+ Add food</Link>
              </div>

              {meals[type.id]?.length > 0 ? (
                <div className="space-y-4">
                  {meals[type.id].map((meal) => (
                    <div key={meal.id} className="flex items-center justify-between group">
                      <div>
                        <h4 className="font-semibold">{meal.foodName}</h4>
                        <p className="text-xs text-text-muted">
                          {meal.quantity}g • {meal.calories} kcal • {meal.protein}g P • {meal.carbs}g C • {meal.fat}g F
                        </p>
                      </div>
                      <button 
                        onClick={() => handleDelete(meal.id)} 
                        className="p-2 text-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        title="Delete entry"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted italic py-2">No food logged for this meal.</p>
              )}
            </section>
          ))}
        </div>

        <div className="space-y-6">
          <div className="glass-card">
            <h3 className="text-lg font-bold mb-6">Daily Summary</h3>
            <div className="space-y-4">
              <SummaryRow label="Total Calories" value={totals.total_calories || 0} unit="kcal" />
              <SummaryRow label="Total Protein" value={totals.total_protein || 0} unit="g" />
              <SummaryRow label="Total Carbs" value={totals.total_carbs || 0} unit="g" />
              <SummaryRow label="Total Fat" value={totals.total_fat || 0} unit="g" />
            </div>
          </div>
          
          <div className="glass-card bg-indigo-500/10 border-indigo-500/20">
            <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">Pro Tip</h4>
            <p className="text-sm text-text-muted leading-relaxed">
              Tracking your food Consistently is the #1 predictor of achievement in fitness goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value, unit }) => (
  <div className="flex justify-between items-center py-2 border-b border-border last:border-0">
    <span className="text-text-muted">{label}</span>
    <span className="font-bold">{value}{unit}</span>
  </div>
);

const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default MealLog;
